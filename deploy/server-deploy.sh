#!/bin/bash
# Runs ON THE VPS on every deploy (called by GitHub Actions).
# Fully idempotent: installs Docker if missing, builds, bootstraps SSL once, starts everything.
set -e

cd /var/www/Business_Experts

echo "### [1/5] Docker check ..."
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found - installing ..."
  curl -fsSL https://get.docker.com | sh
fi

echo "### [2/5] Building images ..."
docker compose build

echo "### [3/5] Starting app services ..."
docker compose up -d backend frontend admin

echo "### [4/5] SSL certificate ..."
if [ ! -f deploy/certbot/conf/live/realtyxpert.online/fullchain.pem ]; then
  echo "No certificate found - running first-time SSL bootstrap ..."
  bash deploy/init-letsencrypt.sh
else
  echo "Certificate already exists - skipping bootstrap."
fi

echo "### [5/5] Starting proxy + certbot renewal ..."
docker compose up -d
docker compose exec proxy nginx -s reload || true
docker image prune -f

echo "### Deploy complete!"
