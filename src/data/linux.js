export const linuxReference = [
  {
    category: "Navigation",
    commands: [
      { command: "pwd", description: "Print the current working directory." },
      { command: "ls -la", description: "List all files with permissions and metadata." },
      { command: "cd /path", description: "Change the current directory." },
      { command: "find /var -name '*.log'", description: "Find matching files below a path." },
    ],
  },
  {
    category: "Files & text",
    commands: [
      { command: "cp -r src dest", description: "Copy a directory recursively." },
      { command: "mv old new", description: "Move or rename a file." },
      { command: "grep -R 'error' .", description: "Search recursively for matching text." },
      { command: "tail -f app.log", description: "Follow lines appended to a file." },
    ],
  },
  {
    category: "Permissions & processes",
    commands: [
      { command: "chmod 755 script.sh", description: "Set owner rwx and group/other rx permissions." },
      { command: "chown user:group file", description: "Change file owner and group." },
      { command: "ps aux", description: "Show running processes for all users." },
      { command: "kill -15 PID", description: "Ask a process to terminate gracefully." },
    ],
  },
  {
    category: "System & network",
    commands: [
      { command: "df -h", description: "Show filesystem disk usage in readable units." },
      { command: "du -sh directory", description: "Show the total size of a directory." },
      { command: "systemctl status nginx", description: "Inspect a systemd service." },
      { command: "curl -I https://example.com", description: "Fetch HTTP response headers." },
    ],
  },
];

export const linuxFlashcards = [
  { id: "fc-pwd", front: "What does `pwd` return?", back: "The absolute path of the current working directory." },
  { id: "fc-pipe", front: "What does the pipe operator `|` do?", back: "It sends one command's standard output to the next command's standard input." },
  { id: "fc-sudo", front: "What is `sudo` used for?", back: "It runs a command with the privileges of another user, usually root." },
  { id: "fc-644", front: "What permissions does `chmod 644` set?", back: "Owner: read/write. Group and others: read only." },
  { id: "fc-grep", front: "Which command searches text for a pattern?", back: "`grep` searches input or files for lines matching a pattern." },
  { id: "fc-symlink", front: "What does `ln -s target link` create?", back: "A symbolic link named `link` that points to `target`." },
];

export const linuxMultipleChoice = [
  {
    id: "mc-hidden",
    question: "Which command lists hidden files in the current directory?",
    options: ["ls -h", "ls -a", "find -h", "show --hidden"],
    answer: 1,
    explanation: "`ls -a` includes entries whose names begin with a dot.",
  },
  {
    id: "mc-process",
    question: "Which signal does plain `kill PID` send by default?",
    options: ["SIGKILL (9)", "SIGHUP (1)", "SIGTERM (15)", "SIGSTOP (19)"],
    answer: 2,
    explanation: "`kill` defaults to SIGTERM, giving the process a chance to clean up.",
  },
  {
    id: "mc-redirect",
    question: "Which operator appends standard output to a file?",
    options: [">", ">>", "<", "2>"],
    answer: 1,
    explanation: "`>>` appends output. A single `>` replaces the file's contents.",
  },
  {
    id: "mc-disk",
    question: "Which command reports free space on mounted filesystems?",
    options: ["free -h", "du -h", "df -h", "lsblk -f"],
    answer: 2,
    explanation: "`df` reports filesystem usage; `-h` formats sizes for humans.",
  },
  {
    id: "mc-owner",
    question: "In `chmod 750 deploy.sh`, what can the group do?",
    options: ["Read only", "Read and execute", "Write and execute", "Everything"],
    answer: 1,
    explanation: "The middle digit is 5, which combines read (4) and execute (1).",
  },
];

export const linuxCommandQuiz = [
  {
    id: "cmd-dir",
    prompt: "Create a directory named `releases`, including missing parent directories.",
    answers: ["mkdir -p releases", "mkdir --parents releases"],
    explanation: "The `-p` or `--parents` flag creates missing parents and avoids an error if the directory exists.",
  },
  {
    id: "cmd-log",
    prompt: "Show the last 50 lines of `app.log`.",
    answers: ["tail -n 50 app.log", "tail -50 app.log", "tail --lines=50 app.log"],
    explanation: "`tail -n 50` prints the final 50 lines. GNU tail also accepts the listed alternatives.",
  },
  {
    id: "cmd-owner",
    prompt: "Recursively change `/srv/app` ownership to user `deploy` and group `ops`.",
    answers: ["chown -R deploy:ops /srv/app", "chown --recursive deploy:ops /srv/app"],
    explanation: "`chown -R user:group path` applies ownership recursively.",
  },
  {
    id: "cmd-search",
    prompt: "Case-insensitively search `server.log` for the word `failed`.",
    answers: ["grep -i failed server.log", "grep --ignore-case failed server.log", "grep -i 'failed' server.log", "grep -i \"failed\" server.log"],
    explanation: "`grep -i` performs a case-insensitive pattern search.",
  },
];
