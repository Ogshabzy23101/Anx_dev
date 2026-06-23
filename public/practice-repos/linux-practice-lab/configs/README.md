# Config Labs

Purpose: practice inspecting, comparing, editing, and troubleshooting realistic service configuration files.

Files:

- `nginx.conf` - web server config with an intentional upstream port mismatch
- `app.env` - application environment settings with risky debug and secret examples
- `database.conf` - database connection settings with an intentional host issue
- `sshd_config` - SSH settings with security mistakes to identify

Sample tasks:

1. Find every configured port.
2. Locate risky `DEBUG` settings.
3. Identify the nginx upstream target.
4. Compare expected app port with nginx proxy port.
5. Find secrets that should not be committed.
6. Identify insecure SSH password authentication.
7. Use `sed` to preview a port change.
8. Copy a config before editing it.
9. Create a diff between original and modified config.
10. Search all configs for `TODO` comments.

Suggested commands: `cat`, `less`, `grep`, `sed`, `diff`, `cp`, `find`.

Expected outcome: you should be able to inspect configs safely and spot common operational mistakes.
