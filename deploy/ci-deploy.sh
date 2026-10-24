#!/usr/bin/env bash
# Called by GitHub Actions; the registry token arrives only on stdin.
set -Eeuo pipefail
umask 077

IMAGE_PREFIX="${1:?Image prefix required}"
IMAGE_TAG="${2:?Commit SHA required}"
MODE="${3:-deploy}"
REGISTRY_USER="${4:?Registry username required}"
[[ "$IMAGE_PREFIX" =~ ^ghcr.io/[a-z0-9_.-]+/[a-z0-9_.-]+$ ]] || exit 2
[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]] || exit 2
[[ "$REGISTRY_USER" =~ ^[a-zA-Z0-9_-]+(\[bot\])?$ ]] || exit 2
[[ "$MODE" = deploy || "$MODE" = prepare ]] || exit 2

BASE_DIR="${BE_DEPLOY_ROOT:-/opt/business-experts}"
SHARED_DIR="$BASE_DIR/shared"
RELEASE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
[[ "$RELEASE_DIR" = "$BASE_DIR/releases/$IMAGE_TAG" ]] || { echo "Unexpected release directory." >&2; exit 2; }
NGINX_DIR="${BE_NGINX_DIR:-/var/www/HealthOil/nginx/conf.d}"
CERT_DIR="${BE_CERT_DIR:-/var/www/HealthOil/certbot/conf/live/businessexperts.asia}"
PROXY_CONTAINER="${BE_PROXY_CONTAINER:-healthoil-nginx-1}"
STATE="$SHARED_DIR/state/current.env"
[[ -f "$SHARED_DIR/.env" ]] || { echo "Missing $SHARED_DIR/.env; preserve the old production environment." >&2; exit 1; }
mkdir -p "$SHARED_DIR/state"
exec 9>"$SHARED_DIR/state/deploy.lock"
flock -n 9 || { echo "Another deployment is running." >&2; exit 1; }

if [[ "$MODE" = deploy ]]; then
  [[ -s "$CERT_DIR/fullchain.pem" && -s "$CERT_DIR/privkey.pem" ]] || {
    echo "Issue the TLS certificate with Prepare shared VPS (tls phase), or use prepare mode before DNS cutover." >&2
    exit 1
  }
fi

export IMAGE_PREFIX IMAGE_TAG SHARED_DIR
DC=(docker compose --project-name business-experts-prod --env-file "$SHARED_DIR/.env" -f "$RELEASE_DIR/deploy/compose.production.yml")
PREVIOUS_TAG=""
PREVIOUS_PREFIX=""
if [[ -f "$STATE" ]]; then
  PREVIOUS_TAG="$(sed -n 's/^IMAGE_TAG=//p' "$STATE")"
  PREVIOUS_PREFIX="$(sed -n 's/^IMAGE_PREFIX=//p' "$STATE")"
  [[ "$PREVIOUS_TAG" =~ ^[0-9a-f]{40}$ && "$PREVIOUS_PREFIX" =~ ^ghcr.io/[a-z0-9_.-]+/[a-z0-9_.-]+$ ]] || {
    echo "Invalid previous release state; refusing to replace it." >&2; exit 1;
  }
  [[ -f "$BASE_DIR/releases/$PREVIOUS_TAG/deploy/compose.production.yml" ]] || {
    echo "Previous release files are missing; restore them before deploying." >&2; exit 1;
  }
fi

DOCKER_CONFIG="$(mktemp -d)"
export DOCKER_CONFIG
cleanup() {
  rm -f -- "$DOCKER_CONFIG/config.json"
  rmdir -- "$DOCKER_CONFIG" 2>/dev/null || true
}
trap cleanup EXIT

# No permanent registry token or production secrets are stored in the release.
docker login ghcr.io --username "$REGISTRY_USER" --password-stdin
"${DC[@]}" config --quiet
"${DC[@]}" pull --policy always
"${DC[@]}" run --rm --no-deps -T be-backend node --input-type=module -e \
  'import {validateProductionConfig} from "./src/productionConfig.js"; validateProductionConfig(); console.log("Production environment is valid.")'

