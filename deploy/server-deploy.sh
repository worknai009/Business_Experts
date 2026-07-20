#!/bin/bash
# Runs ON THE VPS on every deploy (called by GitHub Actions).
# Reverse proxy + SSL = shared Caddy (giftme-caddy-1) on the giftme_app network.
set -e

cd /var/www/Business_Experts

echo "### [1/4] Docker check ..."
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found - installing ..."
  curl -fsSL https://get.docker.com | sh
fi

echo "### [2/4] Building images ..."
docker compose build

echo "### [3/4] Starting services ..."
docker compose up -d --remove-orphans
docker image prune -f

echo "### [4/4] Verifying ..."
sleep 8
docker compose ps

for svc in be-backend be-frontend be-admin; do
  if ! docker compose ps "$svc" | grep -q "Up"; then
    echo "!!! $svc IS NOT RUNNING. Logs:"
    docker compose logs --tail=60 "$svc" || true
    exit 1
  fi
done

code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 15 https://realtyxpert.online/ || echo 000)
echo "Public HTTPS check returned: $code"
if [ "$code" != "200" ]; then
  echo "WARNING: site not reachable via Caddy yet (Caddyfile may need the realtyxpert.online entries)."
fi

echo "### Deploy complete!"
