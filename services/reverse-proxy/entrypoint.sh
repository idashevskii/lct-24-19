#!/bin/sh

# Target SSL files. Used also in nginx.conf template
export SSL_CERT_FILE=/tmp/cert.pem
export SSL_KEY_FILE=/tmp/key.pem
export SSL_DHP_FILE=/ssl/dh-params.pem

# SSL files used as fallback
sslCertSelfSignedFile="/ssl/self-signed/cert.pem"
sslKeySelfSignedFile="/ssl/self-signed/key.pem"
# SSL files from Certbot
sslCertCertbotFile="/etc/letsencrypt/live/main/fullchain.pem"
sslKeyCertbotFile="/etc/letsencrypt/live/main/privkey.pem"

panic(){
  echo "[FATAL] $1"
  sleep 1 # avoid too fast boot loop
  exit 1
}

setupSsl(){
  if [ -f "$sslCertCertbotFile" ] && [ -f "$sslKeyCertbotFile" ]; then
    echo "[INFO] Setting up Certbot SSL files"
    cp "$sslCertCertbotFile" "$SSL_CERT_FILE"
    cp "$sslKeyCertbotFile" "$SSL_KEY_FILE"
  elif [ -f "$sslCertSelfSignedFile" ] && [ -f "$sslKeySelfSignedFile" ]; then
    echo "[INFO] Setting up Self-Signed SSL files"
    cp "$sslCertSelfSignedFile" "$SSL_CERT_FILE"
    cp "$sslKeySelfSignedFile" "$SSL_KEY_FILE"
  else
    panic "No SSL files found"
  fi
}

nginxRestart(){
  echo "[INFO] Restarting server"
  nginx -s reload
}

onCertbotSslChange(){
  echo "[INFO] SSL cert changed"
  setupSsl
  nginxRestart
}

watchForChanges(){
  local startFile=/tmp/server-started.time
  local watchedFile="$1"
  local onChange="$2"
  echo "[INFO] Watching for SSL cert changes"
  touch "$startFile"
  while :; do
    sleep 86400
    # sleep 1
    if [ "$watchedFile" -nt "$startFile" ] ; then
      touch "$startFile"
      $onChange
    fi
  done
}

# Initial setup
setupSsl

watchForChanges "$sslCertCertbotFile" onCertbotSslChange &

# Continue with original boot
exec /docker-entrypoint.sh "$@"
