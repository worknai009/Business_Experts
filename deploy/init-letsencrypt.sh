#!/bin/bash
# One-time SSL bootstrap for realtyxpert.online
# Run this ON THE SERVER from the project root: bash deploy/init-letsencrypt.sh
set -e

domains=(realtyxpert.online www.realtyxpert.online admin.realtyxpert.online api.realtyxpert.online)
email="recruitrise82@gmail.com" # change if needed
staging=0 # set to 1 to test against Let's Encrypt staging (avoids rate limits)

data_path="./deploy/certbot"
rsa_key_size=4096

if [ -d "$data_path/conf/live/realtyxpert.online" ]; then
  read -p "Existing certificate found. Replace it? (y/N) " decision
  if [ "$decision" != "y" ] && [ "$decision" != "Y" ]; then
    exit
  fi
fi

echo "### Creating dummy certificate so nginx can start ..."
path="/etc/letsencrypt/live/realtyxpert.online"
mkdir -p "$data_path/conf/live/realtyxpert.online"
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot

echo "### Starting proxy ..."
docker compose up -d proxy

echo "### Removing dummy certificate ..."
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/realtyxpert.online && \
  rm -rf /etc/letsencrypt/archive/realtyxpert.online && \
  rm -rf /etc/letsencrypt/renewal/realtyxpert.online.conf" certbot

echo "### Requesting real certificate ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

staging_arg=""
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --email $email \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --no-eff-email \
    --force-renewal" certbot

echo "### Reloading proxy ..."
docker compose exec proxy nginx -s reload

echo "### Done! Your site should now be live with HTTPS."
