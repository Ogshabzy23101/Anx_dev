# Processes Labs

Purpose: practice reading process snapshots and identifying resource-heavy commands.

Sample tasks:

1. Find the highest CPU process in `process-snapshot.txt`.
2. Extract all PIDs.
3. Filter for worker processes.
4. Sort by memory percentage.
5. Identify which user owns nginx.
6. Save high CPU rows to a report.
7. Build a safe `kill -TERM` command for the worker PID.
8. Explain when not to use `kill -9`.

Suggested commands: `awk`, `grep`, `sort`, `head`, `ps`, `pgrep`, `kill`.

Expected outcome: you should be able to reason about processes before stopping them.
