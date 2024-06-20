#!/bin/sh

if [ "$CERT_MODE" == 'prod' ]; then
  createCertMode=""
  echo "INFO: Prod mode"
else
  createCertMode="--test-cert"
  echo "INFO: Staging mode"
fi

certName=main

function createCert(){
  domainsConfig=""
  for domain in ${DOMAINS}; do
    domainsConfig="$domainsConfig --domain $domain"
  done

  certbot certonly $createCertMode \
    --email $EMAIL --agree-tos --non-interactive \
    --cert-name $certName \
    --webroot \
    --webroot-path /var/www/certbot $domainsConfig
}

# fetch cert if not exists
if [ ! -f /etc/letsencrypt/live/$certName/privkey.pem ]; then
  createCert
fi

# try to renew every 10 days
while :; do
  certbot renew --cert-name $certName
  sleep 864000
done
