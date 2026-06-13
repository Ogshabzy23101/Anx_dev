const categoryUseCases = {
  Navigation: "confirming paths and moving safely through deployment workspaces",
  "File and directory management": "preparing releases, configuration trees, and automation artifacts",
  "Viewing files": "inspecting configuration, logs, and generated output without changing it",
  "Text processing": "turning command and log output into useful operational signals",
  Search: "locating files, settings, and evidence during incident response",
  "Permissions and ownership": "securing application files and service accounts",
  "Users and groups": "administering identities used by people, services, and automation",
  Processes: "finding and controlling workloads on a host",
  "System monitoring": "checking host health and identifying resource pressure",
  "Disk and storage": "diagnosing capacity, mounts, filesystems, and block devices",
  Networking: "testing connectivity, DNS, routes, ports, and HTTP services",
  "Package management": "installing and maintaining system software consistently",
  "Services and logs": "operating systemd services and investigating host logs",
  "Compression and archives": "packaging, transferring, and restoring deployment artifacts",
  "SSH and remote access": "accessing and transferring data between Linux hosts securely",
  "Environment and shell": "controlling shell behavior and runtime configuration",
  "Bash scripting": "building repeatable operational automation",
  "DevOps troubleshooting": "combining host evidence to isolate production failures",
};

function entry(
  category,
  difficulty,
  command,
  fullMeaning,
  basicExplanation,
  commonSyntax,
  commonFlags,
  examples,
  commonMistake,
  relatedCommands,
  answers = examples,
) {
  return {
    category,
    difficulty,
    command,
    fullMeaning,
    basicExplanation,
    professionalExplanation: `${basicExplanation} In operational workflows, it provides a repeatable way to work with Linux state and command output.`,
    commonSyntax,
    commonFlags,
    examples,
    devOpsUseCase: `Useful for ${categoryUseCases[category]}.`,
    commonMistake,
    relatedCommands,
    answers,
  };
}

