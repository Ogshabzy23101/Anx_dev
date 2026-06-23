# Oversized Image Example

Common causes:

- Full OS base image when an alpine or distroless image would work.
- Installing dev dependencies in runtime images.
- Copying the whole repository before dependency installation.
- Missing `.dockerignore`.
- Leaving package manager caches behind.
