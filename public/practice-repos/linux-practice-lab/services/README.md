# Services Labs

Purpose: practice systemd service inspection and service troubleshooting patterns.

Sample tasks:

1. Read `nginx.service`.
2. Find the `ExecStart` command.
3. Identify the target used at boot.
4. Write a command to check nginx status.
5. Write a command to restart nginx.
6. Write a command to enable nginx at boot.
7. Search logs for `nginx.service`.
8. Explain what `After=network.target` means.

Suggested commands: `cat`, `grep`, `systemctl status`, `systemctl restart`, `systemctl enable`, `journalctl`.

Expected outcome: you should understand the basic shape of a service unit and common service commands.
