# Incident: Intermittent 502 responses

Symptoms:

- `logs/nginx.log` shows 502 and 504 responses.
- `logs/app.log` reports upstream and database connection errors.
- `configs/app.env` says `APP_PORT=8080`.
- `configs/nginx.conf` proxies `/api/` to port `3001`.

Practice tasks:

1. Find all 502 and 504 responses.
2. Compare `APP_PORT` with nginx upstream ports.
3. Find database host settings.
4. Write a short root-cause summary.
5. Create a safe config backup before editing.
