# Docker Practice Lab

This is a static Docker practice environment for DevOps Learning Lab. It is designed for WSL, Linux VMs, macOS Terminal, Legion Go development setups, and SSH-based Docker hosts.

The repository resembles a small containerized application estate: Dockerfiles, Compose stacks, runtime logs, security examples, networking notes, and troubleshooting scenarios. Some files are intentionally broken or insecure for practice.

## Setup

```bash
cd public/practice-repos/docker-practice-lab
find . -maxdepth 2 -type f | sort
```

Optional local copy:

```bash
cp -R public/practice-repos/docker-practice-lab ~/docker-practice-lab
cd ~/docker-practice-lab
```

## Difficulty progression

1. Beginner: start with `images/`, `containers/`, `dockerfiles/simple.Dockerfile`, and `logs/`.
2. Intermediate: move into `compose/`, `volumes/`, `networking/`, and optimized builds.
3. Advanced: combine `security/`, `troubleshooting/`, multi-stage builds, and production operations.

## Structure

- `images/` - image tagging, registry, and Docker Hub practice
- `containers/` - container inspection and runtime debugging examples
- `dockerfiles/` - simple, broken, multi-stage, insecure, and optimized Dockerfiles
- `compose/` - full stack and broken Compose examples
- `volumes/` - named volume and bind mount practice
- `networking/` - bridge network and DNS issue examples
- `logs/` - startup, env, connection, build, and health check failures
- `security/` - root user, exposed secret, and oversized image examples
- `troubleshooting/` - incident-style Docker scenarios

## Recommended exercises

1. Build `dockerfiles/simple.Dockerfile`.
2. Explain why `dockerfiles/broken.Dockerfile` fails.
3. Compare `insecure.Dockerfile` with `optimized.Dockerfile`.
4. Start the stack in `compose/compose-stack.yml`.
5. Find the missing environment variable in `logs/missing-env.log`.
6. Diagnose the network mismatch in `compose/compose-networking-issue.yml`.
7. Explain the volume issue in `compose/compose-volume-issue.yml`.
8. Identify the port conflict in `troubleshooting/port-conflict.md`.
9. Read `security/exposed-secret.md` and propose safer handling.
10. Write a CI build command using the optimized Dockerfile.
