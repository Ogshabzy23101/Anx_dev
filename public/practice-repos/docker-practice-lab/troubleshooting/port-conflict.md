# Port Conflict

Symptom:

```text
Bind for 0.0.0.0:8080 failed: port is already allocated
```

Practice:

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}'
docker compose -f compose/compose-stack.yml config
```
