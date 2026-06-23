# Logs Labs

Purpose: practice reading Docker logs, build failures, missing environment variables, connection failures, and health check errors.

Sample tasks:

1. Find missing environment variable errors.
2. Find database connection refused messages.
3. Read the build failure log.
4. Identify the failing Dockerfile instruction.
5. Extract all `ERROR` lines.
6. Save recent logs to a report.
7. Build a health check failure summary.
8. Compare app startup logs with Compose settings.

Suggested commands: `docker logs`, `grep`, `awk`, `tail`, `docker compose logs`, `docker build --progress=plain`.

Expected outcome: you should be able to move from Docker log output to an actionable fix.
