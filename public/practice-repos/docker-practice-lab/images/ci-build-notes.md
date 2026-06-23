# CI Build Notes

Example CI image workflow:

```bash
docker build -t registry.example.com/platform/app:$GITHUB_SHA -f dockerfiles/optimized.Dockerfile .
docker push registry.example.com/platform/app:$GITHUB_SHA
docker tag registry.example.com/platform/app:$GITHUB_SHA registry.example.com/platform/app:$GITHUB_REF_NAME
```

Build once, promote the same image digest, and avoid rebuilding separately for staging and production.
