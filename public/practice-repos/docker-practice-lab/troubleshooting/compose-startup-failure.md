# Compose Startup Failure

Symptoms:

- Backend starts before database is ready.
- Health check fails during cold start.
- `POSTGRES_PASSWORD` is missing in `broken-compose.yml`.

Practice:

```bash
docker compose -f compose/broken-compose.yml config
docker compose -f compose/broken-compose.yml logs
```
