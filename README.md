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
curl --request POST --url https://localhost/api/v1/generic/load-samples
```


### TODO:
1. services/researcher/app/agents/editor.py
   1. Вынести весь output из plan_research весь task
2. возможность и жёстко ссылки задавать, и чтоб он сам их искал
   ? Какой агент ищет ссылки
3. run_initial_research - вернуть пустую строку, т.е. initial research бесполезен
4. Keep topic themes?
