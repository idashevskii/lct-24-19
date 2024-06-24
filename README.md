## Dev

Запуск локально

```bash
docker compose up -d --build
```

Открыть в браузере: `https://localhost/ui/`


### NestJS CLI

In `services/backend` directory:

```bash
npx nest
```


## Установка тестовых данных

```bash
curl --request POST --url https://localhost/api/v1/generic/load-samples --insecure
```