const rows = {
  Navigation: [
    ["beginner", "pwd", "Print working directory", "Shows the absolute path of your current directory.", "pwd", [], ["pwd"], "Assuming the shell is in the project directory without checking.", ["cd", "ls"]],
    ["beginner", "cd", "Change directory", "Moves the shell to another directory.", "cd [directory]", ["-", "~"], ["cd /srv/app", "cd -"], "Using a relative path from the wrong starting directory.", ["pwd", "pushd"]],
    ["beginner", "ls", "List", "Lists files and directories.", "ls [options] [path]", ["-a", "-l", "-h", "-t"], ["ls -lah", "ls -lt /var/log"], "Forgetting `-a` when looking for dotfiles.", ["tree", "find"]],
    ["intermediate", "tree", "Directory tree", "Displays directories and files as an indented tree.", "tree [options] [path]", ["-a", "-L", "-d"], ["tree -L 2 ."], "Dumping a huge filesystem tree without a depth limit.", ["ls", "find"]],
    ["intermediate", "pushd", "Push directory", "Changes directory and saves the previous location on a stack.", "pushd directory", ["-n"], ["pushd /etc/nginx"], "Building an unclear directory stack in long scripts.", ["popd", "dirs"]],
    ["intermediate", "popd", "Pop directory", "Returns to a directory saved by `pushd`.", "popd", ["-n"], ["popd"], "Calling it when the directory stack is empty.", ["pushd", "dirs"]],
  ],
  "File and directory management": [
    ["beginner", "touch", "Touch", "Creates an empty file or updates file timestamps.", "touch [options] file", ["-a", "-m", "-t"], ["touch app.log"], "Using it when file content is required.", ["mkdir", "stat"]],
    ["beginner", "mkdir", "Make directory", "Creates one or more directories.", "mkdir [options] directory", ["-p", "-m"], ["mkdir -p releases/current"], "Omitting `-p` when parent directories may not exist.", ["rmdir", "install"]],
    ["beginner", "cp", "Copy", "Copies files or directories.", "cp [options] source destination", ["-r", "-a", "-i", "-v"], ["cp -a config/ backup/config/"], "Using `-r` when metadata-preserving `-a` is needed.", ["rsync", "mv"]],
    ["beginner", "mv", "Move", "Moves or renames files and directories.", "mv [options] source destination", ["-i", "-n", "-v"], ["mv app.env app.env.bak"], "Overwriting a destination unintentionally.", ["cp", "rename"]],
    ["beginner", "rm", "Remove", "Deletes files or directory trees.", "rm [options] path", ["-r", "-f", "-i"], ["rm -r build/"], "Combining `-r` and `-f` without verifying the path.", ["rmdir", "find"]],
    ["intermediate", "ln", "Link", "Creates hard links or symbolic links.", "ln [options] target link", ["-s", "-f", "-n"], ["ln -s releases/v2 current"], "Creating a relative symlink that breaks from another location.", ["readlink", "realpath"]],
  ],
  "Viewing files": [
    ["beginner", "cat", "Concatenate", "Prints and combines file contents.", "cat [options] [file...]", ["-n", "-A"], ["cat /etc/os-release"], "Using it on a very large or binary file.", ["less", "tac"]],
    ["beginner", "less", "Less pager", "Views long text one screen at a time.", "less [options] file", ["-N", "-S", "+F"], ["less +F app.log"], "Forgetting that `q` exits the pager.", ["more", "tail"]],
    ["beginner", "head", "Head", "Prints the first lines of a file.", "head [options] file", ["-n", "-c"], ["head -n 20 access.log"], "Assuming the default is more than ten lines.", ["tail", "sed"]],
    ["beginner", "tail", "Tail", "Prints the last lines of a file and can follow updates.", "tail [options] file", ["-n", "-f", "-F"], ["tail -F app.log"], "Using `-f` when log rotation requires `-F`.", ["head", "journalctl"]],
    ["intermediate", "nl", "Number lines", "Prints file content with line numbers.", "nl [options] file", ["-ba", "-w"], ["nl -ba nginx.conf"], "Expecting blank lines to be numbered without `-ba`.", ["cat", "awk"]],
    ["intermediate", "stat", "File status", "Shows detailed file metadata, timestamps, size, and permissions.", "stat [options] file", ["-c", "-f"], ["stat -c '%U %G %a %n' deploy.sh"], "Confusing file metadata with filesystem metadata.", ["ls", "file"]],
  ],
  "Text processing": [
    ["beginner", "grep", "Global regular expression print", "Prints lines that match a text pattern.", "grep [options] pattern [file...]", ["-i", "-R", "-n", "-E", "-v"], ["grep -Rni 'error' logs/"], "Forgetting to quote patterns containing shell characters.", ["ripgrep", "awk"]],
    ["intermediate", "awk", "Aho, Weinberger, and Kernighan", "Processes column-oriented text using patterns and actions.", "awk 'pattern { action }' file", ["-F", "-v"], ["awk -F: '{print $1}' /etc/passwd"], "Using the wrong field separator.", ["cut", "sed"]],
    ["intermediate", "sed", "Stream editor", "Transforms text streams with substitutions and selections.", "sed [options] 'script' file", ["-n", "-E", "-i"], ["sed -E 's/http:/https:/' config"], "Using in-place editing without a backup.", ["awk", "tr"]],
    ["beginner", "sort", "Sort", "Sorts lines of text.", "sort [options] [file]", ["-n", "-r", "-k", "-u"], ["sort -nrk 2 usage.txt"], "Sorting numbers lexically without `-n`.", ["uniq", "cut"]],
    ["beginner", "uniq", "Unique", "Collapses or counts adjacent duplicate lines.", "uniq [options] [file]", ["-c", "-d", "-u"], ["sort hosts.txt | uniq -c"], "Forgetting to sort input before counting duplicates.", ["sort", "wc"]],
    ["beginner", "|", "Pipe operator", "Sends one command's standard output to the next command's standard input.", "command1 | command2", [], ["ps aux | grep nginx"], "Assuming the pipe also forwards standard error.", ["grep", "tee"]],
  ],
  Search: [
    ["beginner", "find", "Find", "Searches directory trees using names, types, sizes, times, and actions.", "find path [expression]", ["-name", "-type", "-size", "-mtime", "-exec"], ["find /var/log -type f -size +100M"], "Placing `-delete` before filters.", ["locate", "xargs"]],
    ["beginner", "which", "Which executable", "Shows the executable selected from `PATH`.", "which command", ["-a"], ["which -a python"], "Using it to inspect aliases or shell functions.", ["command", "type"]],
    ["intermediate", "whereis", "Where is", "Locates a command's binary, source, and manual paths.", "whereis command", ["-b", "-m", "-s"], ["whereis nginx"], "Expecting a full filesystem search.", ["which", "locate"]],
    ["intermediate", "locate", "Locate", "Searches a prebuilt filename database quickly.", "locate [options] pattern", ["-i", "-r", "-e"], ["locate nginx.conf"], "Trusting stale results before the database updates.", ["updatedb", "find"]],
    ["intermediate", "xargs", "Extended arguments", "Builds command arguments from standard input.", "producer | xargs command", ["-0", "-n", "-P", "-I"], ["find . -name '*.log' -print0 | xargs -0 gzip"], "Breaking filenames with spaces by omitting null delimiters.", ["find", "parallel"]],
    ["beginner", "type", "Command type", "Explains whether a name is an alias, function, builtin, or executable.", "type [options] name", ["-a", "-t"], ["type -a kubectl"], "Assuming every command name maps to a file.", ["which", "command"]],
  ],
  "Permissions and ownership": [
    ["beginner", "chmod", "Change mode", "Changes file permission bits.", "chmod [options] mode file", ["-R", "-v", "--reference"], ["chmod 750 deploy.sh"], "Granting broad `777` permissions instead of fixing ownership.", ["chown", "umask"]],
    ["beginner", "chown", "Change owner", "Changes a file's user and group ownership.", "chown [options] owner[:group] file", ["-R", "-h", "--reference"], ["chown -R deploy:ops /srv/app"], "Recursively following the wrong directory.", ["chgrp", "chmod"]],
    ["beginner", "chgrp", "Change group", "Changes group ownership without changing the user owner.", "chgrp [options] group file", ["-R", "-h"], ["chgrp ops app.log"], "Confusing group ownership with group permissions.", ["chown", "groups"]],
    ["intermediate", "umask", "User file-creation mode mask", "Controls default permissions removed from new files and directories.", "umask [mask]", ["-S"], ["umask 027"], "Reading the mask as the final permission mode.", ["chmod", "install"]],
    ["advanced", "getfacl", "Get file access control list", "Displays extended access-control entries.", "getfacl [options] file", ["-p", "-R"], ["getfacl /srv/shared"], "Checking only `ls -l` when ACLs are active.", ["setfacl", "ls"]],
    ["advanced", "setfacl", "Set file access control list", "Adds, changes, or removes extended permissions.", "setfacl [options] file", ["-m", "-x", "-b", "-R"], ["setfacl -m u:deploy:rwx /srv/shared"], "Replacing existing ACL entries accidentally.", ["getfacl", "chmod"]],
  ],
  "Users and groups": [
    ["beginner", "id", "Identity", "Shows user and group IDs for an account.", "id [user]", ["-u", "-g", "-G"], ["id deploy"], "Confusing names with numeric IDs.", ["whoami", "groups"]],
    ["beginner", "whoami", "Who am I", "Prints the effective current username.", "whoami", [], ["whoami"], "Assuming it shows the original login user after sudo.", ["id", "who"]],
    ["beginner", "groups", "Groups", "Lists group memberships for a user.", "groups [user]", [], ["groups deploy"], "Expecting a new group membership in an existing session.", ["id", "getent"]],
    ["intermediate", "useradd", "User add", "Creates a local user account.", "useradd [options] user", ["-m", "-s", "-G", "-r"], ["sudo useradd -m -s /bin/bash deploy"], "Creating a login user without a home directory.", ["usermod", "passwd"]],
    ["intermediate", "usermod", "User modify", "Changes an existing user's account settings and memberships.", "usermod [options] user", ["-aG", "-s", "-L", "-U"], ["sudo usermod -aG docker deploy"], "Using `-G` without `-a` and replacing all supplementary groups.", ["useradd", "groupmod"]],
    ["intermediate", "getent", "Get entries", "Queries system identity databases such as passwd, group, and hosts.", "getent database [key]", [], ["getent passwd deploy"], "Reading only local files when NSS uses LDAP or another source.", ["id", "groups"]],
  ],
  Processes: [
    ["beginner", "ps", "Process status", "Shows snapshots of running processes.", "ps [options]", ["aux", "-ef", "-o"], ["ps aux --sort=-%mem"], "Mixing BSD and POSIX options without understanding columns.", ["pgrep", "top"]],
    ["beginner", "pgrep", "Process grep", "Finds process IDs by name or attributes.", "pgrep [options] pattern", ["-a", "-f", "-u"], ["pgrep -af nginx"], "Matching only the short process name when `-f` is needed.", ["ps", "pkill"]],
    ["intermediate", "pkill", "Process kill", "Sends a signal to processes matching a pattern.", "pkill [options] pattern", ["-f", "-u", "-SIGNAL"], ["pkill -TERM -f worker.py"], "Using a broad pattern that matches unrelated processes.", ["pgrep", "kill"]],
    ["beginner", "kill", "Send signal", "Sends a signal to a process ID.", "kill [signal] PID", ["-15", "-9", "-l"], ["kill -TERM 1234"], "Using SIGKILL before allowing graceful shutdown.", ["pkill", "killall"]],
    ["intermediate", "jobs", "Jobs", "Lists jobs started by the current shell.", "jobs [options]", ["-l", "-r", "-s"], ["jobs -l"], "Expecting it to show every system process.", ["bg", "fg"]],
    ["intermediate", "nohup", "No hangup", "Runs a command so it can continue after the terminal closes.", "nohup command [args] &", [], ["nohup ./worker.sh >worker.log 2>&1 &"], "Forgetting output redirection and backgrounding.", ["disown", "systemd-run"]],
  ],
  "System monitoring": [
    ["beginner", "top", "Table of processes", "Displays a live view of processes and host resource use.", "top [options]", ["-u", "-p", "-H"], ["top -u deploy"], "Treating one momentary CPU spike as a trend.", ["htop", "ps"]],
    ["intermediate", "free", "Free memory", "Reports physical memory and swap usage.", "free [options]", ["-h", "-m", "-s"], ["free -h"], "Treating Linux cache as unavailable memory.", ["vmstat", "top"]],
    ["intermediate", "uptime", "Uptime", "Shows uptime, logged-in users, and load averages.", "uptime", ["-p", "-s"], ["uptime"], "Comparing load average without considering CPU count.", ["w", "lscpu"]],
    ["intermediate", "vmstat", "Virtual memory statistics", "Reports processes, memory, paging, I/O, and CPU activity.", "vmstat [delay] [count]", ["-s", "-d", "-w"], ["vmstat 1 5"], "Reading the first line as a one-second sample.", ["iostat", "free"]],
    ["advanced", "iostat", "Input/output statistics", "Reports CPU and block-device performance statistics.", "iostat [options] [interval]", ["-x", "-d", "-m"], ["iostat -xz 1 5"], "Focusing on utilization without checking latency and queue depth.", ["vmstat", "iotop"]],
    ["advanced", "sar", "System activity reporter", "Collects or displays historical system activity metrics.", "sar [options] [interval] [count]", ["-u", "-r", "-n", "-d"], ["sar -n DEV 1 5"], "Expecting historical data when collection is disabled.", ["iostat", "vmstat"]],
  ],
  "Disk and storage": [
    ["beginner", "df", "Disk free", "Reports used and available space on mounted filesystems.", "df [options] [path]", ["-h", "-i", "-T"], ["df -hT"], "Checking blocks but not inode exhaustion.", ["du", "findmnt"]],
    ["beginner", "du", "Disk usage", "Estimates space used by files and directories.", "du [options] [path]", ["-s", "-h", "-x"], ["du -xhd 1 /var | sort -h"], "Crossing mounted filesystems during a root scan.", ["df", "ncdu"]],
    ["intermediate", "lsblk", "List block devices", "Displays disks, partitions, filesystems, and mount points.", "lsblk [options]", ["-f", "-o", "-p"], ["lsblk -f"], "Assuming every listed device is mounted.", ["blkid", "findmnt"]],
    ["intermediate", "findmnt", "Find mount", "Displays mounted filesystems and their relationships.", "findmnt [options] [target]", ["-T", "-t", "-o"], ["findmnt -T /srv/app"], "Reading `/etc/fstab` as proof that a filesystem is mounted.", ["mount", "df"]],
    ["advanced", "mount", "Mount filesystem", "Attaches a filesystem to the directory tree.", "mount [options] device directory", ["-a", "-o", "-t"], ["sudo mount -a"], "Mounting over a non-empty directory and hiding its files.", ["umount", "findmnt"]],
    ["advanced", "lsof", "List open files", "Lists files, sockets, and devices opened by processes.", "lsof [options] [path]", ["-i", "-p", "+D"], ["sudo lsof +L1"], "Recursively scanning a large tree with `+D`.", ["fuser", "ss"]],
  ],
  Networking: [
    ["beginner", "ip", "Internet Protocol utility", "Shows and changes addresses, links, neighbors, and routes.", "ip object command", ["addr", "link", "route", "-br"], ["ip -br addr", "ip route"], "Using deprecated `ifconfig` syntax with `ip`.", ["ss", "ping"]],
    ["beginner", "ping", "Packet internet groper", "Tests reachability and round-trip time with ICMP echo.", "ping [options] host", ["-c", "-W", "-I"], ["ping -c 4 8.8.8.8"], "Assuming a blocked ICMP response means the service is down.", ["curl", "traceroute"]],
    ["intermediate", "ss", "Socket statistics", "Displays listening and connected sockets.", "ss [options] [filter]", ["-l", "-t", "-u", "-n", "-p"], ["sudo ss -lntp"], "Omitting `-n` and waiting on name resolution.", ["lsof", "ip"]],
    ["beginner", "curl", "Client URL", "Transfers data and inspects HTTP or other protocol responses.", "curl [options] URL", ["-I", "-L", "-sS", "-f", "-o"], ["curl -fsS http://localhost:8080/health"], "Ignoring non-success HTTP status codes without `-f`.", ["wget", "openssl"]],
    ["intermediate", "dig", "Domain information groper", "Queries DNS records and name servers.", "dig [options] name [type]", ["+short", "@server", "+trace"], ["dig +short api.example.com A"], "Checking only one resolver during DNS incidents.", ["host", "resolvectl"]],
    ["intermediate", "traceroute", "Trace route", "Shows network hops toward a destination.", "traceroute [options] host", ["-n", "-T", "-p"], ["traceroute -n example.com"], "Treating every missing intermediate reply as packet loss.", ["tracepath", "mtr"]],
  ],
  "Package management": [
    ["beginner", "apt", "Advanced Package Tool", "Installs and manages packages on Debian-family systems.", "apt command [package]", ["update", "install", "remove", "upgrade"], ["sudo apt update", "sudo apt install nginx"], "Installing before refreshing package indexes.", ["apt-cache", "dpkg"]],
    ["intermediate", "apt-cache", "APT package cache", "Queries Debian package metadata without changing the system.", "apt-cache command package", ["policy", "search", "show"], ["apt-cache policy nginx"], "Confusing package availability with installation state.", ["apt", "dpkg"]],
    ["intermediate", "dpkg", "Debian package", "Inspects and installs local Debian package files.", "dpkg [options] package", ["-i", "-l", "-L", "-S"], ["dpkg -L nginx"], "Using `dpkg -i` without resolving dependencies afterward.", ["apt", "rpm"]],
    ["beginner", "dnf", "Dandified Yum", "Manages packages on current Fedora and RHEL-family systems.", "dnf command [package]", ["install", "remove", "update", "info"], ["sudo dnf install nginx"], "Mixing Debian package names and commands with DNF.", ["rpm", "yum"]],
    ["intermediate", "rpm", "RPM Package Manager", "Queries and installs RPM package files.", "rpm [options] package", ["-q", "-i", "-U", "-V"], ["rpm -qf /usr/bin/curl"], "Installing packages directly when DNF should resolve dependencies.", ["dnf", "dpkg"]],
    ["intermediate", "snap", "Snap package manager", "Installs and manages sandboxed snap packages.", "snap command [package]", ["install", "remove", "list", "refresh"], ["snap list"], "Assuming snap paths and service names match native packages.", ["apt", "flatpak"]],
  ],
  "Services and logs": [
    ["beginner", "systemctl", "System control", "Controls and inspects systemd units.", "systemctl command unit", ["status", "start", "stop", "restart", "enable"], ["systemctl status nginx"], "Enabling a service without starting it, or vice versa.", ["journalctl", "service"]],
    ["beginner", "journalctl", "Journal control", "Queries logs collected by systemd-journald.", "journalctl [options]", ["-u", "-f", "-b", "--since"], ["journalctl -u nginx -f"], "Reading all journal history instead of filtering by unit and time.", ["systemctl", "dmesg"]],
    ["intermediate", "service", "Service", "Invokes legacy service scripts through a compatibility interface.", "service unit action", ["status", "start", "stop", "restart"], ["sudo service cron status"], "Using it where systemd unit features are required.", ["systemctl", "rc-service"]],
    ["intermediate", "dmesg", "Diagnostic message", "Displays kernel ring-buffer messages.", "dmesg [options]", ["-T", "-w", "--level"], ["sudo dmesg -T --level=err,warn"], "Trusting human-readable timestamps after clock changes.", ["journalctl", "uname"]],
    ["intermediate", "logger", "Logger", "Writes messages to the system log.", "logger [options] message", ["-t", "-p", "-f"], ["logger -t deploy 'release completed'"], "Logging secrets from environment variables or command output.", ["journalctl", "systemd-cat"]],
    ["advanced", "systemd-analyze", "Systemd analyze", "Inspects boot performance and validates unit files.", "systemd-analyze command", ["blame", "critical-chain", "verify"], ["systemd-analyze verify app.service"], "Optimizing boot timing before confirming an actual impact.", ["systemctl", "journalctl"]],
  ],
  "Compression and archives": [
    ["beginner", "tar", "Tape archive", "Creates and extracts archives, optionally with compression.", "tar [options] archive [files]", ["-c", "-x", "-f", "-z", "-J", "-v"], ["tar -czf release.tgz dist/"], "Forgetting that option order around `-f` affects the archive filename.", ["gzip", "zip"]],
    ["beginner", "gzip", "GNU zip", "Compresses files using gzip and usually adds `.gz`.", "gzip [options] file", ["-d", "-k", "-9"], ["gzip -k app.log"], "Compressing a file still needed by a running process.", ["gunzip", "tar"]],
    ["beginner", "gunzip", "GNU unzip", "Decompresses gzip files.", "gunzip [options] file.gz", ["-k", "-c", "-t"], ["gunzip -k archive.gz"], "Overwriting an existing output file.", ["gzip", "zcat"]],
    ["intermediate", "xz", "XZ compression", "Compresses files efficiently with the XZ format.", "xz [options] file", ["-d", "-k", "-T0"], ["xz -T0 -k dump.sql"], "Using maximum compression on a latency-sensitive host.", ["unxz", "tar"]],
    ["beginner", "zip", "ZIP archive", "Creates ZIP archives commonly shared across platforms.", "zip [options] archive files", ["-r", "-9", "-e"], ["zip -r config.zip config/"], "Omitting `-r` for a directory.", ["unzip", "tar"]],
    ["beginner", "unzip", "Unzip", "Lists or extracts ZIP archives.", "unzip [options] archive", ["-l", "-d", "-o"], ["unzip release.zip -d /tmp/release"], "Extracting untrusted paths directly into a sensitive directory.", ["zip", "tar"]],
  ],
  "SSH and remote access": [
    ["beginner", "ssh", "Secure shell", "Opens an encrypted remote shell or runs a remote command.", "ssh [options] [user@]host [command]", ["-i", "-p", "-J", "-L", "-v"], ["ssh -i deploy_key deploy@server"], "Disabling host-key checking instead of managing known hosts.", ["scp", "sftp"]],
    ["beginner", "scp", "Secure copy", "Copies files over SSH.", "scp [options] source destination", ["-r", "-P", "-i"], ["scp -r dist/ deploy@server:/srv/app/"], "Using lowercase `-p` when a custom port needs uppercase `-P`.", ["ssh", "rsync"]],
    ["intermediate", "sftp", "SSH file transfer protocol", "Transfers and manages files through an interactive SSH session.", "sftp [options] [user@]host", ["-i", "-P", "-b"], ["sftp deploy@server"], "Assuming shell commands are available inside the SFTP prompt.", ["scp", "ssh"]],
    ["intermediate", "rsync", "Remote sync", "Synchronizes directory trees locally or over SSH.", "rsync [options] source destination", ["-a", "-v", "-z", "--delete", "-n"], ["rsync -avz --delete dist/ deploy@server:/srv/app/"], "Using `--delete` without a dry run and trailing-slash check.", ["scp", "cp"]],
    ["beginner", "ssh-keygen", "SSH key generator", "Creates and manages SSH key pairs.", "ssh-keygen [options]", ["-t", "-C", "-f"], ["ssh-keygen -t ed25519 -C deploy"], "Overwriting an existing private key file.", ["ssh-copy-id", "ssh-agent"]],
    ["intermediate", "ssh-copy-id", "SSH copy identity", "Installs a public key in a remote account's authorized keys.", "ssh-copy-id [options] user@host", ["-i", "-p"], ["ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server"], "Copying the private key instead of the public key.", ["ssh-keygen", "ssh"]],
  ],
  "Environment and shell": [
    ["beginner", "echo", "Echo", "Prints text and expanded shell values.", "echo [options] [text]", ["-n", "-e"], ["echo \"$PATH\""], "Leaving variables unquoted and losing whitespace.", ["printf", "env"]],
    ["beginner", "printf", "Print formatted", "Prints predictable formatted output.", "printf format [arguments]", [], ["printf 'status=%s\\n' \"$status\""], "Treating user data as the format string.", ["echo", "logger"]],
    ["beginner", "env", "Environment", "Displays the environment or runs a command with changed variables.", "env [NAME=value] [command]", ["-i", "-u"], ["env NODE_ENV=production npm start"], "Assuming temporary assignments persist after the command.", ["export", "printenv"]],
    ["beginner", "export", "Export shell variable", "Marks a shell variable for inheritance by child processes.", "export NAME=value", ["-p", "-n"], ["export APP_ENV=staging"], "Adding spaces around the equals sign.", ["env", "unset"]],
    ["intermediate", "source", "Source shell file", "Executes a file in the current shell process.", "source file", [], ["source .env.sh"], "Sourcing an untrusted file with current-shell privileges.", [".", "bash"]],
    ["intermediate", "alias", "Alias", "Defines or displays shell command shortcuts.", "alias [name='value']", ["-p"], ["alias k='kubectl'"], "Relying on interactive aliases inside scripts.", ["unalias", "type"]],
  ],
  "Bash scripting": [
    ["beginner", "#!/bin/bash", "Bash shebang", "Selects Bash as the interpreter for an executable script.", "#!/bin/bash", [], ["#!/bin/bash"], "Using Bash-only syntax under `/bin/sh`.", ["chmod", "env"]],
    ["beginner", "read", "Read input", "Reads a line into one or more shell variables.", "read [options] variable", ["-r", "-p", "-s"], ["read -r -p 'Environment: ' env"], "Omitting `-r` when backslashes must remain literal.", ["printf", "mapfile"]],
    ["intermediate", "if", "Conditional statement", "Runs commands only when a test or command succeeds.", "if condition; then commands; fi", [], ["if [ -f app.log ]; then echo found; fi"], "Forgetting spaces around `[` and `]`.", ["test", "case"]],
    ["intermediate", "for", "For loop", "Repeats commands for each item in a list.", "for item in list; do commands; done", [], ["for file in *.log; do gzip \"$file\"; done"], "Leaving loop variables unquoted.", ["while", "find"]],
    ["intermediate", "case", "Case statement", "Selects a command branch by matching a value against patterns.", "case value in pattern) commands;; esac", [], ["case \"$ENV\" in prod) deploy;; *) exit 1;; esac"], "Forgetting `;;` between branches.", ["if", "getopts"]],
    ["advanced", "trap", "Trap signal", "Runs cleanup or response code when signals or shell events occur.", "trap 'commands' SIGNAL", [], ["trap 'rm -f \"$tmp\"' EXIT"], "Registering cleanup after a command that can already fail.", ["kill", "mktemp"]],
  ],
  "DevOps troubleshooting": [
    ["intermediate", "tee", "T pipe", "Copies standard input to both standard output and files.", "command | tee [options] file", ["-a"], ["deploy.sh 2>&1 | tee -a deploy.log"], "Forgetting `sudo tee` when redirecting to a root-owned file.", ["cat", "script"]],
    ["intermediate", "watch", "Watch", "Runs a command repeatedly and highlights changes.", "watch [options] command", ["-n", "-d"], ["watch -n 2 'df -h /'"], "Running expensive commands at a very short interval.", ["while", "top"]],
    ["advanced", "strace", "System call trace", "Traces system calls and signals made by a process.", "strace [options] command", ["-p", "-f", "-e", "-o"], ["sudo strace -p 1234 -e trace=file"], "Tracing production processes without considering overhead.", ["ltrace", "perf"]],
    ["advanced", "tcpdump", "TCP dump", "Captures and filters network packets.", "tcpdump [options] [expression]", ["-i", "-n", "-w", "-r"], ["sudo tcpdump -ni any port 443"], "Capturing sensitive traffic or filling disk with an unbounded file.", ["ss", "tshark"]],
    ["intermediate", "openssl", "OpenSSL toolkit", "Inspects certificates and tests TLS connections.", "openssl command [options]", ["s_client", "x509"], ["openssl s_client -connect example.com:443 -servername example.com"], "Omitting SNI and testing the wrong certificate.", ["curl", "ssh-keygen"]],
    ["advanced", "nc", "Netcat", "Reads and writes raw TCP or UDP connections.", "nc [options] host port", ["-z", "-v", "-l", "-u"], ["nc -zv database 5432"], "Treating a successful TCP connect as an application health check.", ["ss", "curl"]],
  ],
};

