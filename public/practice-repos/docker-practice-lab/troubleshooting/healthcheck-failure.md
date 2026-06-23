# Health Check Failure

Symptoms:

- Container status is `unhealthy`.
- `logs/healthcheck-failure.log` shows `/health` returning `503`.

Practice:

```bash
docker inspect app --format '{{json .State.Health}}'
docker logs app
grep -n healthcheck compose/compose-stack.yml
```
