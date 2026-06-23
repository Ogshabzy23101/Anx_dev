# Bind Mount Notes

Common issue:

```bash
docker run --rm -v "$PWD":/workspace alpine touch /workspace/output.txt
```

The created file may be owned by root on the host. A safer local-development pattern is:

```bash
docker run --rm -u "$(id -u):$(id -g)" -v "$PWD":/workspace alpine touch /workspace/output.txt
```
