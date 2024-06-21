FROM node:22.2.0 AS builder
WORKDIR /app
ARG BASE_URI
ENV BASE_URI=$BASE_URI

COPY ./package*.json .
RUN --mount=type=cache,target=/root/.npm/ npm ci

COPY . .
RUN npm run build



FROM nginx:1.27.0
ARG BASE_URI
ENV BASE_URI=$BASE_URI
WORKDIR /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=builder /app/public/env.js /etc/nginx/templates/env.js.template
COPY --from=builder /app/dist ./$BASE_URI/
