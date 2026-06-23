# Troubleshooting Labs

Purpose: practice combining logs, configs, scripts, and service clues into incident analysis.

Sample tasks:

1. Open `incident-502.md`.
2. Find all 502 and 504 log entries.
3. Compare nginx upstream ports with `APP_PORT`.
4. Find database connection errors.
5. Check for risky SSH settings.
6. Identify the backup script failure.
7. Write a short root-cause summary.
8. Save evidence into `incident-notes.txt`.
9. Recommend a rollback command.
10. List what you would monitor after the fix.

Suggested commands: `grep`, `awk`, `diff`, `cat`, `sed`, `journalctl`, `systemctl`.

Expected outcome: you should be able to connect symptoms to likely causes and document your reasoning.
