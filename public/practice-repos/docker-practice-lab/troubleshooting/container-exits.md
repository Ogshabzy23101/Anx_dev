# Container Exits Immediately

Symptoms:

- `docker ps -a` shows `Exited (1)`.
- Logs show `DATABASE_URL is required`.

Useful commands:

```bash
docker ps -a
docker logs app
docker inspect app
docker restart app
```
