# Image Build Failure

The broken Dockerfile copies the whole context before `npm ci`, but the lockfile may be missing from the context.

Practice:

```bash
docker build --progress=plain -f dockerfiles/broken.Dockerfile .
cat logs/build-failure.log
```
