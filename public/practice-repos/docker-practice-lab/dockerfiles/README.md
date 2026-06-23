# Dockerfile Labs

Purpose: practice reading, building, debugging, securing, and optimizing Dockerfiles.

Sample tasks:

1. Build `simple.Dockerfile`.
2. Explain the failure in `broken.Dockerfile`.
3. Identify why `insecure.Dockerfile` is risky.
4. Compare image layer order in `optimized.Dockerfile`.
5. Find stages in `multistage.Dockerfile`.
6. Add `.env` to `.dockerignore`.
7. Find every `RUN` instruction.
8. Explain when to use `npm ci --omit=dev`.
9. Add a non-root `USER`.
10. Build only the runtime stage.

Suggested commands: `docker build`, `docker history`, `grep`, `cat`, `docker image inspect`.

Expected outcome: you should be able to turn Dockerfile changes into safer, smaller, more repeatable images.
