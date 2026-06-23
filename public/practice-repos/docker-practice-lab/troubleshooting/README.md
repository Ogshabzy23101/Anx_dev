# Troubleshooting Labs

Purpose: practice realistic Docker incident response across containers, images, Compose, volumes, ports, and health checks.

Sample tasks:

1. Investigate a container that exits immediately.
2. Diagnose a Dockerfile build failure.
3. Fix a Compose startup failure.
4. Explain a volume mount issue.
5. Resolve a port conflict.
6. Investigate an unhealthy container.
7. Capture logs before restart.
8. Write a root cause summary.
9. Recommend a rollback image tag.
10. Create an incident evidence bundle.

Suggested commands: `docker ps -a`, `docker logs`, `docker inspect`, `docker compose logs`, `docker build --progress=plain`, `docker port`.

Expected outcome: you should be able to investigate Docker incidents methodically.