MANAGED_NGINX=(business-experts.conf business-experts-proxy.inc business-experts-api.inc business-experts-tls.inc)
NGINX_BACKUP=""
if [[ "$MODE" = deploy ]]; then
  NGINX_BACKUP="$(mktemp -d "$SHARED_DIR/state/nginx-backup.XXXXXX")"
  for file in "${MANAGED_NGINX[@]}"; do
    if [[ -f "$NGINX_DIR/$file" ]]; then
      mkdir -p "$NGINX_BACKUP/$(dirname "$file")"
      cp "$NGINX_DIR/$file" "$NGINX_BACKUP/$file"
    fi
  done
fi

restore_nginx() {
  [[ -n "$NGINX_BACKUP" ]] || return 0
  for file in "${MANAGED_NGINX[@]}"; do
    if [[ -f "$NGINX_BACKUP/$file" ]]; then
      cp "$NGINX_BACKUP/$file" "$NGINX_DIR/$file"
    else
      rm -f -- "$NGINX_DIR/$file"
    fi
  done
  docker exec "$PROXY_CONTAINER" nginx -t && docker exec "$PROXY_CONTAINER" nginx -s reload
}

rollback() {
  local status=$?
  trap - ERR
  echo "Release failed; attempting to restore the previous application release." >&2
  if [[ -n "$PREVIOUS_TAG" ]]; then
    export IMAGE_TAG="$PREVIOUS_TAG" IMAGE_PREFIX="$PREVIOUS_PREFIX"
    local previous_file="$BASE_DIR/releases/$PREVIOUS_TAG/deploy/compose.production.yml"
    if docker compose --project-name business-experts-prod --env-file "$SHARED_DIR/.env" \
      -f "$previous_file" up -d --no-build --pull never --wait --wait-timeout 180; then
      echo "Previous application images restored: $PREVIOUS_TAG" >&2
    else
      echo "ROLLBACK FAILED. Inspect the application containers immediately." >&2
    fi
  else
    echo "No previous release exists; stopping the failed first deployment." >&2
    "${DC[@]}" stop || true
  fi
  restore_nginx || echo "NGINX RESTORE FAILED. Inspect Nginx immediately." >&2
  exit "$status"
}
trap rollback ERR

"${DC[@]}" up -d --no-build --pull never --wait --wait-timeout 180
"${DC[@]}" exec -T be-backend node -e \
  'fetch("http://127.0.0.1:5000/api/health").then(async r=>{const d=await r.json(); if(!r.ok || d.database!=="connected")process.exit(1)}).catch(()=>process.exit(1))'
for service in be-frontend be-admin be-analytics; do
  "${DC[@]}" exec -T "$service" wget -q -O - http://127.0.0.1/healthz >/dev/null
done

if [[ "$MODE" = deploy ]]; then
  for kind in proxy api tls; do
    install -m 644 "$RELEASE_DIR/deploy/nginx/snippets/be-$kind.conf" "$NGINX_DIR/business-experts-$kind.inc"
  done
  install -m 644 "$RELEASE_DIR/deploy/nginx/production.conf" "$NGINX_DIR/business-experts.conf"
  docker exec "$PROXY_CONTAINER" nginx -t
  docker exec "$PROXY_CONTAINER" nginx -s reload
  # Resolve directly to this VPS's local Nginx, keeping TLS/Host verification.
  # This prevents stale DNS from verifying the old VPS by mistake.
  for target in \
    businessexperts.asia/ \
    admin.businessexperts.asia/ \
    analytics.businessexperts.asia/ \
    api.businessexperts.asia/api/health \
    businessexperts.asia/api/home \
    admin.businessexperts.asia/api/health \
    analytics.businessexperts.asia/api/content \
    analytics.businessexperts.asia/ai-api/content; do
    host="${target%%/*}"
    content_type="$(curl --noproxy '*' --resolve "$host:443:127.0.0.1" --fail --silent --show-error \
      --retry 3 --retry-delay 2 --connect-timeout 5 --max-time 20 \
      --output /dev/null --write-out '%{content_type}' "https://$target")"
    if [[ "$target" = *"/api/"* || "$target" = *"/ai-api/"* ]]; then
      [[ "$content_type" = *application/json* ]]
    else
      [[ "$content_type" = *text/html* ]]
    fi
  done
fi

printf 'IMAGE_PREFIX=%s\nIMAGE_TAG=%s\n' "$IMAGE_PREFIX" "$IMAGE_TAG" > "$STATE.tmp"
mv "$STATE.tmp" "$STATE"
trap - ERR
echo "Release verified: $IMAGE_TAG ($MODE)."
