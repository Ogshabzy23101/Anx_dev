# Logs Labs

Purpose: practice `grep`, `awk`, `sed`, `sort`, `uniq`, redirection, and incident triage against realistic logs.

Files:

- `app.log` - application events with INFO, WARN, ERROR, and DEBUG lines
- `auth.log` - SSH login success and failure events
- `nginx.log` - web access log lines
- `system.log` - service and kernel style events

Sample tasks:

1. Find all `ERROR` messages in `app.log`.
2. Count WARN entries across all logs.
3. Extract failed SSH login source IPs from `auth.log`.
4. Show only HTTP 500 responses in `nginx.log`.
5. Print the top requested paths in `nginx.log`.
6. Save app errors to `errors.txt`.
7. Use `grep -C 2` around request ID `req-1042`.
8. Use `awk` to count status codes.
9. Use `sed` to mask email addresses.
10. Build a one-hour incident timeline.

Suggested commands: `grep`, `awk`, `sed`, `sort`, `uniq`, `wc`, `head`, `tail`.

Expected outcome: you should be able to move from raw logs to a small incident report quickly.
