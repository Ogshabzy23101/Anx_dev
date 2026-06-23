# Linux Practice Lab

This is a small, static Linux practice environment for DevOps Learning Lab. It is designed to be copied into WSL, a Linux VM, macOS Terminal, a Legion Go development setup, or an SSH sandbox.

The files intentionally resemble a tiny production server: application logs, web server config, environment files, scripts, keys, CSV reports, and troubleshooting notes. Some files contain mistakes on purpose.

## Setup

From the app repository root:

```bash
cd public/practice-repos/linux-practice-lab
pwd
find . -maxdepth 2 -type f | sort
```

Optional local copy:

```bash
cp -R public/practice-repos/linux-practice-lab ~/linux-practice-lab
cd ~/linux-practice-lab
```

## Difficulty progression

1. Beginner: start with `navigation/`, `files/`, `logs`, and `permissions/`.
2. Intermediate: move into `configs/`, `scripts/`, `data/`, and `archives/`.
3. Advanced: combine `troubleshooting/`, `services/`, `networking/`, and `bash/` tasks.

## Structure

- `navigation/` - path and project-tree exercises
- `files/` - file inspection, comparison, and editing exercises
- `permissions/` - chmod, ownership, and access troubleshooting exercises
- `logs/` - log search, extraction, and incident report exercises
- `networking/` - ports, DNS, curl, and SSH-oriented exercises
- `processes/` - process inspection and lifecycle exercises
- `services/` - systemd and service troubleshooting exercises
- `bash/` - shell scripting exercises
- `troubleshooting/` - multi-step incident practice
- `archives/` - tar and gzip extraction exercises
- `configs/` - realistic service configuration files
- `data/` - CSV, server, and report files for text processing
- `scripts/` - deployment, backup, cleanup, and health check scripts

## Recommended exercises

1. Find all `ERROR` lines in `logs/app.log`.
2. Count failed SSH logins in `logs/auth.log`.
3. Extract unique IP addresses from `logs/nginx.log`.
4. Locate suspicious config values in `configs/app.env`.
5. Fix the syntax issue in `scripts/backup.sh`.
6. Make `scripts/deploy.sh` executable.
7. Restrict `permissions/private.key` to owner read/write.
8. Extract `archives/logs.tar.gz` into a temporary folder.
9. Generate a report of failed orders from `data/orders.csv`.
10. Use `find` to locate files below `navigation/projects/app/`.
