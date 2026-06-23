# Debug Session

Symptoms:

- Container `backend` starts but returns 500.
- `docker logs backend` shows `DATABASE_URL is required`.
- `docker inspect backend` confirms `APP_PORT=8080`, but no database URL is present.

Useful commands:

```bash
docker ps -a
docker logs backend
docker inspect backend
docker exec backend env
```
