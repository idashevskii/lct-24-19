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

## Основные использованные Open Source библиотеки

- Автономный агент [GPT Researcher](https://github.com/assafelovic/gpt-researcher)
- Модификация библиотеки мультиагентнов [LangGraph x GPT Researcher](https://github.com/assafelovic/gpt-researcher/tree/master/multi_agents)
- [Шаблон](https://github.com/idashevskii/nest-vuetify-nginx-pg-template) монорепозитория NestJS, Vue, Nginx, Postgres
- Vuetify шаблон [Materio](https://themeselection.com/)
