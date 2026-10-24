#!/usr/bin/env bash
set -euo pipefail
STATE=/opt/business-experts/shared/state
CERT=/var/www/HealthOil/certbot/conf/live/businessexperts.asia/fullchain.pem
exec 9>"$STATE/cert-renew.lock"
flock -n 9 || exit 0
docker exec healthoil-certbot-1 certbot renew --quiet --cert-name businessexperts.asia
current="$(sha256sum "$CERT" | cut -d ' ' -f 1)"
previous="$(cat "$STATE/loaded-cert.sha256" 2>/dev/null || true)"
if [[ "$current" != "$previous" ]]; then
  docker exec healthoil-nginx-1 nginx -t
  docker exec healthoil-nginx-1 nginx -s reload
  printf '%s\n' "$current" > "$STATE/loaded-cert.sha256"
fi
