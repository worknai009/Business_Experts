#!/usr/bin/env bash
# Run on the Linux VPS from any directory.
set -Eeuo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"
MODE="${1:-}"
ACTION="${2:-deploy}"
ENV_CHECK=()
case "$MODE" in
  existing) COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.live.yml --profile standalone); ENV_CHECK=(--existing) ;;
  existing-shared) COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.shared.yml -f docker-compose.live.yml); ENV_CHECK=(--existing) ;;
  standalone) COMPOSE=(docker compose --profile standalone) ;;
  shared) COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.shared.yml) ;;
  *) echo "Usage: bash deploy/server-deploy.sh [existing|existing-shared|standalone|shared]" >&2; exit 1 ;;
esac
case "$ACTION" in
  deploy|--prepare) ;;
  *) echo "Second argument must be --prepare or omitted." >&2; exit 1 ;;
esac

command -v docker >/dev/null || { echo "Install Docker Engine and the Compose plugin first (see deploy/README.md)." >&2; exit 1; }
docker compose version >/dev/null
docker info >/dev/null
command -v curl >/dev/null || { echo "Install curl first." >&2; exit 1; }

# Uses Node in Docker so the VPS needs no system Node/npm installation.
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PROJECT_DIR:/workspace" -w /workspace node:24-alpine node deploy/init-env.mjs --check "${ENV_CHECK[@]}"
"${COMPOSE[@]}" config --quiet
"${COMPOSE[@]}" build --pull

# Give the non-root backend access to existing host uploads without deleting media.
mkdir -p backend/uploads
docker run --rm --network none -v "$PROJECT_DIR/backend/uploads:/uploads" \
  node:24-alpine sh -c 'chown -R 1000:1000 /uploads'

if [[ "$MODE" = standalone || "$MODE" = existing ]]; then
  "${COMPOSE[@]}" run --rm --no-deps be-caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
fi

on_error() {
  echo "Deployment failed. Container status and recent logs:" >&2
  "${COMPOSE[@]}" ps || true
  "${COMPOSE[@]}" logs --tail=50 be-backend be-frontend be-admin be-analytics || true
}
trap on_error ERR

if [ "$ACTION" = --prepare ]; then
  # Stage the application before DNS cutover without publishing ports or starting Caddy.
  "${COMPOSE[@]}" up -d --wait --wait-timeout 180 be-backend be-frontend be-admin be-analytics
  "${COMPOSE[@]}" exec -T be-backend node -e \
    'fetch("http://127.0.0.1:5000/api/health").then(async r=>{if(!r.ok)process.exit(1); const data=await r.json(); if(data.database!=="connected")process.exit(1); console.log("Existing database connection is healthy.")}).catch(()=>process.exit(1))'
  echo "Application staged. Verify migrated files before DNS cutover; the proxy and public DNS were not changed."
  exit 0
fi

"${COMPOSE[@]}" up -d --wait --wait-timeout 180
if [[ "$MODE" = standalone || "$MODE" = existing ]]; then
  # Existing proxy containers also need to load edited bind-mounted configuration.
  "${COMPOSE[@]}" exec -T be-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
fi
"${COMPOSE[@]}" ps

# Verify real TLS certificates and routes, allowing initial certificate issuance.
for url in \
  https://businessexperts.asia/ \
  https://admin.businessexperts.asia/ \
  https://analytics.businessexperts.asia/ \
  https://api.businessexperts.asia/api/health \
  https://businessexperts.asia/api/home \
  https://admin.businessexperts.asia/api/health \
  https://analytics.businessexperts.asia/api/content \
  https://analytics.businessexperts.asia/ai-api/content; do
  echo "Checking $url"
  content_type="$(curl --fail --silent --show-error --retry 8 --retry-delay 5 --retry-all-errors \
    --connect-timeout 5 --max-time 15 --output /dev/null --write-out '%{content_type}' "$url")"
  if [[ "$url" == *"/api/"* || "$url" == *"/ai-api/"* ]]; then
    [[ "$content_type" == *"application/json"* ]] || {
      echo "Expected JSON from $url, received $content_type. Check DNS and proxy routing." >&2
      exit 1
    }
  else
    [[ "$content_type" == *"text/html"* ]] || {
      echo "Expected HTML from $url, received $content_type." >&2
      exit 1
    }
  fi
done
echo "Deployment verified for all four domains."
