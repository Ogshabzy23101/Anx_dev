#!/usr/bin/env bash
echo "Disk:"
df -h .
echo "Memory:"
free -h 2>/dev/null || vm_stat
echo "Recent errors:"
grep ERROR ../logs/app.log