export const linuxCommandCatalog = Object.entries(rows).flatMap(
  ([category, commands]) => commands.map((command) => entry(category, ...command)),
);

export const linuxCategories = Object.keys(rows);

export const linuxReference = linuxCategories.map((category) => ({
  category,
  commands: linuxCommandCatalog.filter((item) => item.category === category),
}));

export const linuxFlashcards = linuxCommandCatalog.map((item, index) => ({
  id: index === 0 ? "fc-pwd" : `linux-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: item.command === "|"
    ? "What does the pipe operator `|` do?"
    : `What does \`${item.command}\` do?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const linuxMultipleChoice = linuxCommandCatalog.map((item, index, catalog) => {
  const distractors = [1, 7, 19].map(
    (offset) => catalog[(index + offset) % catalog.length].command,
  );
  return {
    id: `linux-mcq-${index + 1}`,
    category: item.category,
    question: `Which Linux command best fits this task: ${item.basicExplanation.toLowerCase()}`,
    options: [item.command, ...distractors],
    answer: 0,
    explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
  };
});

export const linuxCommandQuiz = linuxCommandCatalog.map((item, index) => ({
  id: `linux-command-${index + 1}`,
  category: item.category,
  prompt: `Write the Linux command or shell form that matches this task: ${item.basicExplanation}`,
  answers: item.answers,
  explanation: `${item.commonSyntax}. ${item.professionalExplanation}`,
}));
