# Scripts Labs

Purpose: practice script inspection, permissions, simple debugging, and operational shell workflows.

Files:

- `deploy.sh` - deployment script intended to be executable
- `backup.sh` - backup script with a small path bug
- `cleanup.sh` - cleanup script intentionally missing execute permission
- `healthcheck.sh` - endpoint check script

Sample tasks:

1. List script permissions.
2. Make `deploy.sh` executable.
3. Run `bash -n` against every script.
4. Find the bug in `backup.sh`.
5. Fix the missing variable in `cleanup.sh`.
6. Use `grep` to find every `curl` command.
7. Add `set -euo pipefail` to a script copy.
8. Redirect script output to a log file.
9. Create a timestamped backup from the scripts directory.
10. Write a wrapper that runs `healthcheck.sh`.

Suggested commands: `ls -l`, `chmod`, `bash -n`, `grep`, `sed`, `cp`, `date`.

Expected outcome: you should be able to debug and safely execute small operations scripts.
