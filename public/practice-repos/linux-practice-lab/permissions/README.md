# Permissions Labs

Purpose: practice secure file modes, key handling, and permission troubleshooting.

Sample tasks:

1. Inspect permissions on `private.key`.
2. Change `private.key` to mode `600`.
3. Change `public.key` to mode `644`.
4. Explain why private keys should not be group-readable.
5. Compare permissions before and after chmod.
6. Create a copy of `private.key` and lock it down.
7. Use `stat` to print numeric modes.
8. Find files readable by everyone.

Suggested commands: `ls -l`, `chmod`, `stat`, `find`, `cp`.

Expected outcome: you should understand safe permission patterns for secrets and deployment keys.
