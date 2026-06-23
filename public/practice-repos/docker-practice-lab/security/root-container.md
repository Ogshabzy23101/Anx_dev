# Root Container Example

The insecure Dockerfile does not set a `USER`, so the process runs as root by default.

Practice:

```bash
grep '^USER' dockerfiles/insecure.Dockerfile
grep '^USER' dockerfiles/optimized.Dockerfile
```
