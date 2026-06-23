# Docker Hub Push Notes

Example flow:

```bash
docker login
docker tag practice/simple-app username/simple-app:1.0.0
docker push username/simple-app:1.0.0
```

Avoid using `latest` for production deployments unless your deployment process also pins and records the digest.
