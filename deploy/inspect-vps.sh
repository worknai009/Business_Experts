#!/usr/bin/env bash
# Read-only inventory for integrating with the destination's existing proxy.
set -euo pipefail
whoami
uname -m
sed -nE '/^(ID|VERSION_ID|PRETTY_NAME)=/p' /etc/os-release
docker ps --format 'table {{.Names}}\t{{.Ports}}'
for container in healthoil-nginx-1 healthoil-certbot-1; do
  if docker inspect "$container" >/dev/null 2>&1; then
    docker inspect "$container" --format 'Container={{.Name}} Image={{.Config.Image}}'
    docker inspect "$container" --format 'Mounts={{json .Mounts}}'
    docker inspect "$container" --format 'Networks={{json .NetworkSettings.Networks}}'
  fi
done
docker exec healthoil-nginx-1 nginx -v
# Print routing/paths, never full configs or environment values.
docker exec healthoil-nginx-1 sh -c \
  'awk "/^[[:space:]]*(include|server_name|listen|root|resolver|ssl_certificate|ssl_certificate_key)[[:space:]]/ {print FILENAME \":\" FNR \":\" \$0}" /etc/nginx/nginx.conf /etc/nginx/conf.d/*.conf'
if [[ -f /opt/business-experts/shared/.env ]]; then
  echo 'Business Experts production environment: present (contents not printed)'
else
  echo 'Business Experts production environment: not configured'
fi
if [[ -d /var/www/Business_Experts ]]; then
  git -C /var/www/Business_Experts rev-parse --short HEAD
fi
