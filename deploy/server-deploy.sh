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

echo "### [2/6] Freeing ports 80/443 from other web servers ..."
# Stop host-level web servers if present
systemctl stop nginx apache2 2>/dev/null || true
systemctl disable nginx apache2 2>/dev/null || true
# Stop any docker container (pre-installed panels like Traefik/Coolify/Dokploy)
# that publishes port 80 or 443 and is not part of this project
for c in $(docker ps --format '{{.Names}}' --filter publish=80; docker ps --format '{{.Names}}' --filter publish=443); do
  case "$c" in
    business_experts-*|business-experts-*|businessexperts-*) ;;
    *)
      echo "Stopping conflicting container: $c"
      docker update --restart=no "$c" >/dev/null 2>&1 || true
      docker stop "$c" >/dev/null 2>&1 || true
      ;;
  esac
done

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

echo "### [6/6] Starting proxy + certbot renewal ..."
docker compose up -d
docker compose exec proxy nginx -s reload || true
docker image prune -f

echo "### Deploy complete!"
