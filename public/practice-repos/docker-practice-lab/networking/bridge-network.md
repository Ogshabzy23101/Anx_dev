# Bridge Network Practice

Example:

```bash
docker network create lab-bridge
docker run -d --name backend --network lab-bridge nginx
docker run --rm --network lab-bridge alpine wget -qO- backend
```

Containers on a user-defined bridge network can resolve each other by container name.
