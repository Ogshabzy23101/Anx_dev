# Volume Mount Issue

`compose/compose-volume-issue.yml` mounts `./missing-config`, which does not exist.

Practice:

```bash
docker compose -f compose/compose-volume-issue.yml config
ls -la ./missing-config
```
