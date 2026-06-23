# Security Labs

Purpose: practice identifying insecure Dockerfiles, root containers, exposed secrets, missing ignore rules, and oversized images.

Sample tasks:

1. Find `ENV API_TOKEN` in an insecure Dockerfile.
2. Search for missing `USER` instructions.
3. Explain why root containers are risky.
4. Add `.env` to `.dockerignore`.
5. Identify oversized image causes.
6. Suggest a slim base image.
7. Propose runtime environment variables instead of build secrets.
8. Run a container with dropped capabilities.

Suggested commands: `grep`, `docker history`, `docker image inspect`, `docker run --read-only`, `docker run --cap-drop`.

Expected outcome: you should recognize common container security mistakes before production.
