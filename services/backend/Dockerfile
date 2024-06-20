FROM node:22.2.0 as builder
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm/ npm ci

COPY . .
RUN npm run build


FROM node:22.2.0-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENTRYPOINT ["node", "dist/main.js"]
