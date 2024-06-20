FROM nginx:1.27.0

COPY ./entrypoint.sh /entrypoint.sh
COPY ./ssl /ssl

COPY ./nginx-include-base.conf /etc/nginx/templates/base.conf.inc.template
COPY ./nginx-include-gzip.conf /etc/nginx/templates/gzip.conf.inc.template
COPY ./nginx-include-ssl.conf /etc/nginx/templates/ssl.conf.inc.template
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

COPY ./public /var/www/html

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]
