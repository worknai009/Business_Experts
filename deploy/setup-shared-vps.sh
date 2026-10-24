#!/usr/bin/env bash
# Integrate only Business Experts with the destination's existing Nginx/Certbot.
set -Eeuo pipefail
[[ "$EUID" -eq 0 ]] || { echo "Run as root." >&2; exit 1; }
ACTION="${1:---prepare}"
[[ "$ACTION" = --prepare || "$ACTION" = --tls ]] || exit 2
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED=/opt/business-experts/shared
PROXY=healthoil-nginx-1
CERTBOT=healthoil-certbot-1
CONFIG_DIR=/var/www/HealthOil/nginx/conf.d
CERT_ROOT=/var/www/HealthOil/certbot/conf
docker compose version
docker network inspect healthoil_app-network >/dev/null
actual_mount="$(docker inspect "$PROXY" --format '{{range .Mounts}}{{if eq .Destination "/etc/nginx/conf.d"}}{{.Source}}{{end}}{{end}}')"
[[ "$actual_mount" = "$CONFIG_DIR" ]] || { echo "Proxy mount differs from the inspected configuration." >&2; exit 1; }
actual_certs="$(docker inspect "$PROXY" --format '{{range .Mounts}}{{if eq .Destination "/etc/letsencrypt"}}{{.Source}}{{end}}{{end}}')"
[[ "$actual_certs" = "$CERT_ROOT" ]] || { echo "Certificate mount differs from the inspected configuration." >&2; exit 1; }
docker exec "$PROXY" nginx -t
install -d -m 755 /opt/business-experts/releases "$SHARED"
install -d -m 700 "$SHARED/state"
install -d -o 1000 -g 1000 -m 755 "$SHARED/uploads" "$SHARED/ai-data"
if [[ -d /var/www/Business_Experts/backend/uploads ]]; then
  cp -an /var/www/Business_Experts/backend/uploads/. "$SHARED/uploads/"
fi
if [[ ! -e "$SHARED/ai-data/site_content.json" && -f /var/www/Business_Experts/backend/src/ai/site_content.json ]]; then
  cp /var/www/Business_Experts/backend/src/ai/site_content.json "$SHARED/ai-data/site_content.json"
fi
chown -R 1000:1000 "$SHARED/uploads" "$SHARED/ai-data"
[[ -f "$SHARED/.env" ]] || { echo "Private production environment is missing." >&2; exit 1; }
chmod 600 "$SHARED/.env"

# Existing site files are never modified. Only create our own HTTP challenge site.
site="$CONFIG_DIR/business-experts.conf"
if [[ ! -e "$site" ]]; then
  install -m 644 "$PROJECT_DIR/deploy/nginx/bootstrap.conf" "$site"
  if docker exec "$PROXY" nginx -t; then
    docker exec "$PROXY" nginx -s reload
  else
    rm -f -- "$site"
    echo "Business Experts bootstrap config was rejected and removed." >&2
    exit 1
  fi
fi
if [[ "$ACTION" = --prepare ]]; then
  echo "Shared proxy and application directories prepared; existing containers were not restarted."
  exit 0
fi

TLS_EMAIL="${TLS_EMAIL:-${2:-}}"
if [[ -z "$TLS_EMAIL" ]]; then
  TLS_EMAIL="$(sed -n "s/^GMAIL_USER='\([^']*\)'$/\1/p" "$SHARED/.env" | head -n 1)"
fi
if [[ -z "$TLS_EMAIL" ]]; then
  TLS_EMAIL="$(sed -n "s/^ADMIN_EMAIL='\([^']*\)'$/\1/p" "$SHARED/.env" | head -n 1)"
fi
[[ "$TLS_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]] || {
  echo "A valid TLS contact email is required." >&2; exit 1;
}
docker exec "$CERTBOT" certbot certonly --non-interactive --agree-tos --email "$TLS_EMAIL" \
  --webroot --webroot-path /var/www/certbot --cert-name businessexperts.asia \
  -d businessexperts.asia -d admin.businessexperts.asia \
  -d analytics.businessexperts.asia -d api.businessexperts.asia
install -m 755 "$PROJECT_DIR/deploy/renew-shared-cert.sh" /usr/local/sbin/business-experts-renew
cat > /etc/systemd/system/business-experts-renew.service <<'UNIT'
[Unit]
Description=Renew Business Experts certificate and reload shared Nginx if needed
After=docker.service
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/business-experts-renew
UNIT
cat > /etc/systemd/system/business-experts-renew.timer <<'UNIT'
[Unit]
Description=Check Business Experts certificate hourly
[Timer]
OnBootSec=15min
OnUnitActiveSec=1h
RandomizedDelaySec=10min
Persistent=true
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable --now business-experts-renew.timer
echo "Certificate and renewal timer prepared. Run the application deployment to activate HTTPS routes."
