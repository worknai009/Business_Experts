#!/bin/bash
# Runs ON THE VPS on every deploy (called by GitHub Actions).
# Fully idempotent: installs Docker if missing, frees ports 80/443, builds,
# bootstraps SSL once, starts everything.
set -e

cd /var/www/Business_Experts

echo "### [1/6] Docker check ..."
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found - installing ..."
  curl -fsSL https://get.docker.com | sh
fi

echo "### [2/6] Port check ..."
# NOTE: this VPS also hosts other sites behind an existing reverse proxy.
# We must NOT stop other containers. Conflicting-port handling is done via
# the integration configured in docker-compose.yml instead.

echo "### [3/6] Building images ..."
docker compose build

echo "### [4/6] Starting app services ..."
docker compose up -d backend frontend admin

echo "### [5/6] SSL certificate ..."
if [ ! -f deploy/certbot/conf/live/realtyxpert.online/fullchain.pem ]; then
  echo "No certificate found - running first-time SSL bootstrap ..."
  bash deploy/init-letsencrypt.sh
else
  echo "Certificate already exists - skipping bootstrap."
fi

echo "### [6/7] Starting proxy + certbot renewal ..."
docker compose up -d
docker compose exec proxy nginx -s reload || true
docker image prune -f

echo "### [7/7] Verifying deployment ..."
sleep 8
docker compose ps

if ! docker compose ps proxy | grep -q "Up"; then
  echo "!!! PROXY IS NOT RUNNING. Recent proxy logs:"
  docker compose logs --tail=80 proxy || true
  echo "!!! Certificate files present:"
  ls -laR deploy/certbot/conf/live/ 2>/dev/null || echo "(no cert directory)"
  exit 1
fi

code=$(curl -sk -o /dev/null -w "%{http_code}" --max-time 15 https://localhost/ -H "Host: realtyxpert.online" || echo 000)
echo "Local HTTPS check returned: $code"
if [ "$code" = "000" ]; then
  echo "!!! HTTPS NOT RESPONDING. Proxy logs:"
  docker compose logs --tail=80 proxy || true
  exit 1
fi

echo "### Deploy complete - site is live!"
