export const interviewReviewedOverrides = {
  "interview-linux-1": {
    "category": "Linux",
    "difficulty": "Beginner",
    "question": "Explain Linux file permissions.",
    "shortAnswer": "Every file has read, write, and execute permissions set separately for the owner, the owning group, and everyone else.",
    "detailedAnswer": "Permissions are shown as rwxrwxrwx (owner/group/other) or a three-digit octal like 644; chmod changes them, chown changes the owner, and chgrp changes the group. On a directory, execute means you can cd into it and list contents via a lookup, not run it.",
    "beginnerExplanation": "Think of ls -l output like rwxr-xr--: the first three letters are what the owner can do, the next three are the group, the last three are everyone else. r=read, w=write, x=execute.",
    "professionalExplanation": "In production, permission bugs usually show up as an app running as the wrong user unable to read a mounted secret, or a world-writable file flagged by a security scan. Prefer least-privilege octal modes (640 for config, 750 for directories) over 777 fixes, and check ownership with ls -l or stat before assuming it's a permissions issue at all.",
    "realWorldExample": "A Docker container running as UID 1000 failing to read a ConfigMap-mounted file owned by root with mode 600 is a classic permission mismatch — fixed by setting the right fsGroup/securityContext or chmod on the source.",
    "commands": [
      "chmod 640 config.yaml",
      "chown appuser:appgroup config.yaml",
      "ls -l /etc/app"
    ],
    "followUpQuestions": [
      "What's the difference between chmod 755 and 750?",
      "How do setuid and setgid bits change this model?"
    ],
    "commonMistakes": [
      "Reaching for chmod 777 to make an error go away instead of diagnosing the actual owner/group mismatch",
      "Forgetting that execute on a directory controls traversal, not 'running' the directory"
    ],
    "interviewTip": "Walk through owner/group/other explicitly with a concrete rwx example rather than reciting the definition — it shows you actually read permission strings daily.",
    "requiredKeywords": [
      "read",
      "write",
      "execute"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-linux-2": {
    "category": "Linux",
    "difficulty": "Junior DevOps",
    "question": "How do you troubleshoot high CPU on a Linux server?",
    "shortAnswer": "Start with top or htop to find the offending process, then dig into what that specific process is doing.",
    "detailedAnswer": "top/htop sorted by CPU shows the culprit process and whether it's one runaway thread or many. From there check application logs for that process, strace or perf top if it's unclear what syscalls it's stuck in, and whether load average is climbing (queueing) versus CPU simply being saturated by legitimate work like a batch job.",
    "beginnerExplanation": "Open top, sort by CPU with Shift+P, and look at which single process is eating the most — then go read that process's logs to find out why.",
    "professionalExplanation": "Distinguish a genuine capacity problem (scale up/out, or the workload is expected) from a bug (an infinite retry loop, a runaway GC, a stuck cron job re-spawning). uptime's load average versus CPU count tells you if you're CPU-bound or I/O-wait-bound, which changes the fix entirely.",
    "realWorldExample": "A misconfigured retry loop in a backend service hammering a downstream API on every failed connection can pin one core at 100% indefinitely — top shows it immediately, the fix is in the app's retry/backoff logic, not the server.",
    "commands": [
      "top",
      "htop",
      "ps aux --sort=-%cpu | head"
    ],
    "followUpQuestions": [
      "How would load average differ from CPU usage on an I/O-bound box?",
      "What would you check if top shows low CPU but the app is still slow?"
    ],
    "commonMistakes": [
      "Restarting the process to make the symptom go away without ever finding the root cause in logs",
      "Confusing high load average with high CPU when the real bottleneck is I/O wait"
    ],
    "interviewTip": "Name the actual tools in order (top, then logs, then strace/perf) — interviewers are listening for a real workflow, not just 'I'd check the logs'.",
    "requiredKeywords": [
      "top",
      "process",
      "logs"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-linux-3": {
    "category": "Linux",
    "difficulty": "Mid-level DevOps",
    "question": "What does a pipe do in Linux?",
    "shortAnswer": "A pipe (|) connects one command's stdout directly to the next command's stdin without a temporary file.",
    "detailedAnswer": "Each command in a pipeline runs concurrently, streaming data rather than buffering it all first, which is why grep | head can stop early and why piping a huge log file into awk doesn't need the whole file in memory at once.",
    "beginnerExplanation": "cat file.log | grep ERROR takes the output of cat and feeds it as input to grep, so you get only the error lines instead of the whole file.",
    "professionalExplanation": "Pipes are the basis of composing small single-purpose tools (the Unix philosophy) — ps aux | grep node | awk '{print $2}' | xargs kill chains process listing, filtering, extraction, and action into one line instead of a bespoke script. Know the difference from a redirect (>): a pipe connects two processes' stdin/stdout, a redirect connects a stream to a file.",
    "realWorldExample": "journalctl -u myapp | grep -i timeout | tail -20 is a one-liner an on-call engineer runs constantly to get the last 20 timeout errors from a service's logs without opening the full journal.",
    "commands": [
      "journalctl -u myapp | grep -i timeout",
      "ps aux | grep node",
      "cat access.log | awk '{print $1}' | sort | uniq -c"
    ],
    "followUpQuestions": [
      "How is a pipe different from output redirection?",
      "What happens if the first command in a pipeline produces more output than the second can consume?"
    ],
    "commonMistakes": [
      "Confusing pipe (|, process to process) with redirect (>, process to file)",
      "Not knowing that each stage of a pipeline runs as its own process, which matters for exit codes and $?"
    ],
    "interviewTip": "Give a real one-liner you've actually used (grep piped into awk or tail) — it's more convincing than the textbook definition alone.",
    "requiredKeywords": [
      "stdout",
      "stdin",
      "command"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-linux-4": {
    "category": "Linux",
    "difficulty": "Advanced",
    "question": "How do you inspect service logs?",
    "shortAnswer": "For systemd-managed services, journalctl -u SERVICE_NAME is the standard entry point.",
    "detailedAnswer": "journalctl -u myapp -f follows live output like tail -f, --since '10 min ago' scopes to a time window, and -p err filters by priority. For services that log to files instead of the journal, tail -f combined with the app's own log rotation config is the equivalent.",
    "beginnerExplanation": "journalctl -u nginx shows you nginx's logs the same way tail would show a log file, and adding -f keeps it open and streaming new lines as they happen.",
    "professionalExplanation": "Correlating logs across the journal, application-level files, and container stdout (docker logs / kubectl logs) is the real skill — an incident often needs all three lined up by timestamp. journalctl --since/--until with ISO timestamps is what makes that correlation reliable instead of eyeballing relative times.",
    "realWorldExample": "Debugging a service that fails right after a deploy: journalctl -u myapp --since '5 min ago' -p err immediately isolates new errors without scrolling through hours of normal-operation noise.",
    "commands": [
      "journalctl -u myapp -f",
      "journalctl -u myapp --since '10 min ago'",
      "journalctl -u myapp -p err"
    ],
    "followUpQuestions": [
      "How would you check logs for a service that crashed before you could attach journalctl -f?",
      "How do you limit journal disk usage?"
    ],
    "commonMistakes": [
      "Not knowing -p (priority) filtering exists and scrolling through info-level noise by hand",
      "Forgetting that a crashed service's last logs are still in the journal even after the process exits — no need to reproduce the crash live"
    ],
    "interviewTip": "Mention time-scoping (--since) explicitly; it signals you've actually debugged an incident under time pressure, not just read logs casually.",
    "requiredKeywords": [
      "journalctl",
      "service",
      "logs"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-linux-5": {
    "category": "Linux",
    "difficulty": "Beginner",
    "question": "How do you check disk usage?",
    "shortAnswer": "df -h shows free space per filesystem/mount; du -sh shows how much space a specific directory or file tree consumes.",
    "detailedAnswer": "df answers 'is this filesystem full', du answers 'what's taking up the space' — running du -sh /* | sort -h from root is the standard way to find the biggest directory once df shows a partition is nearly full.",
    "beginnerExplanation": "df -h is like checking your phone's storage settings; du -sh some-folder tells you how big just that one folder is.",
    "professionalExplanation": "A classic trap: du and df can disagree if a large file was deleted but is still held open by a running process — df shows it as still used, du doesn't see it since it's unlinked from the directory tree. lsof | grep deleted finds that file and a service restart reclaims the space.",
    "realWorldExample": "df -h shows /var at 98%, du -sh /var/log/* | sort -h reveals a single unrotated application log has grown to 40GB — the fix is both truncating it and fixing the logrotate config that should have rotated it.",
    "commands": [
      "df -h",
      "du -sh /var/log/*",
      "du -sh /* | sort -h"
    ],
    "followUpQuestions": [
      "Why might df show a filesystem full even after you deleted large files?",
      "How would you set up log rotation to prevent this recurring?"
    ],
    "commonMistakes": [
      "Only running df and never following up with du to find the actual large directory",
      "Not knowing about the deleted-but-still-open-file disk usage trap"
    ],
    "interviewTip": "Bring up the deleted-but-held-open-file gotcha unprompted — it's the detail that separates someone who's actually hit this in production from someone reciting man pages.",
    "requiredKeywords": [
      "df",
      "du",
      "filesystem"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-docker-1": {
    "category": "Docker",
    "difficulty": "Beginner",
    "question": "What is the difference between an image and a container?",
    "shortAnswer": "An image is a read-only, versioned template; a container is a running (or stopped) instance of that image, executed by the container runtime with its own writable layer.",
    "detailedAnswer": "You build or pull an image once, then can run many containers from it — each container gets its own filesystem writable layer, network namespace, and process, but shares the image's read-only layers on disk. Deleting a container never touches the image it came from.",
    "beginnerExplanation": "An image is like a class in programming, and a container is an instance of that class — you can create many separate containers from the same one image.",
    "professionalExplanation": "This distinction is why images should be treated as immutable, versioned artifacts (tagged and pushed to a registry) while containers are treated as disposable — restarting a container from the same image should never lose anything you actually care about persisting, because if it does, that state belongs in a volume, not the container's writable layer.",
    "realWorldExample": "docker run myapp:2.0 three times gives three independent running containers sharing the same myapp:2.0 image on disk; killing and re-running one doesn't affect the others or the image.",
    "commands": [
      "docker images",
      "docker ps -a",
      "docker run -d myapp:2.0"
    ],
    "followUpQuestions": [
      "Where does data written inside a container actually live?",
      "What happens to a container's writable layer when it's removed?"
    ],
    "commonMistakes": [
      "Storing application state only in the container's writable layer instead of a volume, then losing it on restart",
      "Treating a running container as something you patch in place instead of rebuilding the image"
    ],
    "interviewTip": "Use the class-vs-instance analogy briefly, then immediately pivot to the operational consequence (containers are disposable, images are the artifact) — that's the part interviewers actually care about.",
    "requiredKeywords": [
      "image",
      "container",
      "runtime"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-docker-2": {
    "category": "Docker",
    "difficulty": "Junior DevOps",
    "question": "How does Docker port mapping work?",
    "shortAnswer": "-p HOST_PORT:CONTAINER_PORT publishes a container's internal port onto the host's network so external traffic can reach it.",
    "detailedAnswer": "Inside its own network namespace a container can listen on any port freely; -p maps that internal port to a port on the Docker host through Docker's userland proxy or iptables NAT rules, so traffic hitting the host's port gets forwarded into the container's namespace.",
    "beginnerExplanation": "-p 8080:80 means 'when someone hits this machine on port 8080, send that traffic into the container's port 80' — the container itself doesn't know or care what port you mapped it to.",
    "professionalExplanation": "Without -p, containers on the same user-defined bridge network can still reach each other directly by container/service name on their internal ports — port publishing is only needed for traffic originating outside Docker's network. This is why a backend container often needs no -p at all if only the frontend container talks to it.",
    "realWorldExample": "docker run -p 5000:5000 backend exposes the backend on host port 5000, but if a frontend container on the same Docker network calls it, it just uses http://backend:5000 directly — no port mapping required for that internal call.",
    "commands": [
      "docker run -p 8080:80 nginx",
      "docker port CONTAINER",
      "docker network inspect bridge"
    ],
    "followUpQuestions": [
      "Why don't containers on the same network need -p to talk to each other?",
      "What's the difference between -p and EXPOSE in a Dockerfile?"
    ],
    "commonMistakes": [
      "Assuming EXPOSE in a Dockerfile actually publishes a port — it's documentation only, -p is what does the real mapping",
      "Publishing every internal port with -p when only the entry-point service actually needs to be externally reachable"
    ],
    "interviewTip": "Clarify the EXPOSE-vs--p distinction unprompted; it's a very common point of confusion and calling it out shows real hands-on Docker networking experience.",
    "requiredKeywords": [
      "host",
      "container",
      "port"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-docker-3": {
    "category": "Docker",
    "difficulty": "Mid-level DevOps",
    "question": "Why use a .dockerignore file?",
    "shortAnswer": ".dockerignore excludes files from the build context sent to the Docker daemon, keeping builds fast and images clean.",
    "detailedAnswer": "Everything in the build directory not excluded gets uploaded to the daemon as the build context before the first instruction even runs — without a .dockerignore, node_modules, .git, and local env files get sent (and can even end up copied into the image via a careless COPY . .), slowing builds and leaking things that shouldn't be in the image.",
    "beginnerExplanation": ".dockerignore works like .gitignore, but for what gets sent into the Docker build instead of what gets committed to Git.",
    "professionalExplanation": "Beyond speed, it's a real security control: without excluding .env, .git, or local credential files, a broad COPY . . can bake secrets or the entire commit history into an image layer that then sits in a registry indefinitely, retrievable by anyone who can pull the image, even after the file is later 'removed'.",
    "realWorldExample": "A repo missing .dockerignore accidentally shipped a .env file with database credentials into a public image layer — auditing showed the credentials were pullable months later because layers aren't mutable once pushed, forcing a full credential rotation.",
    "commands": [
      "docker build -t myapp .",
      "docker history myapp:latest",
      "docker image inspect myapp:latest"
    ],
    "followUpQuestions": [
      "What's the risk of a broad COPY . . instruction even with a .dockerignore in place?",
      "How would you audit an existing image for accidentally-included secrets?"
    ],
    "commonMistakes": [
      "Assuming deleting a file in a later Dockerfile instruction removes it from the final image — it's still present in the earlier layer",
      "Never adding .dockerignore until a slow build or a leaked secret forces the issue"
    ],
    "interviewTip": "Tie .dockerignore to the layer-immutability security angle, not just build speed — that's the answer that shows senior-level judgment.",
    "requiredKeywords": [
      "build context",
      "ignore",
      "image"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-docker-4": {
    "category": "Docker",
    "difficulty": "Junior DevOps",
    "question": "What is a multi-stage build?",
    "shortAnswer": "A multi-stage build uses several FROM instructions in one Dockerfile, copying only the artifacts you need from an earlier stage into the final, smaller image.",
    "detailedAnswer": "A build stage can have the full compiler toolchain, dependencies, and source code; the final stage starts from a minimal base image and uses COPY --from=build to pull in just the compiled binary or bundled assets, discarding everything else — compilers, package caches, and intermediate files never reach the shipped image.",
    "beginnerExplanation": "It's like using one messy kitchen to cook a meal, then only carrying the finished plate — not the pots, ingredients bags, and mess — into the dining room that's your final image.",
    "professionalExplanation": "This is the standard way to keep production images small and reduce attack surface for compiled languages and frontend builds: a Go binary or a React dist/ folder doesn't need gcc or npm present at runtime, and a smaller image also means faster pulls and less to patch for CVEs.",
    "realWorldExample": "A Node.js frontend build stage runs npm install && npm run build producing a dist/ folder, then the final stage is just nginx:alpine with COPY --from=build /app/dist /usr/share/nginx/html — the final image never contains Node.js or npm at all.",
    "commands": [
      "docker build -t myapp .",
      "docker images myapp",
      "docker history myapp"
    ],
    "followUpQuestions": [
      "How much smaller does a multi-stage image typically end up versus a single-stage one?",
      "Can you name a stage and reference it later in the same Dockerfile?"
    ],
    "commonMistakes": [
      "Building everything in one stage and shipping the full toolchain in the production image, unnecessarily bloating it",
      "Forgetting COPY --from can reference an earlier named stage, not just an external image"
    ],
    "interviewTip": "Give the concrete before/after image size difference if you have real numbers — quantifying the win lands better than describing the mechanism alone.",
    "requiredKeywords": [
      "stage",
      "smaller",
      "artifact"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-docker-5": {
    "category": "Docker",
    "difficulty": "Mid-level DevOps",
    "question": "How would you debug a failing container?",
    "shortAnswer": "Start with docker ps -a to see its exit code, then docker logs for output, and docker inspect for its configuration.",
    "detailedAnswer": "An exit code of 0 means clean exit, non-zero means an error the app itself raised, and 137 means it was killed (often OOM). docker logs shows stdout/stderr up to the crash; if the container won't even start, docker run with an overridden entrypoint (like /bin/sh), or docker exec -it into a still-running one, lets you poke around the filesystem interactively.",
    "beginnerExplanation": "docker ps -a shows containers that have exited and their exit code; docker logs CONTAINER shows what it printed before it died, which is usually where the real error message is.",
    "professionalExplanation": "Exit code 137 specifically means SIGKILL, most commonly the OOM killer — check docker stats or the host's dmesg for OOM events rather than assuming it's an application bug. For containers that fail before logging anything useful, overriding CMD/ENTRYPOINT to drop into a shell is the fastest way to inspect env vars, file permissions, and whether required files actually made it into the image.",
    "realWorldExample": "A container repeatedly exiting with code 137 turned out to be hitting its memory limit under load — docker inspect showed the memory limit, and the fix was raising it and adding a memory profiler rather than debugging application code for a bug that didn't exist.",
    "commands": [
      "docker ps -a",
      "docker logs CONTAINER",
      "docker run -it --entrypoint /bin/sh myimage"
    ],
    "followUpQuestions": [
      "What does exit code 137 specifically indicate?",
      "How would you debug a container that exits before printing any logs?"
    ],
    "commonMistakes": [
      "Treating every crash as an application bug without first checking whether it was OOMKilled",
      "Not knowing you can override the entrypoint to get an interactive shell for a container that fails immediately"
    ],
    "interviewTip": "Name the specific exit code (137 = SIGKILL/OOM) — it's a small detail that signals real production debugging experience, not textbook knowledge.",
    "requiredKeywords": [
      "logs",
      "exec",
      "inspect"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-kubernetes-1": {
    "category": "Kubernetes",
    "difficulty": "Beginner",
    "question": "What is a Pod?",
    "shortAnswer": "A Pod is Kubernetes' smallest deployable unit — one or more containers that share a network namespace and storage, always scheduled together.",
    "detailedAnswer": "Containers in the same Pod share localhost networking (they can reach each other via 127.0.0.1) and can share mounted volumes; they're always created, scaled, and deleted together on the same node. A single-container Pod is the common case, but sidecar patterns (a logging agent or proxy alongside the app) rely on multi-container Pods.",
    "beginnerExplanation": "A Pod wraps one or more containers that need to live and move together — think of it as the smallest thing Kubernetes actually schedules onto a node, not an individual container.",
    "professionalExplanation": "You almost never create bare Pods directly in production — a Deployment, StatefulSet, or Job manages Pods for you and recreates them on failure, since a standalone Pod that dies is simply gone. Understanding that distinction (Pod = unit of scheduling, Deployment = unit of desired-state management) is foundational to everything else in Kubernetes.",
    "realWorldExample": "An Istio-injected Pod actually runs two containers — your app and the Envoy sidecar proxy — both sharing the Pod's network namespace so the proxy can transparently intercept the app's traffic on localhost.",
    "commands": [
      "kubectl get pods",
      "kubectl describe pod POD_NAME",
      "kubectl logs POD_NAME -c CONTAINER_NAME"
    ],
    "followUpQuestions": [
      "Why would a Pod have more than one container?",
      "What happens to a standalone Pod (not managed by a Deployment) if its node fails?"
    ],
    "commonMistakes": [
      "Talking about Pods and containers as interchangeable terms in an interview",
      "Creating bare Pods in production instead of a Deployment/StatefulSet that provides self-healing"
    ],
    "interviewTip": "Mention the sidecar pattern (multi-container Pods) — it shows you understand why Pod exists as a concept distinct from 'container', not just as Kubernetes jargon.",
    "requiredKeywords": [
      "pod",
      "container",
      "smallest"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-kubernetes-2": {
    "category": "Kubernetes",
    "difficulty": "Junior DevOps",
    "question": "What problem does a Deployment solve?",
    "shortAnswer": "A Deployment keeps a specified number of Pod replicas running and manages rolling updates between versions via an underlying ReplicaSet.",
    "detailedAnswer": "You declare the desired state (image, replica count, config) and the Deployment controller continuously reconciles the cluster toward it — replacing crashed Pods, and on an update, creating a new ReplicaSet and gradually shifting traffic from the old one to the new one according to the rollout strategy.",
    "beginnerExplanation": "Instead of manually creating and watching Pods, you tell a Deployment 'I want 3 copies of this app running' and it keeps making that true, replacing any Pod that dies.",
    "professionalExplanation": "The rolling update strategy (maxUnavailable/maxSurge) is what lets a Deployment ship a new version with zero downtime by controlling how many old Pods go away before new ones are ready; kubectl rollout undo works because the old ReplicaSet's Pod template is still retained in history, not deleted.",
    "realWorldExample": "kubectl set image deployment/api api=api:v2 triggers a rolling update; kubectl rollout status deployment/api streams progress, and if the new version is broken, kubectl rollout undo deployment/api restores the previous ReplicaSet within seconds.",
    "commands": [
      "kubectl get deployments",
      "kubectl rollout status deployment/api",
      "kubectl rollout undo deployment/api"
    ],
    "followUpQuestions": [
      "How does a Deployment actually perform a rolling update under the hood?",
      "What's the difference between a Deployment and a ReplicaSet?"
    ],
    "commonMistakes": [
      "Editing Pods directly instead of the Deployment, so changes get silently overwritten on the next reconciliation",
      "Not knowing rollback works by reactivating a prior ReplicaSet, not by literally reverting a diff"
    ],
    "interviewTip": "Explain the reconciliation loop concept (desired state vs actual state) briefly — it's the mental model behind nearly every Kubernetes controller, not just Deployments.",
    "requiredKeywords": [
      "replicas",
      "rollout",
      "desired state"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-kubernetes-3": {
    "category": "Kubernetes",
    "difficulty": "Junior DevOps",
    "question": "How do Services route traffic?",
    "shortAnswer": "A Service selects Pods by label selector and load-balances traffic across every matching Pod's port, giving them one stable address.",
    "detailedAnswer": "Pods are ephemeral and get new IPs when recreated, so a Service provides a stable virtual IP and DNS name; kube-proxy (or the CNI's equivalent) programs iptables/IPVS rules so traffic to the Service IP gets distributed to one of the currently-matching, ready Pods.",
    "beginnerExplanation": "A Service is like a phone number that always reaches 'the app', even as the specific Pods answering that number change — you never call a Pod's IP directly.",
    "professionalExplanation": "The selector-to-label matching is the entire mechanism, and it's also the most common failure point: if a Deployment's Pod template labels don't exactly match the Service's selector, the Service has zero endpoints and traffic simply goes nowhere with no obvious error — kubectl get endpoints is the first thing to check.",
    "realWorldExample": "A Service defined with selector app: backend but Pods labeled app: backend-api (a typo during a refactor) silently has zero endpoints — kubectl get endpoints backend-svc showing an empty list is the exact symptom, fixed by aligning the labels.",
    "commands": [
      "kubectl get svc",
      "kubectl get endpoints SERVICE_NAME",
      "kubectl describe svc SERVICE_NAME"
    ],
    "followUpQuestions": [
      "What would you check if a Service has zero endpoints?",
      "What's the difference between ClusterIP, NodePort, and LoadBalancer Service types?"
    ],
    "commonMistakes": [
      "Assuming a Service is broken when it's actually a label/selector mismatch producing zero endpoints",
      "Hardcoding a Pod's IP somewhere instead of using the Service's stable DNS name"
    ],
    "interviewTip": "Bring up the label-selector-mismatch failure mode unprompted — it's the single most common Service bug and naming it shows real troubleshooting experience.",
    "requiredKeywords": [
      "selector",
      "pods",
      "port"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-kubernetes-4": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "What is the role of ConfigMaps and Secrets?",
    "shortAnswer": "ConfigMaps and Secrets externalize configuration from container images — ConfigMaps for plain values, Secrets for sensitive ones — injected as environment variables or mounted files.",
    "detailedAnswer": "Both decouple config from the image so the same image can run in dev, staging, and prod with different values; Secrets are base64-encoded (not encrypted at rest by default without a KMS provider configured) and Kubernetes takes some extra precautions like not logging their values, but base64 is encoding, not encryption, which matters for how you reason about who can read them.",
    "beginnerExplanation": "Instead of baking a database URL into your app's Docker image, you put it in a ConfigMap (or a Secret if it's sensitive, like a password) and the Pod reads it as an environment variable at startup.",
    "professionalExplanation": "The critical thing to know in an interview: Secrets are not encrypted by default, only base64-encoded and access-controlled via RBAC — for real encryption at rest you need etcd encryption configured, and for anything truly sensitive in a serious production environment, an external secrets manager (Vault, AWS Secrets Manager via External Secrets Operator) is the safer pattern than raw Kubernetes Secrets.",
    "realWorldExample": "A backend Deployment reads DB_PASSWORD via envFrom.secretKeyRef pointing at a Secret rather than hardcoding it in the manifest, so the same Deployment YAML is reused across environments with different Secret values per namespace.",
    "commands": [
      "kubectl create secret generic db-creds --from-literal=password=...",
      "kubectl get configmap app-config -o yaml",
      "kubectl describe secret db-creds"
    ],
    "followUpQuestions": [
      "Are Kubernetes Secrets actually encrypted? What has to be configured for that?",
      "When would you mount config as a file instead of an environment variable?"
    ],
    "commonMistakes": [
      "Believing Secrets are encrypted by default just because the name says 'Secret'",
      "Committing a Secret manifest with real credentials to Git instead of a sealed/external-secrets pattern"
    ],
    "interviewTip": "Explicitly correct the 'Secrets are encrypted' assumption before it's asked — it's one of the most common Kubernetes misconceptions and catching it yourself is a strong signal.",
    "requiredKeywords": [
      "configuration",
      "secret",
      "environment"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-kubernetes-5": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "How do you troubleshoot a CrashLoopBackOff?",
    "shortAnswer": "Check the Pod's logs from the previous crashed instance and its describe events, since CrashLoopBackOff means the container keeps starting and dying.",
    "detailedAnswer": "kubectl logs POD --previous gets the last crashed attempt's output (the current attempt may not have logged anything useful yet), and kubectl describe pod shows recent events including OOMKilled, failed liveness probes, or an image pull error — all common root causes distinct from an app-level bug.",
    "beginnerExplanation": "CrashLoopBackOff means Kubernetes keeps trying to restart the container and it keeps dying almost immediately, with increasing wait time between attempts — logs --previous shows you why it died last time.",
    "professionalExplanation": "Don't assume it's always an application bug: a misconfigured liveness probe killing a healthy-but-slow-starting app, a missing ConfigMap/Secret the container needs at startup, or a resource limit too low causing immediate OOM are all common causes that show up identically as CrashLoopBackOff but need completely different fixes.",
    "realWorldExample": "A Java service with a slow JVM startup kept getting killed by a liveness probe with too short an initialDelaySeconds — describe showed 'Liveness probe failed' events, and the fix was tuning the probe timing, not the application.",
    "commands": [
      "kubectl logs POD_NAME --previous",
      "kubectl describe pod POD_NAME",
      "kubectl get events --sort-by='.lastTimestamp'"
    ],
    "followUpQuestions": [
      "How would a bad liveness probe cause a CrashLoopBackOff on an otherwise healthy app?",
      "How does the backoff timing between restart attempts work?"
    ],
    "commonMistakes": [
      "Only looking at current logs and missing the actual crash reason captured in the previous instance's logs",
      "Assuming CrashLoopBackOff is always an app bug instead of checking probe config and resource limits first"
    ],
    "interviewTip": "Mention --previous by name specifically — it's the exact flag that separates someone who's actually debugged this from someone guessing at the concept.",
    "requiredKeywords": [
      "logs",
      "describe",
      "events"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-helm-1": {
    "category": "Helm",
    "difficulty": "Beginner",
    "question": "What is a Helm chart?",
    "shortAnswer": "A Helm chart is a versioned package of Kubernetes manifest templates plus default configuration values.",
    "detailedAnswer": "A chart bundles Chart.yaml metadata, values.yaml defaults, and a templates/ folder of Go-templated manifests; helm install renders those templates with a specific values set and applies the result as one named, trackable release.",
    "beginnerExplanation": "Instead of applying a folder of raw YAML files by hand for every environment, a chart is one reusable package that generates those YAML files with different settings plugged in.",
    "professionalExplanation": "The key operational win is that a chart turns 'apply these 10 manifests correctly, in order, with the right per-environment values' into one command, and every install is tracked as a release with revision history — so upgrades and rollbacks operate on a known unit instead of a pile of loose YAML.",
    "realWorldExample": "helm install web ./webapp -f values-prod.yaml renders the same chart differently for prod versus dev by swapping just the values file, without duplicating the templates themselves.",
    "commands": [
      "helm create webapp",
      "helm show chart ./webapp",
      "helm template web ./webapp"
    ],
    "followUpQuestions": [
      "What's the difference between a chart and a release?",
      "Where do a chart's default values live?"
    ],
    "commonMistakes": [
      "Confusing a chart (the package) with a release (an installed instance of it)",
      "Editing rendered manifests directly instead of changing the chart's templates or values"
    ],
    "interviewTip": "Distinguish chart, release, and values explicitly — that three-way distinction is what interviewers are actually listening for, not just 'it's a package manager for Kubernetes'.",
    "requiredKeywords": [
      "chart",
      "templates",
      "values"
    ],
    "relatedModule": "Helm",
    "reviewStatus": "reviewed"
  },
  "interview-helm-2": {
    "category": "Helm",
    "difficulty": "Beginner",
    "question": "What is a Helm release?",
    "shortAnswer": "A release is a named, installed instance of a chart in a cluster, with its own tracked revision history.",
    "detailedAnswer": "helm install creates revision 1 of a release; every subsequent helm upgrade creates a new numbered revision, and helm rollback can restore any prior one. Two installs of the same chart under different release names are entirely independent, with separate histories and resources.",
    "beginnerExplanation": "If a chart is a recipe, a release is the specific dish you cooked from it — you can cook the same recipe multiple times under different names, and each one is tracked separately.",
    "professionalExplanation": "helm history web is the command most people forget exists until an incident — checking it before a rollback confirms exactly which prior revision was actually last known-good, rather than assuming 'the previous one' is safe.",
    "realWorldExample": "helm upgrade web ./webapp --set image.tag=2.0 creates revision 4 of the web release; if it breaks, helm rollback web 3 restores the prior working revision within seconds.",
    "commands": [
      "helm list",
      "helm history web",
      "helm rollback web 3"
    ],
    "followUpQuestions": [
      "How would you decide which revision to roll back to during an incident?",
      "What happens to the revision history if you uninstall a release?"
    ],
    "commonMistakes": [
      "Rolling back without checking helm history first, landing on a revision that was itself broken",
      "Reusing a release name across unrelated apps in the same namespace"
    ],
    "interviewTip": "Mention checking history before rolling back — it shows incident-response discipline, not just knowledge of the rollback command.",
    "requiredKeywords": [
      "release",
      "install",
      "revision"
    ],
    "relatedModule": "Helm",
    "reviewStatus": "reviewed"
  },
  "interview-helm-3": {
    "category": "Helm",
    "difficulty": "Junior DevOps",
    "question": "How do values.yaml files work?",
    "shortAnswer": "values.yaml holds a chart's default configuration; templates read it through .Values, and any install-time override merges on top.",
    "detailedAnswer": "-f values-prod.yaml merges an additional file over the defaults, and --set key=value overrides individual scalars from the command line; multiple -f files merge in order with later files winning on shared keys, which is the standard way to structure a small per-environment overlay on top of a shared base.",
    "beginnerExplanation": "values.yaml is the settings file a chart ships with — if you don't override anything, those are the settings your install gets.",
    "professionalExplanation": "A well-structured chart keeps its own values.yaml as the full documented default and expects environments to supply small overlay files that only change what actually differs — a values-prod.yaml that duplicates the entire base file defeats the purpose and creates drift risk when the base changes.",
    "realWorldExample": "A chart's values-dev.yaml and values-prod.yaml might only override the ingress block (host and class), while everything else — replica counts, image repository, resource limits — falls back to the shared values.yaml.",
    "commands": [
      "helm install web ./webapp -f values-prod.yaml",
      "helm get values web --all",
      "helm show values ./webapp"
    ],
    "followUpQuestions": [
      "What happens if two -f files set the same key?",
      "How would you see the fully merged values a running release actually has?"
    ],
    "commonMistakes": [
      "Duplicating the entire base values.yaml into every environment overlay instead of overriding only what differs",
      "Trusting a values file in Git as ground truth instead of confirming with helm get values --all against the live release"
    ],
    "interviewTip": "Mention helm get values --all as how you'd verify what's actually deployed — it shows you think about drift between Git and the cluster, not just chart authoring.",
    "requiredKeywords": [
      "values",
      "override",
      "template"
    ],
    "relatedModule": "Helm",
    "reviewStatus": "reviewed"
  },
  "interview-helm-4": {
    "category": "Helm",
    "difficulty": "Mid-level DevOps",
    "question": "Why run helm template or helm lint?",
    "shortAnswer": "helm template renders a chart's manifests locally for review, and helm lint checks chart structure and template correctness — both without touching a cluster.",
    "detailedAnswer": "helm template is the fastest iteration loop while writing or debugging templates, since there's no cluster round trip; helm lint additionally validates conventions like required Chart.yaml fields and catches template errors that would otherwise only surface at install time. Both should run in CI before a chart is packaged, not just locally before a commit.",
    "beginnerExplanation": "helm template lets you see exactly what YAML a chart would produce before you actually install anything, and helm lint checks the chart for common mistakes.",
    "professionalExplanation": "Neither replaces helm install --dry-run, which validates against the live cluster's API and CRDs — helm template is entirely offline and won't catch a reference to a CRD that doesn't exist in this cluster. Running lint and template as separate CI gate steps shifts template errors left to every pull request instead of only surfacing at deploy time.",
    "realWorldExample": "A chart README documenting 'forgetting to inspect rendered manifests with helm template before applying' as an explicit common mistake is exactly the kind of institutional knowledge a CI step running helm template on every PR would enforce automatically.",
    "commands": [
      "helm template web ./webapp",
      "helm lint ./webapp --strict",
      "helm template web ./webapp --show-only templates/deployment.yaml"
    ],
    "followUpQuestions": [
      "What's the difference between helm template and helm install --dry-run?",
      "What does --strict change about helm lint's behavior?"
    ],
    "commonMistakes": [
      "Only running these locally before a commit instead of as an enforced CI gate before packaging",
      "Assuming helm template catches everything a real cluster's API validation would catch"
    ],
    "interviewTip": "Contrast helm template (fully offline) with --dry-run (talks to the cluster's API) explicitly — that distinction is exactly what separates people who've used both from people who've only used one.",
    "requiredKeywords": [
      "render",
      "lint",
      "debug"
    ],
    "relatedModule": "Helm",
    "reviewStatus": "reviewed"
  },
  "interview-helm-5": {
    "category": "Helm",
    "difficulty": "Mid-level DevOps",
    "question": "How do you roll back a Helm release?",
    "shortAnswer": "helm rollback RELEASE_NAME REVISION restores a prior revision's manifests and values, recording the rollback itself as a new revision.",
    "detailedAnswer": "Check helm history first to confirm which revision number was actually last known-good, then helm rollback web 3 (or omit the number to go to the immediately preceding revision). Helm doesn't delete history on rollback — it adds a new revision that happens to match an old one's content.",
    "beginnerExplanation": "If a new version of an app breaks something, helm rollback puts back the previous working version using Helm's own record of what that version looked like.",
    "professionalExplanation": "The most common rollback mistake is skipping helm history and assuming 'the previous revision' is automatically safe — if the previous revision was itself broken (a bad deploy two versions back), a blind rollback just reproduces the same failure. Pairing --wait with rollback also matters operationally, since it blocks until the restored resources actually report ready, not just that the API call was accepted.",
    "realWorldExample": "During an incident, helm history web shows revision 4 (current, broken) and revision 3 (STATUS: deployed, last known-good) — helm rollback web 3 --wait restores it and blocks until pods are healthy again.",
    "commands": [
      "helm history web",
      "helm rollback web 3",
      "helm rollback web 3 --wait"
    ],
    "followUpQuestions": [
      "What would you check before rolling back during a live incident?",
      "Does a rollback delete the revision history it's reverting from?"
    ],
    "commonMistakes": [
      "Rolling back without checking history first, potentially landing on a revision that was also broken",
      "Not using --wait during an automated or scripted rollback, so the script proceeds before pods are actually healthy"
    ],
    "interviewTip": "Frame this as an incident-response sequence (history, then rollback, then verify) rather than just naming the command — it shows you've actually operated this under pressure.",
    "requiredKeywords": [
      "rollback",
      "revision",
      "release"
    ],
    "relatedModule": "Helm",
    "reviewStatus": "reviewed"
  },
  "interview-terraform-1": {
    "category": "Terraform",
    "difficulty": "Beginner",
    "question": "What is Terraform state?",
    "shortAnswer": "State is Terraform's record mapping the resources declared in your config to the real infrastructure objects it created.",
    "detailedAnswer": "Without state, Terraform would have no way to know that the aws_instance.web block in your config corresponds to a specific already-existing EC2 instance ID — every plan compares your config against this state file (or remote state) to compute the diff, not against the live cloud API alone.",
    "beginnerExplanation": "State is like a receipt Terraform keeps for everything it's created, so next time you run it, it knows what already exists instead of creating duplicates.",
    "professionalExplanation": "State should virtually always be remote (S3+DynamoDB, Terraform Cloud, etc.) with locking, never a local file committed to Git — it often contains sensitive values in plaintext, and concurrent applies without locking can corrupt it or cause a lost-update race between two engineers running apply simultaneously.",
    "realWorldExample": "Two engineers running terraform apply at the same time against unlocked local state can each think they're the only one changing infrastructure, resulting in one's changes silently overwriting the other's in the state file.",
    "commands": [
      "terraform state list",
      "terraform state show aws_instance.web",
      "terraform plan"
    ],
    "followUpQuestions": [
      "Why should state almost never be a local file in a team setting?",
      "What's the risk of committing a state file to Git?"
    ],
    "commonMistakes": [
      "Manually editing a state file by hand instead of using terraform state commands",
      "Running state operations without a backup, risking corruption with no way back"
    ],
    "interviewTip": "Bring up remote state with locking unprompted — it's the detail that shows you understand state as a team-safety concern, not just a Terraform implementation detail.",
    "requiredKeywords": [
      "state",
      "mapping",
      "resources"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-terraform-2": {
    "category": "Terraform",
    "difficulty": "Junior DevOps",
    "question": "What is the purpose of terraform plan?",
    "shortAnswer": "terraform plan previews exactly what changes an apply would make, without touching any real infrastructure.",
    "detailedAnswer": "It computes the diff between current state, real infrastructure, and your config, showing resources to be created, changed in place, or destroyed — reviewing this output (especially any unexpected destroy) before running apply is the core safety practice in any Terraform workflow.",
    "beginnerExplanation": "plan is a dry run — it tells you exactly what would change if you applied, so you can catch a mistake before it actually happens to real infrastructure.",
    "professionalExplanation": "In a mature pipeline, plan output is what a human (or an automated policy check like Sentinel/OPA) reviews and approves before apply runs — treating an unreviewed destroy in a plan as a hard stop, not something to click through, is what prevents accidental production outages.",
    "realWorldExample": "A plan showing a resource will be destroyed and recreated (not just modified in place) because of a change to an immutable attribute is exactly the kind of surprise plan is meant to surface before it happens for real.",
    "commands": [
      "terraform plan",
      "terraform plan -out=tfplan",
      "terraform show tfplan"
    ],
    "followUpQuestions": [
      "What would make Terraform want to destroy and recreate a resource instead of updating it in place?",
      "How would you gate a pipeline on plan output before allowing apply?"
    ],
    "commonMistakes": [
      "Skipping plan review and running apply directly, especially in automated pipelines without a manual gate",
      "Not noticing an unexpected destroy buried in a long plan output"
    ],
    "interviewTip": "Mention the destroy-and-recreate surprise specifically — it's the exact scenario plan exists to catch, and naming it shows real usage, not just definitional knowledge.",
    "requiredKeywords": [
      "plan",
      "preview",
      "changes"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-terraform-3": {
    "category": "Terraform",
    "difficulty": "Mid-level DevOps",
    "question": "How do providers work?",
    "shortAnswer": "A provider is a plugin that translates Terraform resource blocks into calls against a specific API, like AWS, Azure, or Kubernetes.",
    "detailedAnswer": "Declaring required_providers pins a provider and version constraint; Terraform downloads the plugin binary, and each resource type (aws_instance, kubernetes_deployment) is implemented by that provider translating your declared config into the target API's actual create/read/update/delete calls.",
    "beginnerExplanation": "A provider is the translator between Terraform's generic language and a specific cloud or tool's real API — the aws provider knows how to talk to AWS, the kubernetes provider knows how to talk to a cluster.",
    "professionalExplanation": "Pinning provider versions (not just Terraform core version) matters because a provider major version bump can change resource schemas or behavior — an unconstrained provider version is a common source of a plan suddenly showing unexpected changes after a routine terraform init.",
    "realWorldExample": "A Terraform config managing both AWS infrastructure and Kubernetes resources (via the aws and kubernetes providers together) lets one apply provision an EKS cluster and then deploy workloads into it in the same run.",
    "commands": [
      "terraform init",
      "terraform providers",
      "terraform version"
    ],
    "followUpQuestions": [
      "Why would you pin a provider version constraint, not just the Terraform core version?",
      "Can one Terraform config use multiple providers together?"
    ],
    "commonMistakes": [
      "Leaving provider versions unconstrained and being surprised by a schema change after a routine init",
      "Assuming a provider update is always backward-compatible without checking its changelog"
    ],
    "interviewTip": "Mention version pinning specifically for providers, not just Terraform itself — it's a distinction junior engineers often miss.",
    "requiredKeywords": [
      "provider",
      "api",
      "resource"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-terraform-4": {
    "category": "Terraform",
    "difficulty": "Advanced",
    "question": "When would you use modules?",
    "shortAnswer": "Modules package a reusable, parameterized group of resources — reach for one once the same infrastructure pattern is deployed more than once.",
    "detailedAnswer": "A module takes input variables and exposes outputs, letting a VPC, an EKS cluster, or a standard app-tier pattern be defined once and instantiated per environment with different inputs, instead of copy-pasting the same 200 lines of HCL three times with small edits.",
    "beginnerExplanation": "A module is like a function in programming — you write the infrastructure pattern once, then call it with different arguments for dev, staging, and prod.",
    "professionalExplanation": "The real discipline is knowing when NOT to over-modularize: a one-off resource used exactly once doesn't need module indirection, and over-abstracting too early makes a config harder to read for the sake of reuse that never materializes. Reach for a module once you're about to copy-paste a resource block for the second time, not preemptively.",
    "realWorldExample": "A shared vpc module with a cidr_block input variable and subnet_ids output lets dev, staging, and prod each call module \"vpc\" { source = \"../modules/vpc\", cidr_block = \"10.0.0.0/16\" } with only the CIDR differing.",
    "commands": [
      "terraform init",
      "terraform plan -target=module.vpc",
      "terraform output"
    ],
    "followUpQuestions": [
      "When would you avoid creating a module?",
      "How do module outputs get consumed by the root configuration?"
    ],
    "commonMistakes": [
      "Over-modularizing a one-off resource that will never be reused, adding indirection for no benefit",
      "Hardcoding values inside a module that should be exposed as input variables for reuse"
    ],
    "interviewTip": "Explicitly mention when NOT to use a module — showing restraint on abstraction is a stronger signal of experience than just knowing modules exist.",
    "requiredKeywords": [
      "module",
      "reuse",
      "inputs"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-terraform-5": {
    "category": "Terraform",
    "difficulty": "Mid-level DevOps",
    "question": "How do you handle remote state safely?",
    "shortAnswer": "Store state in a remote backend with locking (S3+DynamoDB, Terraform Cloud) so concurrent applies can't corrupt it or race each other.",
    "detailedAnswer": "Locking ensures only one apply runs against a given state at a time — a second terraform apply attempted while another is in progress waits or fails cleanly instead of both writing to state simultaneously. Remote state also means the state isn't tied to one engineer's laptop and can be encrypted at rest and access-controlled independently of the Git repo.",
    "beginnerExplanation": "Remote state with locking means Terraform stores its 'what exists' record somewhere shared and safe, and puts a lock on it so two people can't run apply at the exact same time and corrupt it.",
    "professionalExplanation": "A stuck lock that never releases (a process crashed mid-apply) needs terraform force-unlock, but only after confirming no apply is genuinely still running — force-unlocking prematurely while a real apply is in flight can cause exactly the corruption locking exists to prevent.",
    "realWorldExample": "An S3 backend with a DynamoDB table for locking means a CI pipeline and an engineer's local terraform apply can never race each other — whichever acquires the DynamoDB lock item first proceeds, the other waits or errors.",
    "commands": [
      "terraform init -backend-config=...",
      "terraform force-unlock LOCK_ID",
      "terraform state pull"
    ],
    "followUpQuestions": [
      "What would you check before running terraform force-unlock during an incident?",
      "Why is a local state file risky for a team, even without locking concerns?"
    ],
    "commonMistakes": [
      "Using local state in a team setting where multiple people or CI can run apply concurrently",
      "Running force-unlock reflexively without confirming no apply is genuinely still in progress"
    ],
    "interviewTip": "Mention the force-unlock caution specifically — it shows you understand locking's failure mode, not just its happy path.",
    "requiredKeywords": [
      "backend",
      "locking",
      "state"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-ansible-1": {
    "category": "Ansible",
    "difficulty": "Beginner",
    "question": "What makes Ansible agentless?",
    "shortAnswer": "Ansible connects to managed nodes over standard SSH and runs Python modules remotely, requiring no persistent agent installed on target hosts.",
    "detailedAnswer": "The control node pushes a small Python payload over SSH, executes it, and removes it — there's no daemon running continuously on managed nodes the way Puppet or Chef agents work, which lowers the operational and security surface of the fleet being managed.",
    "beginnerExplanation": "You don't have to install any special software on the servers Ansible manages — it just connects over SSH (the same way you'd log in manually) and runs its automation from there.",
    "professionalExplanation": "This matters for onboarding new hosts (nothing to pre-install before Ansible can manage them) and for security review (no persistent agent process to patch or exploit on managed nodes) — the tradeoff is Ansible needs Python present on the target and SSH access configured correctly, which becomes the actual troubleshooting surface when a play fails to connect.",
    "realWorldExample": "Bringing a newly provisioned EC2 instance under management just requires it to be reachable over SSH and have Python installed — no agent install step, unlike a Puppet or Chef rollout.",
    "commands": [
      "ansible all -m ping -i inventory.ini",
      "ansible-playbook site.yml -i inventory.ini",
      "ssh -i key.pem user@host"
    ],
    "followUpQuestions": [
      "What has to be true on a target host for Ansible to manage it?",
      "How does agentless compare operationally to an agent-based tool like Puppet?"
    ],
    "commonMistakes": [
      "Assuming Ansible needs nothing at all on the target — Python and SSH access are still required",
      "Not testing connectivity with ansible -m ping before debugging a playbook failure that's actually an SSH/auth issue"
    ],
    "interviewTip": "Name the actual tradeoff (no agent to install/patch, but SSH+Python are still prerequisites) rather than just calling it 'agentless' as a buzzword.",
    "requiredKeywords": [
      "ssh",
      "control node",
      "managed node"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-ansible-2": {
    "category": "Ansible",
    "difficulty": "Junior DevOps",
    "question": "What is an inventory?",
    "shortAnswer": "An inventory is the list of hosts Ansible manages, organized into groups, either as a static file or generated dynamically.",
    "detailedAnswer": "A static INI or YAML inventory groups hosts (webservers, dbservers) and can set group-specific variables; a dynamic inventory script or plugin queries a live source like AWS EC2 tags so newly launched instances are automatically included without manually editing a file.",
    "beginnerExplanation": "The inventory is just the list of servers Ansible knows about and what group each one belongs to, so a playbook can target 'all webservers' instead of listing IPs by hand every time.",
    "professionalExplanation": "Dynamic inventory (an AWS EC2 plugin, for example) is the standard for any cloud-native fleet, since a static file goes stale the moment autoscaling launches or terminates an instance — group_vars and host_vars layered on top of the inventory are how per-environment or per-role configuration gets applied without duplicating it in every playbook.",
    "realWorldExample": "An AWS EC2 dynamic inventory plugin filtering on a tag like Environment=production automatically includes any newly launched production instance in the next playbook run, with no manual inventory update needed.",
    "commands": [
      "ansible-inventory -i inventory.ini --list",
      "ansible webservers -m ping -i inventory.ini",
      "ansible-playbook site.yml -i aws_ec2.yml"
    ],
    "followUpQuestions": [
      "Why would a static inventory file become a problem in a cloud autoscaling environment?",
      "How do group_vars and host_vars interact with the inventory?"
    ],
    "commonMistakes": [
      "Maintaining a static inventory file by hand in an autoscaling environment where hosts constantly change",
      "Not organizing hosts into meaningful groups, forcing every playbook to target individual hostnames"
    ],
    "interviewTip": "Bring up dynamic inventory for cloud environments specifically — it's the detail that shows real production Ansible use versus lab exercises.",
    "requiredKeywords": [
      "inventory",
      "hosts",
      "groups"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-ansible-3": {
    "category": "Ansible",
    "difficulty": "Mid-level DevOps",
    "question": "Why are handlers useful?",
    "shortAnswer": "A handler is a task that only runs when notified by another task that actually changed something, avoiding unnecessary restarts.",
    "detailedAnswer": "A task like 'update nginx config' can notify a handler named 'restart nginx', but that handler only actually fires if the config task reported changed — if the config was already correct (no change), nginx never gets restarted needlessly, and handlers run once at the end of a play even if notified multiple times.",
    "beginnerExplanation": "Instead of restarting a service on every single playbook run, a handler restarts it only when something it depends on (like its config file) actually changed.",
    "professionalExplanation": "This ties directly into idempotency: a well-written playbook run twice in a row with no underlying change should report zero changes and trigger zero handlers — if handlers fire on every run regardless of change, that's usually a signal the triggering task itself isn't properly idempotent.",
    "realWorldExample": "A template task rendering nginx.conf notifies 'restart nginx'; on a run where the template content is unchanged, Ansible reports the task as ok (not changed), and the restart handler never fires — avoiding an unnecessary service blip.",
    "commands": [
      "ansible-playbook site.yml --check",
      "ansible-playbook site.yml -v",
      "ansible-playbook site.yml --list-tasks"
    ],
    "followUpQuestions": [
      "What happens if a handler is notified twice in the same play?",
      "How does handler behavior relate to idempotency?"
    ],
    "commonMistakes": [
      "Putting a service restart directly in the main task list instead of a handler, causing unnecessary restarts on every run",
      "Not realizing handlers run once at the end of a play, not immediately when notified"
    ],
    "interviewTip": "Connect handlers explicitly to idempotency — that's the underlying design principle interviewers are actually probing for, not just the mechanics of notify/handler syntax.",
    "requiredKeywords": [
      "notify",
      "handler",
      "restart"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-ansible-4": {
    "category": "Ansible",
    "difficulty": "Beginner",
    "question": "What does idempotency mean in Ansible?",
    "shortAnswer": "An idempotent task produces the same end result whether run once or a hundred times, only making a change when the actual state differs from desired.",
    "detailedAnswer": "Ansible's built-in modules (package, service, template, file) are designed to check current state before acting — installing an already-installed package reports ok/unchanged rather than reinstalling; this is what makes it safe to re-run a playbook against a fleet repeatedly to reconcile toward the desired state, including as a scheduled drift-correction job.",
    "beginnerExplanation": "Running the same playbook twice shouldn't do anything different the second time if nothing changed in between — that's idempotency, and it's what makes automation safe to re-run without fear.",
    "professionalExplanation": "The main trap is using the shell or command module for something that has no idempotency check built in — a shell: echo 'export PATH=...' >> ~/.bashrc task run three times appends the line three times, whereas the equivalent lineinfile module checks first and only adds it once.",
    "realWorldExample": "A shell: mkdir /data task fails on the second run with 'File exists' unless idempotency is handled explicitly, while the equivalent file: path=/data state=directory module task is naturally idempotent and safe to re-run indefinitely.",
    "commands": [
      "ansible-playbook site.yml --check --diff",
      "ansible-playbook site.yml",
      "ansible-playbook site.yml -v"
    ],
    "followUpQuestions": [
      "Why is the shell module more risky for idempotency than purpose-built modules?",
      "How does --check mode help verify idempotency?"
    ],
    "commonMistakes": [
      "Using shell/command for tasks that have a proper idempotent module equivalent (file, lineinfile, package)",
      "Never running --check --diff to verify a playbook actually reports zero changes on a second run"
    ],
    "interviewTip": "Give the shell-module-versus-purpose-built-module example specifically — it's concrete evidence you understand why idempotency can silently break, not just what the word means.",
    "requiredKeywords": [
      "idempotent",
      "desired state",
      "repeat"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-ansible-5": {
    "category": "Ansible",
    "difficulty": "Junior DevOps",
    "question": "How do roles organize automation?",
    "shortAnswer": "A role packages tasks, handlers, templates, files, and default variables into one reusable, conventionally-structured unit.",
    "detailedAnswer": "Ansible's standard role directory layout (tasks/main.yml, handlers/main.yml, templates/, defaults/main.yml, vars/main.yml) means any role follows the same predictable shape, so it can be shared, version-pinned via Ansible Galaxy or a Git submodule, and composed into a playbook just by listing it under roles:.",
    "beginnerExplanation": "A role is a self-contained folder of everything needed to set up one thing — like an 'nginx' role containing the tasks, config template, and default settings to install and configure nginx — that you can reuse across different playbooks.",
    "professionalExplanation": "The real value at scale is composability and ownership: a platform team can maintain a well-tested 'base-hardening' or 'monitoring-agent' role that every application team's playbook simply includes, instead of every team re-implementing the same setup slightly differently.",
    "realWorldExample": "A playbook targeting webservers might simply list roles: [common, nginx, app-deploy] — each a separately maintained, reusable role — rather than one monolithic 200-line task list mixing all three concerns together.",
    "commands": [
      "ansible-galaxy init myrole",
      "ansible-playbook site.yml --list-tasks",
      "ansible-galaxy install -r requirements.yml"
    ],
    "followUpQuestions": [
      "What's the standard directory structure a role follows?",
      "How would you version-pin a shared role across multiple playbooks?"
    ],
    "commonMistakes": [
      "Writing one large monolithic playbook instead of composing focused, reusable roles",
      "Not using defaults/main.yml for sensible role defaults, forcing every consumer to set every variable explicitly"
    ],
    "interviewTip": "Mention Galaxy or Git-based version pinning for shared roles — it shows you think about roles as maintained, versioned artifacts, not just local folders.",
    "requiredKeywords": [
      "roles",
      "tasks",
      "templates"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-ci-cd-1": {
    "category": "CI/CD",
    "difficulty": "Beginner",
    "question": "What is the purpose of CI?",
    "shortAnswer": "Continuous Integration merges code changes frequently and runs automated tests/builds on every change to catch problems immediately, not weeks later.",
    "detailedAnswer": "Every push (or PR) triggers an automated pipeline that builds the code and runs the test suite, giving fast feedback on whether a change broke something — the alternative, waiting to integrate code rarely and testing manually, means bugs surface much later when they're far more expensive to trace back to their cause.",
    "beginnerExplanation": "CI means every time someone pushes code, a robot automatically builds it and runs the tests, so you find out within minutes if something broke instead of finding out days later.",
    "professionalExplanation": "The real value compounds with team size: without CI, integration problems between multiple developers' branches surface all at once at merge time ('integration hell'); with CI, each small change is validated in isolation, so the blast radius of any one bug is small and easy to bisect.",
    "realWorldExample": "A GitHub Actions workflow running npm test and npm run build on every pull request blocks a merge button until both pass, catching a broken test before it ever reaches main.",
    "commands": [
      "npm test",
      "git push origin feature-branch",
      "gh pr checks"
    ],
    "followUpQuestions": [
      "What's the cost of skipping CI on a small team versus a large one?",
      "How would you decide what belongs in a CI pipeline versus a separate CD pipeline?"
    ],
    "commonMistakes": [
      "Treating CI as optional for small changes, letting untested code accumulate on a branch",
      "Running tests locally but not enforcing them as a required CI check before merge"
    ],
    "interviewTip": "Frame CI around feedback speed and blast radius, not just 'it runs tests' — that's the actual engineering reasoning behind why teams adopt it.",
    "requiredKeywords": [
      "integrate",
      "test",
      "feedback"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-ci-cd-2": {
    "category": "CI/CD",
    "difficulty": "Junior DevOps",
    "question": "What is the purpose of CD?",
    "shortAnswer": "Continuous Delivery/Deployment automates getting a validated build out to an environment, reducing manual, error-prone release steps.",
    "detailedAnswer": "Continuous Delivery means every change that passes CI is automatically packaged and ready to deploy (often with a manual approval gate before production); Continuous Deployment goes further and deploys straight to production automatically with no human gate, relying entirely on automated tests and monitoring to catch problems.",
    "beginnerExplanation": "CD is the automated pipeline that takes a tested build and actually gets it running in an environment, instead of someone manually copying files or running deploy commands by hand.",
    "professionalExplanation": "The distinction between delivery (ready-to-deploy, human decides when) and deployment (auto-deploys) matters in interviews — most real-world 'CD' pipelines are actually continuous delivery with a manual production gate, not full continuous deployment, because the business wants a human decision point for production releases.",
    "realWorldExample": "A pipeline that auto-deploys every merged PR to a dev environment but requires a manual 'approve' click in the CI tool before promoting to production is continuous delivery to prod, continuous deployment to dev.",
    "commands": [
      "helm upgrade --install web ./webapp -f values-prod.yaml",
      "kubectl rollout status deployment/web",
      "gh workflow run deploy.yml"
    ],
    "followUpQuestions": [
      "What's the practical difference between continuous delivery and continuous deployment?",
      "Where would you put a manual approval gate in a pipeline and why?"
    ],
    "commonMistakes": [
      "Using 'CD' to mean deployment when the pipeline actually has a manual gate (that's delivery, not deployment)",
      "Deploying straight to production with no rollback mechanism if the automated deploy goes wrong"
    ],
    "interviewTip": "Distinguish delivery from deployment explicitly — it's a nuance many candidates blur, and getting it right stands out.",
    "requiredKeywords": [
      "deploy",
      "pipeline",
      "release"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-ci-cd-3": {
    "category": "CI/CD",
    "difficulty": "Mid-level DevOps",
    "question": "Why should pipelines run tests before deploy?",
    "shortAnswer": "Running tests before deploy catches regressions while they're cheap to fix, instead of discovering them in production where they affect real users.",
    "detailedAnswer": "Unit and integration tests validate logic quickly in isolation; catching a broken change at the test stage costs minutes, while catching the same bug after it's live in production costs an incident, a rollback, and potentially real user impact — the entire economic argument for testing is about where in the pipeline a quality problem is cheapest to catch.",
    "beginnerExplanation": "It's much cheaper and safer to find out a change is broken during an automated test run than to find out because a customer reports the app is down.",
    "professionalExplanation": "A mature pipeline layers test types by cost and confidence: fast unit tests run on every commit, slower integration/end-to-end tests run before deploy, and canary/synthetic checks run after deploy — failing fast at the cheapest stage is the whole point of the ordering.",
    "realWorldExample": "A pipeline that skips tests to 'move faster' and deploys directly can ship a null-pointer regression straight to production, where it's caught by a customer instead of a five-second unit test that would have failed the build.",
    "commands": [
      "npm test",
      "npm run test:integration",
      "kubectl rollout status deployment/web"
    ],
    "followUpQuestions": [
      "How would you structure a pipeline to fail fast on cheap checks before expensive ones?",
      "What's the tradeoff of running a slow full test suite on every single commit?"
    ],
    "commonMistakes": [
      "Skipping or disabling tests under deadline pressure, treating them as optional",
      "Running the full expensive test suite before cheap fast checks, wasting time on obviously broken commits"
    ],
    "interviewTip": "Frame this in cost terms (cheap to catch in CI, expensive to catch in production) — that's the argument that resonates with both engineering and business-minded interviewers.",
    "requiredKeywords": [
      "tests",
      "quality",
      "regression"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-ci-cd-4": {
    "category": "CI/CD",
    "difficulty": "Advanced",
    "question": "How would you protect production deployments?",
    "shortAnswer": "Combine a manual approval gate, automated rollback capability, and progressive rollout (canary or blue-green) so a bad deploy has limited blast radius.",
    "detailedAnswer": "A required approval step before the production stage prevents an accidental or unreviewed deploy; a canary or rolling strategy limits how many users see a bad version before health checks catch it and halt the rollout; and a tested, fast rollback path (helm rollback, kubectl rollout undo, or redeploying a prior artifact) means recovery is minutes, not hours.",
    "beginnerExplanation": "Instead of pushing a new version to 100% of users at once, you protect production by requiring a human sign-off, rolling out gradually, and having a fast 'undo' button ready if something goes wrong.",
    "professionalExplanation": "The environment-protection features in GitHub Actions/GitLab (required reviewers, wait timers, branch restrictions) enforce this at the platform level rather than relying on discipline — pairing that with automated health-check-gated rollouts (Argo Rollouts, native Kubernetes rolling updates with readiness probes) is what actually limits blast radius rather than just adding process friction.",
    "realWorldExample": "A GitHub Actions environment protection rule requiring two reviewers before a 'production' deploy job runs, combined with a Kubernetes Deployment using maxUnavailable: 0 and readiness probes, means a bad rollout is both reviewed beforehand and automatically paused if new pods fail health checks.",
    "commands": [
      "kubectl rollout status deployment/web",
      "kubectl rollout undo deployment/web",
      "helm rollback web"
    ],
    "followUpQuestions": [
      "How would a canary deployment actually detect a bad release automatically?",
      "What's the tradeoff between a manual approval gate and full automated deployment?"
    ],
    "commonMistakes": [
      "Relying only on 'someone will notice' instead of automated health checks gating the rollout",
      "Not having a tested rollback path — discovering during an actual incident that rollback doesn't work cleanly"
    ],
    "interviewTip": "Name a specific rollout strategy (canary, blue-green, or rolling with maxUnavailable) rather than speaking generically about 'careful deployments' — specificity is what interviewers are listening for.",
    "requiredKeywords": [
      "approval",
      "rollback",
      "environment"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-ci-cd-5": {
    "category": "CI/CD",
    "difficulty": "Beginner",
    "question": "What should a good pipeline artifact provide?",
    "shortAnswer": "A build artifact should be versioned, immutable, and identical across every environment it's deployed to.",
    "detailedAnswer": "Build once in a repeatable way, deploy the same artifact everywhere (dev, staging, prod) rather than rebuilding per environment — a version tag or content-addressable digest lets you know exactly what's running, and immutability means once published, that artifact's contents never silently change.",
    "beginnerExplanation": "A good artifact is like a sealed, labeled box — you build it once, label it with a version, and that exact same box gets shipped to every environment instead of building a slightly different box each time.",
    "professionalExplanation": "Rebuilding per-environment (instead of promoting one artifact through environments) is a common anti-pattern: it means what you tested in staging isn't byte-for-byte what actually reaches production, reintroducing exactly the kind of environment drift a build pipeline is supposed to eliminate.",
    "realWorldExample": "A Docker image tagged with a commit SHA (myapp:a1b2c3d) built once in CI and then promoted unchanged from dev to staging to prod guarantees the exact same bits are tested and deployed at every stage.",
    "commands": [
      "docker build -t myapp:$(git rev-parse --short HEAD) .",
      "docker push myapp:a1b2c3d",
      "docker pull myapp:a1b2c3d"
    ],
    "followUpQuestions": [
      "What's the risk of rebuilding an artifact separately for each environment?",
      "How would you version an artifact so its exact contents are traceable back to a commit?"
    ],
    "commonMistakes": [
      "Rebuilding the artifact fresh for each environment instead of promoting the same build",
      "Using a mutable tag like latest instead of an immutable, traceable version identifier"
    ],
    "interviewTip": "Say 'build once, promote everywhere' explicitly — it's the industry phrase for this principle and instantly signals you understand the reasoning, not just the mechanics.",
    "requiredKeywords": [
      "artifact",
      "version",
      "repeatable"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-devops-fundamentals-1": {
    "category": "DevOps fundamentals",
    "difficulty": "Beginner",
    "question": "What does DevOps mean?",
    "shortAnswer": "DevOps is the practice of breaking down the wall between development and operations through shared ownership, automation, and fast, reliable delivery.",
    "detailedAnswer": "Rather than developers throwing code over the wall to a separate ops team, DevOps means close collaboration where the same team (or tightly collaborating teams) owns build, test, deploy, and operate — enabled by automation (CI/CD, IaC) and measured by outcomes like deployment frequency and mean time to recovery, not just uptime.",
    "beginnerExplanation": "DevOps means developers and the people who run the infrastructure work together closely (often as the same team) instead of throwing code over a wall and hoping ops figures out how to run it.",
    "professionalExplanation": "It's a culture and set of practices, not a job title or a tool — hiring a 'DevOps engineer' to sit between dev and ops as a new silo actually contradicts the point. The measurable outcomes (DORA metrics: deployment frequency, lead time, change failure rate, MTTR) are what distinguish real DevOps adoption from just calling existing practices by a new name.",
    "realWorldExample": "A team practicing DevOps has the same engineers who write a feature also carry the pager for it in production, which creates a direct incentive to write observable, operable code rather than throwing reliability concerns over to someone else.",
    "commands": [
      "kubectl get pods",
      "terraform apply",
      "git push"
    ],
    "followUpQuestions": [
      "What DORA metrics would you use to measure DevOps maturity?",
      "How is a 'DevOps team' as a new silo actually contrary to DevOps principles?"
    ],
    "commonMistakes": [
      "Treating DevOps as just a job title or a specific toolchain rather than a collaboration model",
      "Creating a separate DevOps team that becomes a new silo instead of embedding practices across dev and ops"
    ],
    "interviewTip": "Mention DORA metrics by name — they're the concrete, measurable way DevOps maturity is actually assessed, and citing them shows you go beyond the cultural buzzwords.",
    "requiredKeywords": [
      "collaboration",
      "automation",
      "delivery"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "interview-devops-fundamentals-2": {
    "category": "DevOps fundamentals",
    "difficulty": "Junior DevOps",
    "question": "Why is infrastructure as code useful?",
    "shortAnswer": "IaC makes infrastructure changes version-controlled, reviewable, and repeatable, instead of manual and undocumented.",
    "detailedAnswer": "Defining infrastructure in Terraform/CloudFormation/Pulumi means every change goes through the same Git workflow as application code — a pull request, a diff to review, a history of who changed what and why — and the same config can spin up an identical environment repeatedly instead of relying on someone's memory of manual console steps.",
    "beginnerExplanation": "Instead of clicking around a cloud console to set things up (which nobody can review or easily repeat), IaC means you write the infrastructure setup in a file, just like code, that anyone can read, review, and re-run.",
    "professionalExplanation": "The real payoff is disaster recovery and audit: if a region or account is lost, IaC means you can reconstruct the exact infrastructure from Git rather than reverse-engineering console clicks nobody documented, and every change has a reviewable PR trail for compliance.",
    "realWorldExample": "A terraform plan attached to a pull request lets a teammate review exactly what infrastructure will change before it's applied, the same way they'd review an application code diff.",
    "commands": [
      "terraform plan",
      "terraform apply",
      "git log infra/"
    ],
    "followUpQuestions": [
      "How does IaC help with disaster recovery specifically?",
      "What's the risk of manual console changes alongside an IaC-managed environment?"
    ],
    "commonMistakes": [
      "Making manual console changes alongside IaC, causing drift the code no longer accurately represents",
      "Not reviewing terraform plan output in pull requests, treating IaC review as optional"
    ],
    "interviewTip": "Bring up disaster recovery and drift specifically — those are the two consequences interviewers most want to hear you understand, beyond 'it's version controlled'.",
    "requiredKeywords": [
      "version",
      "repeatable",
      "review"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-devops-fundamentals-3": {
    "category": "DevOps fundamentals",
    "difficulty": "Mid-level DevOps",
    "question": "What is immutable infrastructure?",
    "shortAnswer": "Immutable infrastructure means servers or containers are never patched in place — a change means building and deploying a new, consistent instance and discarding the old one.",
    "detailedAnswer": "Instead of SSHing in to apply a patch or config change to a running server, you bake the change into a new image (AMI, Docker image), deploy new instances from it, and terminate the old ones — eliminating configuration drift between servers that were each patched slightly differently over time.",
    "beginnerExplanation": "Instead of fixing a running server directly (which can leave it slightly different from its siblings over time), you build a fresh, updated version and replace the old one entirely.",
    "professionalExplanation": "This is what makes rollback trivial and reliable: rolling back means redeploying the previous known-good image, not trying to reverse a series of in-place patches whose exact history nobody fully tracked. It's also why containers fit this model naturally — a container's writable layer is meant to be disposable by design.",
    "realWorldExample": "Instead of SSHing into a running EC2 instance to apply a security patch, an immutable-infrastructure pipeline builds a new AMI with the patch baked in, and an Auto Scaling Group rolling update replaces old instances with new ones from that AMI.",
    "commands": [
      "docker build -t myapp:v2 .",
      "kubectl rollout restart deployment/web",
      "packer build ami.pkr.hcl"
    ],
    "followUpQuestions": [
      "How does immutable infrastructure make rollback more reliable than in-place patching?",
      "How does this principle apply to containers specifically?"
    ],
    "commonMistakes": [
      "SSHing into production servers to apply quick fixes, defeating the point of immutability and reintroducing drift",
      "Confusing immutable infrastructure with just 'using containers' without actually avoiding in-place changes"
    ],
    "interviewTip": "Connect immutability directly to rollback reliability — it's the concrete operational payoff, not just an abstract principle.",
    "requiredKeywords": [
      "replace",
      "consistent",
      "image"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-devops-fundamentals-4": {
    "category": "DevOps fundamentals",
    "difficulty": "Advanced",
    "question": "How do monitoring and alerting support operations?",
    "shortAnswer": "Monitoring gives visibility into system health via metrics/logs/traces; alerting turns specific unhealthy conditions into a page so a human response happens before users are widely affected.",
    "detailedAnswer": "Good monitoring answers 'is the system healthy' at a glance via dashboards and lets you drill into 'why' during an incident; good alerting is symptom-based (users are experiencing errors/latency) rather than cause-based (a specific internal metric crossed a threshold), which avoids paging on things that don't actually affect users.",
    "beginnerExplanation": "Monitoring is watching your system's vital signs continuously; alerting is what wakes someone up when those vital signs show a real problem, ideally before customers notice.",
    "professionalExplanation": "Alert fatigue from noisy, low-signal alerts is one of the most damaging operational problems a team can have — every alert should be actionable and tied to actual user impact (an SLO burn rate, not just 'CPU is at 80%'), or engineers start ignoring pages entirely, which is far more dangerous than having no alerting at all.",
    "realWorldExample": "An SLO-burn-rate alert (error budget consuming faster than sustainable) pages on-call for a real reliability threat, while a raw 'CPU > 80%' alert on an autoscaling group that's working as designed just generates noise that trains engineers to ignore pages.",
    "commands": [
      "kubectl top pods",
      "curl -s http://localhost:9090/api/v1/query",
      "amtool alert query"
    ],
    "followUpQuestions": [
      "What's the difference between symptom-based and cause-based alerting?",
      "How would you reduce alert fatigue on a team drowning in low-value pages?"
    ],
    "commonMistakes": [
      "Alerting on every internal metric threshold instead of on actual user-facing symptoms",
      "Letting alert fatigue accumulate until real pages get ignored alongside the noise"
    ],
    "interviewTip": "Bring up alert fatigue and symptom-based alerting unprompted — it shows you've operated on-call, not just set up a dashboard once.",
    "requiredKeywords": [
      "metrics",
      "alerts",
      "response"
    ],
    "relatedModule": "Observability",
    "reviewStatus": "reviewed"
  },
  "interview-devops-fundamentals-5": {
    "category": "DevOps fundamentals",
    "difficulty": "Beginner",
    "question": "What is configuration drift?",
    "shortAnswer": "Configuration drift is when a system's actual live state diverges from what its declared configuration (code, IaC, playbook) says it should be.",
    "detailedAnswer": "It typically happens through manual out-of-band changes — someone SSHing in to fix something quickly, or a console click that is never reflected back into Terraform or Ansible — and it is dangerous because the next automated run either silently reverts the manual fix or, worse, the team no longer has an accurate picture of the desired state actually running.",
    "beginnerExplanation": "Drift is what happens when someone makes a manual change to a live server that never gets recorded in the code that's supposed to describe it — now the code and reality disagree.",
    "professionalExplanation": "Detecting drift proactively (a scheduled terraform plan or ansible-playbook --check run that alerts on any diff) is far better than discovering it during an incident, when you suddenly can't trust that your IaC actually represents what's running. Preventing drift structurally — locking down console/SSH access so all changes must go through the pipeline — is more reliable than relying on discipline alone.",
    "realWorldExample": "A security group rule added manually through the AWS console during an incident, never reflected back into Terraform, gets silently removed the next time someone runs terraform apply — because Terraform's state says that rule shouldn't exist.",
    "commands": [
      "terraform plan",
      "ansible-playbook site.yml --check --diff",
      "aws configservice get-resource-config-history"
    ],
    "followUpQuestions": [
      "How would you detect drift before it causes an incident?",
      "What's a structural way to prevent drift rather than relying on discipline?"
    ],
    "commonMistakes": [
      "Making an emergency manual fix during an incident and never reconciling it back into IaC afterward",
      "Only discovering drift when an automated apply unexpectedly reverts a manual change"
    ],
    "interviewTip": "Give the specific manual-fix-during-an-incident scenario — it's the realistic way drift actually happens, more convincing than a definitional answer.",
    "requiredKeywords": [
      "drift",
      "desired state",
      "change"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-troubleshooting-1": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "A deployment fails after release. What do you check first?",
    "shortAnswer": "kubectl rollout status and kubectl get events for the Deployment immediately show whether pods are failing to schedule, pull an image, or pass health checks.",
    "detailedAnswer": "kubectl describe deployment/rollout events narrow it to one of a few categories fast: ImagePullBackOff (bad tag or registry auth), CrashLoopBackOff (app-level failure, check logs --previous), or Pending (scheduling/resource issue) — each has a completely different next step, so identifying the category first avoids wasted debugging time.",
    "beginnerExplanation": "kubectl get pods shows the new pods' status right away — whether they're stuck Pending, crashing, or failing to pull the image tells you which direction to dig in.",
    "professionalExplanation": "The fastest safe move if the failure is clear-cut and user-impacting is often an immediate rollback (kubectl rollout undo) and investigating the root cause afterward from the safety of a working state, rather than debugging live in production while users are affected.",
    "realWorldExample": "kubectl get pods showing new pods stuck in ImagePullBackOff points straight at a bad image tag or registry credential in the deploy step, distinct from a CrashLoopBackOff which points at the application itself.",
    "commands": [
      "kubectl rollout status deployment/api",
      "kubectl get events --sort-by='.lastTimestamp'",
      "kubectl rollout undo deployment/api"
    ],
    "followUpQuestions": [
      "How would ImagePullBackOff and CrashLoopBackOff point you toward different root causes?",
      "When would you roll back immediately versus debug in place?"
    ],
    "commonMistakes": [
      "Debugging extensively in production before considering an immediate rollback to restore service first",
      "Not distinguishing between a scheduling problem (Pending) and an application problem (CrashLoopBackOff) before investigating"
    ],
    "interviewTip": "Mention rolling back first, investigating after — prioritizing restoring service over root-causing live is what senior engineers actually do during an incident.",
    "requiredKeywords": [
      "logs",
      "events",
      "rollback"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-troubleshooting-2": {
    "category": "Troubleshooting",
    "difficulty": "Advanced",
    "question": "A service is unreachable. How do you isolate the issue?",
    "shortAnswer": "Work outward layer by layer: DNS resolution, then port connectivity, then application health, rather than guessing.",
    "detailedAnswer": "nslookup/dig confirms DNS resolves to the right address; nc -zv or telnet confirms the port is actually open and accepting connections; curl against the app's own health endpoint confirms the application itself is responding — each layer either rules itself out or points you to the next one to check.",
    "beginnerExplanation": "Check DNS first (does the name resolve to the right place), then the network (can you even connect to that port), then the app itself (does it respond correctly) — in that order, from outside in.",
    "professionalExplanation": "The reason to go in this specific order is that each check is progressively more expensive and specific: DNS and port checks take seconds and immediately rule out entire categories of problems (a firewall/security group, a typo'd DNS record) before you spend time in application logs for a problem that was actually infrastructure-level.",
    "realWorldExample": "nc -zv api.internal 443 timing out (not refused, timing out) points at a security group or NetworkPolicy blocking the connection at the network layer, distinct from a connection refused which would mean nothing's listening on that port at all.",
    "commands": [
      "dig api.internal",
      "nc -zv api.internal 443",
      "curl -v https://api.internal/health"
    ],
    "followUpQuestions": [
      "What's the difference between a connection timeout and connection refused, diagnostically?",
      "How would a NetworkPolicy or security group misconfiguration show up in this process?"
    ],
    "commonMistakes": [
      "Jumping straight into application logs before ruling out DNS and network-layer issues",
      "Not distinguishing 'connection refused' (nothing listening) from 'connection timeout' (blocked somewhere in between)"
    ],
    "interviewTip": "Explicitly contrast connection refused versus timeout — that distinction alone tells an interviewer you've actually debugged network issues, not just read about the OSI model.",
    "requiredKeywords": [
      "network",
      "dns",
      "port"
    ],
    "relatedModule": "Linux",
    "reviewStatus": "reviewed"
  },
  "interview-troubleshooting-3": {
    "category": "Troubleshooting",
    "difficulty": "Beginner",
    "question": "A container exits immediately. What do you inspect?",
    "shortAnswer": "Check its exit code and logs first — docker ps -a shows the code, docker logs shows what it printed before dying.",
    "detailedAnswer": "Exit code 0 means it ran and finished cleanly (maybe the CMD isn't actually a long-running foreground process), non-zero is an application error, and 137 means it was killed, often OOM. If logs are empty, the CMD/ENTRYPOINT itself may be wrong — overriding it with a shell to poke around interactively is the next step.",
    "beginnerExplanation": "docker ps -a shows the exit code of a stopped container, and docker logs CONTAINER shows what it printed right before it stopped — together they usually explain why.",
    "professionalExplanation": "A very common beginner mistake is a container that exits 0 immediately because its main process isn't actually a foreground, long-running process — for example CMD [\"service\", \"nginx\", \"start\"] backgrounds nginx and then the container has nothing left to run, so Docker considers it 'done' and exits, which looks like a crash but isn't one.",
    "realWorldExample": "A container running CMD service nginx start exits 0 immediately because that command starts nginx as a background daemon and returns — the fix is running nginx in the foreground (nginx -g 'daemon off;') as the container's actual process.",
    "commands": [
      "docker ps -a",
      "docker logs CONTAINER",
      "docker run -it --entrypoint /bin/sh myimage"
    ],
    "followUpQuestions": [
      "Why would a container exit 0 immediately even though the service it's supposed to run is still 'working'?",
      "What does exit code 137 specifically tell you?"
    ],
    "commonMistakes": [
      "Not realizing a foreground-vs-background process choice in CMD affects whether the container stays alive",
      "Assuming every immediate exit is a crash instead of checking whether it exited 0 (clean, but wrong process model)"
    ],
    "interviewTip": "Bring up the foreground-process requirement specifically — it's the single most common reason new Docker users see 'my container just exits' and shows real hands-on debugging.",
    "requiredKeywords": [
      "logs",
      "command",
      "exit code"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-troubleshooting-4": {
    "category": "Troubleshooting",
    "difficulty": "Junior DevOps",
    "question": "Terraform apply fails halfway. What do you do?",
    "shortAnswer": "Don't panic-retry — check terraform plan and terraform state list to see exactly what was and wasn't created before deciding the next step.",
    "detailedAnswer": "Terraform generally handles partial failure gracefully by recording what it did succeed in creating in state, so a subsequent terraform apply picks up where it left off rather than starting over — but you should still read the actual error first, since a real API error (quota, permissions) will just fail again immediately on retry without a fix.",
    "beginnerExplanation": "Terraform keeps track of what it already created even if the whole apply didn't finish, so running terraform plan again shows you exactly what's left to do rather than starting from scratch.",
    "professionalExplanation": "The dangerous case is when state and reality disagree after a partial failure — a resource that was actually created but the API call to record it in state timed out. terraform plan showing an unexpected 'create' for something that might already exist is the signal to investigate with terraform import or a manual check in the provider's console before blindly re-applying.",
    "realWorldExample": "An apply that fails on resource 15 of 20 due to a transient API rate limit can usually just be re-run — terraform plan confirms only the remaining 5 resources need creating, since the first 15 are already recorded in state.",
    "commands": [
      "terraform plan",
      "terraform state list",
      "terraform apply"
    ],
    "followUpQuestions": [
      "What would make you suspicious that state and real infrastructure have diverged after a partial failure?",
      "When would you use terraform import instead of just re-running apply?"
    ],
    "commonMistakes": [
      "Immediately re-running apply without reading the actual error, missing a real underlying problem like a quota limit",
      "Not checking plan output for unexpected creates that might indicate a state/reality mismatch"
    ],
    "interviewTip": "Emphasize reading the actual error before retrying — panic-retrying is the mistake interviewers are specifically listening for you to avoid.",
    "requiredKeywords": [
      "state",
      "plan",
      "retry"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-troubleshooting-5": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "An Ansible play fails on one host. How do you debug it?",
    "shortAnswer": "Re-run with -vvv for verbose output and --limit to target just the failing host, isolating the problem without re-running against the whole fleet.",
    "detailedAnswer": "Verbose mode shows the exact module arguments and remote command Ansible ran, which usually reveals the real error (a permission issue, a missing package, a template variable that resolved differently on that one host); --limit failed_host (or Ansible's own retry file) reruns just that host instead of the entire inventory while you iterate.",
    "beginnerExplanation": "ansible-playbook site.yml --limit broken-host -vvv reruns the playbook against only the one failing server with much more detailed output about exactly what went wrong.",
    "professionalExplanation": "A host-specific failure when the same play succeeds everywhere else is often a host_vars/group_vars difference (that host is in a different group with a different variable value) rather than a bug in the play itself — checking ansible-inventory --host FAILED_HOST to see its actual resolved variables is often faster than staring at the task.",
    "realWorldExample": "A play failing only on one host because it belongs to a group with a different ansible_python_interpreter set in group_vars is invisible until you check that host's actually-resolved variables, not just the playbook source.",
    "commands": [
      "ansible-playbook site.yml --limit broken-host -vvv",
      "ansible-inventory --host broken-host",
      "ansible broken-host -m setup"
    ],
    "followUpQuestions": [
      "Why would a play fail on only one host when it works everywhere else?",
      "What does Ansible's retry file (.retry) do?"
    ],
    "commonMistakes": [
      "Re-running the full playbook against the entire inventory to debug a single-host failure, wasting time",
      "Not checking whether the failing host has different resolved group_vars/host_vars before assuming the task itself is broken"
    ],
    "interviewTip": "Mention checking resolved host variables specifically (ansible-inventory --host) — it's the fast diagnostic step that separates real experience from guessing at the task logic.",
    "requiredKeywords": [
      "verbose",
      "limit",
      "module"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-scenario-based-questions-1": {
    "category": "Scenario-based questions",
    "difficulty": "Beginner",
    "question": "Design a simple deployment flow for a web app.",
    "shortAnswer": "Build once, run automated tests, push a versioned artifact, then deploy that exact artifact through dev, staging, and production with increasing gates.",
    "detailedAnswer": "On every push: run tests, build a Docker image tagged with the commit SHA, push it to a registry. Auto-deploy that image to dev; a manual or automated promotion (after further tests) moves the identical image to staging; a manual approval gate moves it to production, ideally with a rolling or canary rollout and an easy rollback path.",
    "beginnerExplanation": "Code gets tested, built into one package, and that exact same package moves through dev, then staging, then production — getting a bit more scrutiny at each step before reaching real users.",
    "professionalExplanation": "The two principles that make this design solid are build-once-promote-everywhere (never rebuild per environment) and progressively increasing gates (dev auto-deploys freely, production requires approval and has the tightest rollout controls) — both reduce risk without slowing down early-stage iteration.",
    "realWorldExample": "A GitHub Actions workflow builds myapp:$(git rev-parse --short HEAD), pushes it, deploys to dev automatically, and gates the same image's promotion to prod behind a required reviewer on a protected environment.",
    "commands": [
      "docker build -t myapp:$(git rev-parse --short HEAD) .",
      "kubectl set image deployment/web web=myapp:a1b2c3d",
      "kubectl rollout status deployment/web"
    ],
    "followUpQuestions": [
      "How would you handle a database migration as part of this flow?",
      "What would you add to make this safe for a high-traffic production service?"
    ],
    "commonMistakes": [
      "Rebuilding the artifact separately for each environment instead of promoting one build",
      "Skipping a staging environment entirely, testing changes for the first time in production"
    ],
    "interviewTip": "Sketch the flow left to right verbally (build → test → dev → staging → prod) with a gate named at each transition — a structured walkthrough beats a list of tools.",
    "requiredKeywords": [
      "build",
      "test",
      "deploy"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-scenario-based-questions-2": {
    "category": "Scenario-based questions",
    "difficulty": "Junior DevOps",
    "question": "How would you migrate a manual server setup into automation?",
    "shortAnswer": "Document the manual steps as an inventory of what exists, then codify them incrementally as an idempotent Ansible playbook, validating with --check before ever touching production.",
    "detailedAnswer": "Start by auditing what's actually installed and configured on the existing server (packages, config files, cron jobs, users) — that becomes your task list. Write the playbook against a throwaway test server first, run it with --check --diff to confirm it reports the expected state with zero unintended changes, then run it against a single canary production host before the full fleet.",
    "beginnerExplanation": "You write down everything that was set up by hand, turn each step into an Ansible task, test it safely on a spare server first, and only then run it carefully against the real servers one at a time.",
    "professionalExplanation": "The riskiest part of this migration is the very first run against an already-manually-configured production host — --check mode (dry run) is essential there specifically because the playbook might have gaps versus what's actually on the box, and you want to see the diff before anything changes for real.",
    "realWorldExample": "Running ansible-playbook site.yml --check --diff --limit prod-web-01 against one already-manually-configured production host surfaces every difference between the playbook's assumptions and that server's actual current state before making any real change.",
    "commands": [
      "ansible-playbook site.yml --check --diff --limit prod-web-01",
      "ansible-playbook site.yml --limit prod-web-01",
      "ansible-inventory --list"
    ],
    "followUpQuestions": [
      "What would you do if --check shows unexpected differences on an already-configured host?",
      "How would you roll this out safely across a large existing fleet?"
    ],
    "commonMistakes": [
      "Running the new playbook against the full fleet immediately instead of a single canary host first",
      "Skipping --check mode on the first run against an already-manually-configured server"
    ],
    "interviewTip": "Emphasize the canary-host-first, --check-first sequence — it shows you respect that migrating existing infrastructure is riskier than automating a fresh server.",
    "requiredKeywords": [
      "inventory",
      "playbook",
      "idempotent"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "interview-scenario-based-questions-3": {
    "category": "Scenario-based questions",
    "difficulty": "Mid-level DevOps",
    "question": "How would you expose a Kubernetes backend API?",
    "shortAnswer": "A ClusterIP Service in front of the backend Pods, fronted by an Ingress that routes external traffic to it based on host/path rules.",
    "detailedAnswer": "The Service gives the backend a stable internal address and load-balances across its Pods via label selector; the Ingress (backed by a controller like nginx-ingress or an ALB) terminates external traffic, handles TLS, and routes /api requests to that Service — this avoids exposing every backend Service directly as a costly, individually-managed LoadBalancer.",
    "beginnerExplanation": "A Service groups the backend's Pods under one stable internal address, and an Ingress is the front door that lets traffic from outside the cluster reach that Service at a specific path like /api.",
    "professionalExplanation": "For a single API this is straightforward; the design gets more interesting with multiple backend services sharing one Ingress via path-based routing (/api → backend, / → frontend), and considerations like rate limiting, TLS termination point, and whether internal service-to-service calls should also route through the Ingress or talk directly via Service DNS (they should talk directly — Ingress is for external traffic only).",
    "realWorldExample": "An Ingress resource routing path /api to backend-service:5000 and path / to frontend-service:80 lets one external hostname serve both the API and the frontend without exposing two separate LoadBalancers.",
    "commands": [
      "kubectl expose deployment backend --port=5000",
      "kubectl apply -f ingress.yaml",
      "kubectl get ingress"
    ],
    "followUpQuestions": [
      "Why not just expose the backend directly as a LoadBalancer Service?",
      "How would internal service-to-service calls differ from external Ingress-routed calls?"
    ],
    "commonMistakes": [
      "Exposing every backend individually as a separate costly LoadBalancer instead of consolidating through one Ingress",
      "Routing internal service-to-service traffic through the external Ingress instead of directly via Service DNS"
    ],
    "interviewTip": "Explain why internal calls should bypass the Ingress and go straight to the Service — that's the detail that shows real architectural understanding, not just 'add an Ingress'.",
    "requiredKeywords": [
      "service",
      "ingress",
      "selector"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "interview-scenario-based-questions-4": {
    "category": "Scenario-based questions",
    "difficulty": "Advanced",
    "question": "How would you reduce Docker image size?",
    "shortAnswer": "Use a multi-stage build, a minimal base image (alpine or distroless), and a .dockerignore to keep build context and final layers lean.",
    "detailedAnswer": "Multi-stage builds discard the compiler/toolchain and build-time dependencies from the final image; switching from a full OS base to alpine or a distroless image removes unused packages entirely; combining RUN commands and cleaning package manager caches in the same layer avoids leaving stale cache data baked into an intermediate layer that still counts toward image size even if later 'removed'.",
    "beginnerExplanation": "The three big levers are: only ship the finished artifact (not the build tools), start from the smallest base image that actually works, and don't accidentally bake in build caches or files you don't need.",
    "professionalExplanation": "A subtlety often missed: deleting a file in a later RUN instruction doesn't remove it from the image size, because each instruction creates a new layer and earlier layers are immutable — apt-get install ... && apt-get clean must happen in the same RUN command as the install, not a separate later one, or the cache is still baked into the earlier layer.",
    "realWorldExample": "Switching a Node.js image from node:18 (full Debian base, ~1GB) to a multi-stage build ending in node:18-alpine (~150MB) can cut image size by 80%+ while shipping the identical application code.",
    "commands": [
      "docker build -t myapp .",
      "docker history myapp",
      "docker images myapp"
    ],
    "followUpQuestions": [
      "Why doesn't deleting a file in a later Dockerfile instruction reduce the final image size?",
      "What's the tradeoff of switching to a distroless base image?"
    ],
    "commonMistakes": [
      "Cleaning package caches in a separate RUN instruction from the install, leaving the cache baked into an earlier layer anyway",
      "Not using multi-stage builds for compiled languages, shipping the entire build toolchain unnecessarily"
    ],
    "interviewTip": "Explain the layer-immutability reason why cache cleanup must happen in the same RUN as the install — it's the specific technical detail that separates real Dockerfile experience from surface knowledge.",
    "requiredKeywords": [
      "multi-stage",
      "cache",
      "dependencies"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "interview-scenario-based-questions-5": {
    "category": "Scenario-based questions",
    "difficulty": "Beginner",
    "question": "How would you structure Terraform for dev and prod?",
    "shortAnswer": "Shared reusable modules for the actual resources, with a separate directory (or workspace) per environment supplying different variable values and its own state.",
    "detailedAnswer": "A modules/ directory defines the reusable infrastructure pattern (a VPC module, an app-tier module); environments/dev and environments/prod each have their own main.tf calling those modules with environment-specific variables and their own remote state backend, so a mistake in dev's apply can never touch prod's state.",
    "beginnerExplanation": "You write the infrastructure pattern once as a reusable module, then have a separate small folder per environment that just plugs in different settings (like instance size or environment name) and has its own completely separate state file.",
    "professionalExplanation": "The critical design decision is separate state per environment (directory-based separation, or at minimum separate workspaces with separate backends) — sharing one state file across environments means a bad apply against what you thought was dev can accidentally touch prod resources tracked in the same state.",
    "realWorldExample": "environments/prod/main.tf calling module \"app\" { source = \"../../modules/app\", instance_count = 5 } while environments/dev/main.tf calls the same module with instance_count = 1 — same reusable module, different scale, completely separate state files per environment.",
    "commands": [
      "terraform workspace list",
      "terraform init -backend-config=prod.backend.hcl",
      "terraform plan -var-file=prod.tfvars"
    ],
    "followUpQuestions": [
      "Why is separate state per environment important, beyond just organization?",
      "When would you choose Terraform workspaces over separate directories?"
    ],
    "commonMistakes": [
      "Sharing one state file across dev and prod, risking a dev mistake affecting production resources",
      "Duplicating the actual resource definitions per environment instead of extracting them into a shared module"
    ],
    "interviewTip": "Justify separate state specifically as a blast-radius safety measure, not just tidiness — that's the reasoning interviewers want to hear.",
    "requiredKeywords": [
      "modules",
      "backend",
      "variables"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "interview-behavioural-questions-1": {
    "category": "Behavioural questions",
    "difficulty": "Mid-level DevOps",
    "question": "Tell me about a time you handled an outage.",
    "shortAnswer": "Use STAR: describe the user-facing impact, your immediate diagnosis and mitigation steps, and the concrete lesson learned and prevention work afterward.",
    "detailedAnswer": "Structure it as Situation (what broke and who it affected), Task (your role in the response), Action (the specific diagnostic and mitigation steps you took, in order), and Result (restoration time and, critically, what changed afterward so it can't recur the same way) — vague answers without a concrete timeline or specific commands read as rehearsed rather than real.",
    "beginnerExplanation": "Walk through it like a story with a clear beginning (what broke), middle (what you did about it, step by step), and end (how it got fixed and what you changed so it doesn't happen again).",
    "professionalExplanation": "Interviewers are listening for the follow-up work as much as the firefighting — a candidate who describes mitigating an incident but has no answer for 'what did you change afterward' signals they treat incidents as one-off fires rather than sources of systemic improvement (a blameless postmortem, a new alert, an added test).",
    "realWorldExample": "A concrete answer: 'A deploy caused 500s on the checkout API; I rolled back within 4 minutes using kubectl rollout undo, confirmed recovery via the error-rate dashboard, then in the postmortem we added a pre-deploy smoke test that would have caught this exact regression.'",
    "commands": [
      "kubectl rollout undo deployment/api",
      "kubectl rollout status deployment/api",
      "kubectl logs -l app=api --since=10m"
    ],
    "followUpQuestions": [
      "What changed in your systems or process after that incident?",
      "How did you communicate status to stakeholders during the outage?"
    ],
    "commonMistakes": [
      "Describing the fix but having no answer for what changed afterward to prevent recurrence",
      "Being vague about the actual technical steps taken instead of naming specific commands and decisions"
    ],
    "interviewTip": "End with the concrete prevention change, not just 'we fixed it' — that's the detail that shows systemic thinking over firefighting.",
    "requiredKeywords": [
      "impact",
      "action",
      "lesson"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "interview-behavioural-questions-2": {
    "category": "Behavioural questions",
    "difficulty": "Junior DevOps",
    "question": "How do you communicate risk before a deployment?",
    "shortAnswer": "State the specific risk, its likelihood and blast radius, and the mitigation/rollback plan — in plain terms stakeholders can act on, not just 'this might break something'.",
    "detailedAnswer": "A useful risk statement names what could go wrong, who's affected if it does, how you'd detect it fast, and exactly how you'd roll back — giving stakeholders a real decision to make (proceed with this plan, or wait) rather than vague reassurance that everything will probably be fine.",
    "beginnerExplanation": "Instead of just saying 'this deploy is a bit risky,' you explain specifically what could go wrong, how bad it would be if it did, and what you'd do about it immediately if it happened.",
    "professionalExplanation": "This is also about calibrating communication to audience — engineering peers want the technical detail (which migration, which feature flag), while non-technical stakeholders want the business-impact version (checkout might be slow for up to 10 minutes, here's our rollback plan) — giving the wrong version to the wrong audience undermines trust either way.",
    "realWorldExample": "Before a database migration, communicating 'this adds a new column with a default value, expected to take under 2 minutes with no downtime, but if it locks longer than 5 minutes we'll abort and roll back the migration file' gives stakeholders a concrete, actionable risk picture instead of just 'should be fine'.",
    "commands": [
      "terraform plan",
      "kubectl rollout status deployment/api",
      "git log -1 --stat"
    ],
    "followUpQuestions": [
      "How would you adjust this communication for a non-technical stakeholder versus an engineering peer?",
      "What would you do if a stakeholder pushed back on the risk you identified?"
    ],
    "commonMistakes": [
      "Giving vague reassurance ('should be fine') instead of naming the specific risk and mitigation",
      "Using the same technical framing for both engineering and non-technical audiences"
    ],
    "interviewTip": "Give a real example with specifics (a rollback threshold, a time estimate) rather than describing risk communication abstractly.",
    "requiredKeywords": [
      "risk",
      "stakeholders",
      "rollback"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "interview-behavioural-questions-3": {
    "category": "Behavioural questions",
    "difficulty": "Beginner",
    "question": "How do you learn a tool you have not used before?",
    "shortAnswer": "Start with the official docs and deliberate hands-on practice, then learn the failure modes by breaking things in a safe environment and getting real feedback.",
    "detailedAnswer": "Official documentation and a quickstart give the mental model fast; actually running the tool against a throwaway environment (not just reading) is what makes the knowledge stick; deliberately triggering common failures (a bad config, a network block) builds the troubleshooting instinct that reading alone never provides.",
    "beginnerExplanation": "Read the docs, but more importantly actually install and use the tool on something low-stakes, and try to break it on purpose so you learn what errors look like before you see them for real.",
    "professionalExplanation": "For a genuinely unfamiliar tool being introduced to a team, the fastest real-world path is often: build a small proof-of-concept solving an actual internal problem, present what you learned (including the gotchas) to the team, and treat that documentation as the team's onboarding material — learning in public compounds faster than learning solo.",
    "realWorldExample": "Learning Helm by taking an existing raw Kubernetes manifest set and converting it into a working chart with values.yaml overrides teaches the real mechanics far faster than just reading the Helm docs end to end.",
    "commands": [
      "helm create test-chart",
      "terraform plan",
      "docker run -it --rm alpine sh"
    ],
    "followUpQuestions": [
      "Can you give an example of a tool you learned this way recently?",
      "How do you decide when you know a tool well enough to use it in production?"
    ],
    "commonMistakes": [
      "Only reading documentation without ever hands-on testing the tool before claiming familiarity",
      "Never deliberately exploring failure modes, so the first real failure in production is also the first one encountered"
    ],
    "interviewTip": "Name a specific tool you actually learned this way recently — a concrete, current example is far more convincing than a generic learning philosophy.",
    "requiredKeywords": [
      "documentation",
      "practice",
      "feedback"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "interview-behavioural-questions-4": {
    "category": "Behavioural questions",
    "difficulty": "Advanced",
    "question": "Describe a time you improved a process.",
    "shortAnswer": "Identify the specific pain point with data (time wasted, incidents caused), the automation or process change you made, and the measurable before/after result.",
    "detailedAnswer": "A strong answer names the actual problem quantitatively (deploys took 45 minutes and required a specific person to be online), the change (automated the manual steps into a pipeline), and the measurable outcome (down to 8 minutes, any engineer can trigger it) — the numbers are what make it credible rather than a vague 'I made things better' claim.",
    "beginnerExplanation": "Pick a real annoying, slow, or error-prone process you actually fixed, and be ready to say roughly how much time or how many errors it saved, not just that it 'got better'.",
    "professionalExplanation": "The strongest version of this answer also addresses adoption — a process improvement that only you use isn't really an improvement to the team; explaining how you got buy-in (documentation, a demo, making the new way strictly easier than the old way) shows organizational impact beyond individual output.",
    "realWorldExample": "Automating a manual deployment checklist into a GitHub Actions pipeline reduced deploy time from 45 minutes to 8 and removed the requirement that one specific senior engineer be available to run it — measured by comparing deploy logs before and after.",
    "commands": [
      "gh workflow run deploy.yml",
      "git log --oneline -- .github/workflows/",
      "kubectl rollout status deployment/web"
    ],
    "followUpQuestions": [
      "How did you get the rest of the team to adopt the new process?",
      "What resistance, if any, did you encounter and how did you handle it?"
    ],
    "commonMistakes": [
      "Describing the improvement without any concrete before/after numbers",
      "Not addressing whether the rest of the team actually adopted the change"
    ],
    "interviewTip": "Lead with the number (45 minutes to 8) before the mechanism — quantified impact is what makes this answer memorable versus generic.",
    "requiredKeywords": [
      "problem",
      "automation",
      "result"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "interview-behavioural-questions-5": {
    "category": "Behavioural questions",
    "difficulty": "Junior DevOps",
    "question": "How do you handle disagreement during incident response?",
    "shortAnswer": "Prioritize restoring service over being right — listen to the evidence, defer to whoever has the fastest safe mitigation, and save the technical debate for the postmortem.",
    "detailedAnswer": "During an active incident, the goal is reducing user impact, not reaching consensus on root cause — if someone proposes a plausible, low-risk mitigation (like a rollback) and you disagree about the underlying cause, support trying it first since it's reversible, and have the real technical discussion afterward with full information and less time pressure.",
    "beginnerExplanation": "In the middle of an outage, the priority is fixing it fast and safely, not winning an argument — if a teammate has a reasonable, low-risk idea, try it first and debate the details once things are stable again.",
    "professionalExplanation": "This connects to incident command practice: having a single clearly designated decision-maker during an incident (even if it's not you) resolves disagreement structurally — everyone can advocate for their view, but one person makes the call so the team isn't stuck debating while users are affected.",
    "realWorldExample": "During an incident where one engineer wants to roll back immediately and another wants to patch forward, deferring to the incident commander's call to roll back first (since it's fast and reversible) and revisiting the patch-forward idea in the postmortem avoids the team debating while the outage continues.",
    "commands": [
      "kubectl rollout undo deployment/api",
      "kubectl rollout status deployment/api",
      "git revert HEAD"
    ],
    "followUpQuestions": [
      "How would you raise a concern about a decision you disagreed with, without derailing the response?",
      "What role does an incident commander play in resolving disagreements like this?"
    ],
    "commonMistakes": [
      "Continuing to debate root cause during an active incident instead of prioritizing a fast, reversible mitigation",
      "Not deferring to a designated decision-maker when time pressure calls for one"
    ],
    "interviewTip": "Bring up incident command / a designated decision-maker specifically — it shows you understand disagreement resolution as a process design problem, not just an interpersonal skill.",
    "requiredKeywords": [
      "listen",
      "evidence",
      "priority"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-behavioural-intro": {
    "category": "Behavioural questions",
    "difficulty": "Junior DevOps",
    "question": "Brief yourself: your background, project, and responsibilities.",
    "shortAnswer": "Give a two-minute summary with real impact: current role, years of experience, core tools, current project, daily responsibilities, and one measurable achievement.",
    "detailedAnswer": "Structure it as a short arc: where you are now, the stack you work in day to day, one project you own end to end, and a specific quantified win — this is the one question every interview opens with, so a tight, rehearsed-but-natural version matters disproportionately.",
    "beginnerExplanation": "Think of it as your elevator pitch: what do you do, what tools do you use daily, and what's one thing you're proud of that you can put a number on.",
    "professionalExplanation": "Tailor the emphasis to the role you're interviewing for — lead with Kubernetes/Terraform depth for an infra-heavy role, lead with pipeline/release ownership for a CI/CD-focused role — the content should shift slightly per interview rather than being one fixed script.",
    "realWorldExample": "A strong version names specifics: 'I run CI/CD pipelines in GitHub Actions and manage Terraform-provisioned AWS infrastructure and Kubernetes workloads; last quarter I cut our deploy time from 45 to 8 minutes by automating a manual release checklist.'",
    "commands": [
      "kubectl get pods",
      "terraform apply",
      "git log --oneline -10"
    ],
    "followUpQuestions": [
      "What's the most complex system you currently own?",
      "What would your team say you're best known for?"
    ],
    "commonMistakes": [
      "Answering only with a job title and years of experience, with no specific tools, project, or measurable impact",
      "Rambling past two minutes instead of a tight, structured summary"
    ],
    "interviewTip": "Practice this out loud with a timer — two minutes feels short until you've actually rehearsed it, and going long here sets a bad tone for the rest of the interview.",
    "requiredKeywords": [
      "role",
      "tools",
      "impact"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-aws-lb-unavailable": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "An EC2 application behind a load balancer is suddenly unavailable. How do you troubleshoot?",
    "shortAnswer": "Debug layer by layer: load balancer target health first, then the app process, then security groups and recent logs.",
    "detailedAnswer": "Check the target group's health check status first — if targets are unhealthy, the LB is correctly refusing to route to them, which redirects the investigation to the instance itself: is the app process running (systemctl status), does its health check path actually return 200, and do security groups allow the LB's health-check traffic through on that port.",
    "beginnerExplanation": "Start at the load balancer and work toward the server: are the targets marked healthy? If not, log into the instance and check whether the app is actually running and whether the firewall (security group) allows the load balancer to reach it.",
    "professionalExplanation": "A subtlety that trips people up: the health check path and the actual application path can differ (health check hits /health, but /health itself depends on a downstream dependency like a database) — an unhealthy target can be a symptom of a downstream failure, not the instance itself, so check what the health endpoint actually verifies before assuming the instance is broken.",
    "realWorldExample": "Targets showing unhealthy with a 'connection refused' reason usually means the app process isn't listening on the expected port at all — systemctl status confirms whether it crashed, while a 'timeout' reason more often points at a security group blocking the load balancer's health-check source.",
    "commands": [
      "systemctl status myapp",
      "curl -sv http://localhost:8080/health",
      "journalctl -u myapp --since '10 min ago'"
    ],
    "followUpQuestions": [
      "What's the difference between 'connection refused' and 'timeout' as an unhealthy-target reason?",
      "How would you check if the health check path itself depends on a failing downstream service?"
    ],
    "commonMistakes": [
      "SSHing straight into the instance before checking target group health, skipping the fastest diagnostic signal",
      "Not checking whether the health check endpoint depends on a downstream service that's actually the real failure"
    ],
    "interviewTip": "Name the specific unhealthy-target reason codes (timeout vs connection refused) — that level of AWS console familiarity signals real hands-on troubleshooting.",
    "requiredKeywords": [
      "target health",
      "security group",
      "logs"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-aws-cost-spike": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "AWS billing increased suddenly. How do you identify the cost spike?",
    "shortAnswer": "Start in Cost Explorer grouped by service and region to find what changed, then drill into resources missing tags and data transfer costs.",
    "detailedAnswer": "Cost Explorer's day-over-day, service-grouped view usually isolates the spike to one service immediately; from there, check for an oversized instance left running, a NAT Gateway's data transfer charges (a very common silent spike), or untagged resources nobody's tracking ownership of.",
    "beginnerExplanation": "AWS Cost Explorer lets you see spend broken down by service and day, so you can spot exactly which service's cost jumped and when, instead of just seeing one big total number go up.",
    "professionalExplanation": "NAT Gateway data transfer is one of the most common 'invisible' cost spikes because it scales with traffic in a way that's easy to miss until the bill arrives — pairing Cost Explorer with AWS Budgets and Cost Anomaly Detection catches this proactively rather than reactively after the invoice.",
    "realWorldExample": "A cost spike traced to a single oversized EC2 instance or a test resource that was never tagged with an owner or auto-stop schedule and was left running over a weekend is a textbook case Cost Explorer's service-grouped view surfaces immediately.",
    "commands": [
      "aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity DAILY --metrics BlendedCost",
      "aws resourcegroupstaggingapi get-resources --tag-filters Key=Owner",
      "aws budgets describe-budgets --account-id 123456789012"
    ],
    "followUpQuestions": [
      "Why is NAT Gateway data transfer a particularly sneaky source of cost spikes?",
      "How would you set up proactive alerting instead of discovering spikes after the bill arrives?"
    ],
    "commonMistakes": [
      "Only looking at the total bill instead of the service-and-region breakdown that actually isolates the cause",
      "Not tagging resources with an owner, making it hard to know who to ask about an unexpected spend"
    ],
    "interviewTip": "Mention Cost Anomaly Detection and budgets/tagging as prevention, not just Cost Explorer as investigation — it shows you think about cost control proactively.",
    "requiredKeywords": [
      "cost explorer",
      "region",
      "tags"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-dev-ec2": {
    "category": "Scenario-based questions",
    "difficulty": "Junior DevOps",
    "question": "A developer needs an EC2 instance for local deployment. What instance type and controls would you choose?",
    "shortAnswer": "A small burstable instance like t3.medium in a dev VPC, a least privilege IAM role, and SSM Session Manager instead of open SSH.",
    "detailedAnswer": "t3.medium's burstable CPU credits fit typical dev workloads without paying for constant full-CPU capacity; the IAM role should only grant what that dev's workflow actually needs, not broad admin access; and SSM Session Manager avoids opening port 22 to the internet entirely, removing a whole class of exposure.",
    "beginnerExplanation": "Give the developer a small, cheap instance (t3.medium is a common reasonable size), a role that only allows what they actually need to do, and access it through AWS's Session Manager instead of leaving SSH open to the world.",
    "professionalExplanation": "The part interviewers want to hear beyond instance sizing is lifecycle management: dev instances left running unattended are a top source of avoidable cost, so an auto-stop schedule (or a scheduled Lambda that stops untagged/idle instances outside work hours) paired with owner/environment tags is what actually prevents this from becoming a recurring cost and security problem.",
    "realWorldExample": "Tagging the instance Owner=jsmith, Environment=dev and attaching an EventBridge-scheduled Lambda that stops all Environment=dev instances at 8pm daily prevents forgotten dev instances from running (and costing money) over nights and weekends.",
    "commands": [
      "aws ec2 run-instances --instance-type t3.medium --iam-instance-profile Name=dev-role",
      "aws ssm start-session --target i-0123456789abcdef0",
      "aws ec2 stop-instances --instance-ids i-0123456789abcdef0"
    ],
    "followUpQuestions": [
      "Why prefer SSM Session Manager over opening SSH access?",
      "How would you enforce auto-stop scheduling across many dev instances?"
    ],
    "commonMistakes": [
      "Granting broad or admin-level IAM permissions to a dev instance instead of scoping to actual needs",
      "Leaving SSH open on port 22 to 0.0.0.0/0 instead of using SSM or a bastion/VPN"
    ],
    "interviewTip": "Bring up auto-stop scheduling and tagging unprompted — instance type and IAM are the obvious parts of this answer, cost lifecycle management is what shows senior judgment.",
    "requiredKeywords": [
      "t3.medium",
      "least privilege",
      "ssm"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-k8s-external-access": {
    "category": "Troubleshooting",
    "difficulty": "Junior DevOps",
    "question": "A Kubernetes deployment succeeded but the app is not accessible externally. How do you troubleshoot?",
    "shortAnswer": "Work outward: pod readiness, then the Service's selector/endpoints, then the Ingress, then DNS and security groups.",
    "detailedAnswer": "kubectl get endpoints for the Service is the fastest single check — empty endpoints means the Service's label selector doesn't match any ready Pod, which is by far the most common cause of this exact symptom, before even considering Ingress or DNS issues.",
    "beginnerExplanation": "First check the pods are actually ready, then check the Service has 'endpoints' pointing at them (if not, the labels probably don't match), then check the Ingress and finally DNS if the Service itself looks fine.",
    "professionalExplanation": "A Service with zero endpoints produces no error anywhere — kubectl get svc still shows the Service existing normally, which is exactly why this is such a common trap for people newer to Kubernetes; the only way to catch it is explicitly checking endpoints, not just assuming the Service is 'working' because it exists.",
    "realWorldExample": "kubectl get endpoints backend-svc returning <none> immediately reveals a selector/label mismatch — for example the Service selects app: backend but the Deployment's Pods are labeled app: backend-api after a refactor that missed updating the Service.",
    "commands": [
      "kubectl get endpoints backend-svc",
      "kubectl get pods --show-labels",
      "curl -v http://backend-svc.namespace.svc.cluster.local"
    ],
    "followUpQuestions": [
      "Why would a Service show no error even when it has zero matching endpoints?",
      "How would you test connectivity to the Service from inside the cluster versus from outside?"
    ],
    "commonMistakes": [
      "Jumping to Ingress or DNS debugging before checking the much more common Service-selector mismatch",
      "Not testing from inside the cluster first to isolate whether it's a Service problem or an external routing problem"
    ],
    "interviewTip": "Lead with kubectl get endpoints by name — it's the single fastest diagnostic for this exact symptom and naming it shows you've hit this before.",
    "requiredKeywords": [
      "service",
      "selector",
      "ingress"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-k8s-node-fails": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "When a Kubernetes node fails, what happens to the pods?",
    "shortAnswer": "The node becomes NotReady, and after a grace period its Pods are evicted; controller-managed Pods get rescheduled elsewhere, standalone Pods are not.",
    "detailedAnswer": "The node controller marks a node NotReady after missing heartbeats for a configured threshold, then after the pod-eviction-timeout (default 5 minutes) begins evicting its Pods; a Deployment or StatefulSet's controller notices the missing replicas and schedules new Pods on healthy nodes, but a bare Pod created without a controller is simply gone with nothing to recreate it.",
    "beginnerExplanation": "If a node dies, Kubernetes waits a few minutes to be sure, then treats its Pods as gone — if those Pods belonged to a Deployment, new ones get created elsewhere automatically; if they were standalone Pods, they're just gone.",
    "professionalExplanation": "This is exactly why bare Pods are essentially never used in production, and why PodDisruptionBudgets matter for availability: a PDB ensures that even during a voluntary disruption (like a node drain for maintenance) a minimum number of replicas stay available throughout, rather than all being evicted from a node simultaneously.",
    "realWorldExample": "A StatefulSet-managed database Pod on a failed node gets rescheduled to a healthy node and reattaches its PersistentVolumeClaim automatically, while a bare debugging Pod someone created manually on that same node is simply lost with no recreation.",
    "commands": [
      "kubectl get nodes",
      "kubectl describe node NODE_NAME",
      "kubectl get pods -o wide --field-selector spec.nodeName=NODE_NAME"
    ],
    "followUpQuestions": [
      "What is the default pod-eviction-timeout and why does that grace period exist?",
      "How does a PodDisruptionBudget protect availability during planned node maintenance?"
    ],
    "commonMistakes": [
      "Creating bare Pods in production without a Deployment/StatefulSet managing them",
      "Not configuring PodDisruptionBudgets, allowing all replicas of a service to be evicted from one node simultaneously"
    ],
    "interviewTip": "Mention PodDisruptionBudgets specifically — it's the detail that shows you think about availability during planned disruption, not just unplanned node failure.",
    "requiredKeywords": [
      "notready",
      "rescheduled",
      "deployment"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-k8s-prod-podspec": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "What should you configure in a pod spec for production readiness?",
    "shortAnswer": "Resource requests/limits, liveness/readiness probes, pinned image tags, and a security context — not just a bare container spec.",
    "detailedAnswer": "Requests let the scheduler place Pods sensibly and limits prevent one Pod from starving its node; readiness probes keep a slow-starting or unhealthy Pod out of Service load balancing (traffic safety) while liveness probes restart a genuinely stuck process; runAsNonRoot and readOnlyRootFilesystem in the security context reduce blast radius if the container is compromised.",
    "beginnerExplanation": "Beyond just 'run this image,' a production pod spec should say how much CPU/memory it needs, how to check if it's healthy, exactly which image version to run (not :latest), and that it shouldn't run as root.",
    "professionalExplanation": "The readiness-vs-liveness distinction is a common interview probe: readiness controls traffic routing (temporarily out of rotation, not restarted), liveness controls whether the container gets killed and restarted — a liveness probe misconfigured too aggressively can cause unnecessary restarts of an otherwise-healthy-but-slow Pod, which is a very different failure mode than a readiness misconfiguration.",
    "realWorldExample": "A production pod spec pinning image: myapp:a1b2c3d (not :latest), with resources.requests/limits set, a readinessProbe hitting /health, and securityContext.runAsNonRoot: true is the concrete checklist most production admission policies actually enforce.",
    "commands": [
      "kubectl get pod POD_NAME -o yaml",
      "kubectl top pod POD_NAME",
      "kubectl describe pod POD_NAME"
    ],
    "followUpQuestions": [
      "What's the practical difference between a readiness probe failing and a liveness probe failing?",
      "Why is pinning an exact image tag important for production versus using :latest?"
    ],
    "commonMistakes": [
      "Using :latest as an image tag instead of a pinned, traceable version",
      "Confusing readiness and liveness probes, misconfiguring one to do the other's job"
    ],
    "interviewTip": "Explicitly separate readiness (traffic safety) from liveness (restart on stuck process) — that distinction is exactly what interviewers are probing for with this question.",
    "requiredKeywords": [
      "requests",
      "probes",
      "securityContext"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-git-mirror": {
    "category": "CI/CD",
    "difficulty": "Junior DevOps",
    "question": "How do you migrate a Git repository with full commit history?",
    "shortAnswer": "A bare clone followed by a mirror push preserves every commit, branch, tag, and ref exactly as they were.",
    "detailedAnswer": "git clone --bare pulls down the complete repository data (not a working copy), and git push --mirror to the new remote pushes everything — branches, tags, and all refs — exactly as they existed, unlike a normal clone/push which only handles the currently checked-out branch.",
    "beginnerExplanation": "A regular clone only really gives you the branch you're on; a bare clone plus a mirror push copies literally everything — every branch and tag — to the new location.",
    "professionalExplanation": "After a mirror migration, update any CI/CD webhooks, branch protection rules, and collaborator access on the new remote — those don't migrate automatically with the git data itself, and forgetting them is the most common way a 'successful' migration still breaks the team's workflow on day one.",
    "realWorldExample": "git clone --bare git@old-host:team/repo.git followed by cd repo.git && git push --mirror git@new-host:team/repo.git moves the entire repository, after which branch protection rules and CI integrations still need to be reconfigured on the new host.",
    "commands": [
      "git clone --bare git@old-host:team/repo.git",
      "git push --mirror git@new-host:team/repo.git",
      "git remote -v"
    ],
    "followUpQuestions": [
      "What doesn't migrate automatically with a mirror push that you'd still need to set up?",
      "How would you verify the migration preserved everything correctly?"
    ],
    "commonMistakes": [
      "Doing a normal clone/push instead of a bare clone with mirror push, silently losing branches or tags",
      "Forgetting to reconfigure CI webhooks and branch protection on the new remote after migrating"
    ],
    "interviewTip": "Mention the post-migration checklist (webhooks, branch protection, access) unprompted — the git commands themselves are the easy part of this question.",
    "requiredKeywords": [
      "bare clone",
      "mirror",
      "tags"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-git-branching": {
    "category": "CI/CD",
    "difficulty": "Beginner",
    "question": "What is Git, why do we use it, and what is a branching strategy?",
    "shortAnswer": "Git is distributed version control for tracking changes, enabling collaboration, history, and rollback; a branching strategy defines how a team isolates, reviews, and releases changes.",
    "detailedAnswer": "Being distributed means every clone has the full history, not just a pointer to a central server — collaboration, blame/history for debugging, and reverting a bad change are all built on that history. A branching strategy (Git Flow, GitHub Flow, trunk-based) is the team's agreed convention for how feature work gets isolated, reviewed via PR, and merged toward a releasable state.",
    "beginnerExplanation": "Git tracks every change to your code over time so multiple people can work on the same project without overwriting each other, and can always go back to a previous version. A branching strategy is just the team's agreed rules for how and when to create and merge branches.",
    "professionalExplanation": "Trunk-based development (short-lived branches, frequent merges to main, feature flags for incomplete work) has become the dominant strategy for teams practicing real CI/CD, because long-lived feature branches (classic Git Flow) tend to accumulate painful merge conflicts and delay integration — the strategy choice directly affects how achievable continuous integration actually is.",
    "realWorldExample": "A team using trunk-based development merges small PRs to main multiple times a day behind feature flags, keeping integration continuous, versus a Git Flow team maintaining long-lived release branches that diverge from main for weeks at a time.",
    "commands": [
      "git checkout -b feature/new-thing",
      "git merge --no-ff feature/new-thing",
      "git log --graph --oneline --all"
    ],
    "followUpQuestions": [
      "Why does trunk-based development fit continuous integration better than Git Flow?",
      "How do feature flags help with trunk-based development specifically?"
    ],
    "commonMistakes": [
      "Letting feature branches live for weeks, causing large, painful merge conflicts at integration time",
      "Choosing a branching strategy without connecting it to how it affects the team's actual release cadence"
    ],
    "interviewTip": "Name the specific strategy you've used (Git Flow, GitHub Flow, or trunk-based) and why it fit that team's release cadence — a concrete opinion beats listing all three neutrally.",
    "requiredKeywords": [
      "distributed",
      "history",
      "branching"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-pipeline-dev-uat": {
    "category": "CI/CD",
    "difficulty": "Junior DevOps",
    "question": "Write or describe a CI/CD pipeline to test and deploy from Dev to UAT.",
    "shortAnswer": "Run tests, build and push an artifact, auto-deploy to Dev, then gate promotion to UAT behind a manual approval.",
    "detailedAnswer": "On every push: run the test suite, build a versioned image/artifact, push it to a registry, deploy it to Dev automatically for immediate feedback; promotion to UAT uses that identical artifact and requires a manual approval step, since UAT is where stakeholders validate before production, not somewhere every commit should land unreviewed.",
    "beginnerExplanation": "Tests run first, then the app gets packaged and automatically deployed to Dev so developers see it working right away; moving that same package to UAT needs someone to click approve first, since UAT is meant for more careful validation.",
    "professionalExplanation": "The artifact promoted to UAT must be the exact same one tested in Dev (build once, promote, don't rebuild) — otherwise UAT isn't actually validating what will ship, defeating the purpose of having a UAT stage at all.",
    "realWorldExample": "For a containerized app: npm test, docker build/push tagged with the commit SHA, kubectl set image for the dev namespace automatically, then a required-reviewer GitHub Actions environment gate before the identical image tag gets applied to the UAT namespace.",
    "commands": [
      "npm test",
      "docker build -t myapp:$(git rev-parse --short HEAD) . && docker push myapp:$(git rev-parse --short HEAD)",
      "kubectl set image deployment/web web=myapp:a1b2c3d -n uat"
    ],
    "followUpQuestions": [
      "Why is it important that UAT deploys the exact same artifact that was tested in Dev?",
      "What would you add to gate the UAT-to-production promotion?"
    ],
    "commonMistakes": [
      "Rebuilding the artifact separately for UAT instead of promoting the exact image tested in Dev",
      "Auto-deploying to UAT with no approval gate, treating it the same as Dev"
    ],
    "interviewTip": "Emphasize 'same artifact, different gate' explicitly between Dev and UAT — that's the principle interviewers are checking for, not just naming pipeline stages.",
    "requiredKeywords": [
      "test",
      "build",
      "manual approval"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-maven-repositories": {
    "category": "CI/CD",
    "difficulty": "Beginner",
    "question": "What is Maven and what are Maven repositories?",
    "shortAnswer": "Maven is a Java build and dependency management tool driven by pom.xml, resolving dependencies from local, remote, and central repositories.",
    "detailedAnswer": "pom.xml declares a project's dependencies and build lifecycle; Maven resolves those dependencies first from the local cache (~/.m2), then a configured private/remote repository, then Maven Central if not found closer — the same layered lookup that makes builds reproducible without re-downloading everything every time.",
    "beginnerExplanation": "Maven reads a pom.xml file that lists what libraries your Java project needs, and automatically downloads and manages them from repositories instead of you gathering .jar files by hand.",
    "professionalExplanation": "In an enterprise setting, a private repository manager (Nexus or Artifactory) sits between developers and Maven Central — it caches public dependencies for reliability and speed, and crucially hosts internal/proprietary artifacts that should never be published publicly, giving the team one controlled, auditable source of truth for every dependency.",
    "realWorldExample": "A company's internal shared library gets published to a private Nexus repository, and every service's pom.xml references it via that internal repository URL rather than a public one, keeping proprietary code out of Maven Central entirely.",
    "commands": [
      "mvn clean install",
      "mvn dependency:tree",
      "mvn deploy -DaltDeploymentRepository=nexus::default::https://nexus.internal/repo"
    ],
    "followUpQuestions": [
      "Why would a company run its own Nexus or Artifactory instead of relying only on Maven Central?",
      "What's the difference between the local repository cache and a remote repository?"
    ],
    "commonMistakes": [
      "Publishing internal/proprietary artifacts to a public repository instead of a private one",
      "Not understanding the local-then-remote dependency resolution order, leading to confusion about stale cached versions"
    ],
    "interviewTip": "Bring up Nexus/Artifactory for internal artifact hosting specifically — it's the enterprise-relevant detail beyond the basic definition of Maven.",
    "requiredKeywords": [
      "pom.xml",
      "local",
      "remote"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-jenkins-prod-fail": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "A Jenkins pipeline works in Dev but fails in Production. How do you fix it?",
    "shortAnswer": "Compare environment parity systematically: versions, config, credentials, network access, and the specific failing stage, with verbose logs to isolate the diff.",
    "detailedAnswer": "The failure is almost always something that differs between the two environments rather than the pipeline logic itself — start by diffing environment variables/config, confirm the production credentials Jenkins is using are actually valid and haven't expired, check network/firewall access to production-only resources, and enable verbose logging on the specific failing stage rather than the whole pipeline.",
    "beginnerExplanation": "Since the same pipeline code works in Dev, the problem is almost always some difference in the Production environment itself — different credentials, different network rules, or a different config value — not a bug in the pipeline script.",
    "professionalExplanation": "Expired or scoped-differently production credentials and missing cross-account IAM permissions are two of the most common real causes of this exact symptom — checking Jenkins' credential store and the specific IAM role/policy used for the production stage, before re-reading the pipeline script line by line, saves significant debugging time.",
    "realWorldExample": "A pipeline stage failing only in production due to expired AWS credentials in Jenkins' credential store, or a firewall rule allowing Dev's IP range but not Jenkins' production runner's IP range, are both classic environment-parity causes distinct from a pipeline logic bug.",
    "commands": [
      "jenkins-cli.jar console JOB_NAME",
      "aws sts get-caller-identity",
      "curl -v https://prod-internal-service:443"
    ],
    "followUpQuestions": [
      "What specific things would you diff between the Dev and Production Jenkins configurations first?",
      "How would you verify production credentials are valid before re-running the pipeline?"
    ],
    "commonMistakes": [
      "Assuming the pipeline script itself is broken and re-reading it line by line before checking environment-specific config",
      "Not checking credential expiry or cross-account permission scope as an early diagnostic step"
    ],
    "interviewTip": "Lead with 'the pipeline code is probably fine, the environment differs' — that framing itself signals experienced debugging instinct.",
    "requiredKeywords": [
      "environment parity",
      "credentials",
      "permissions"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-argocd": {
    "category": "CI/CD",
    "difficulty": "Junior DevOps",
    "question": "What is ArgoCD and why do teams use it?",
    "shortAnswer": "ArgoCD is a pull-based GitOps continuous delivery tool for Kubernetes that continuously syncs cluster state to manifests stored in Git and flags drift.",
    "detailedAnswer": "Instead of a CI pipeline pushing changes into the cluster with cluster-admin credentials, ArgoCD runs inside the cluster and pulls the desired state from a Git repo, reconciling continuously — this improves credential safety (no external system holds broad cluster-write access) and gives a UI/CLI view of drift between Git and live state at all times, not just at deploy time.",
    "beginnerExplanation": "ArgoCD watches a Git repo of Kubernetes manifests and keeps the cluster matching it automatically — if someone manually changes something in the cluster, ArgoCD notices it's different from Git and can flag or fix it.",
    "professionalExplanation": "Rollback with ArgoCD is just a Git revert — reverting the commit and letting ArgoCD reconcile is simpler and more auditable than running imperative rollback commands, since the desired state history lives entirely in Git's commit log.",
    "realWorldExample": "A Helm values change merged to main automatically triggers ArgoCD to detect drift and sync the cluster to match, deploying the change without anyone running a manual kubectl or helm command.",
    "commands": [
      "argocd app sync myapp",
      "argocd app diff myapp",
      "kubectl get application myapp -n argocd"
    ],
    "followUpQuestions": [
      "How does ArgoCD's pull-based model improve credential security compared to a CI pipeline pushing deploys?",
      "How would you roll back a bad ArgoCD-managed deploy?"
    ],
    "commonMistakes": [
      "Manually editing cluster resources ArgoCD manages, causing it to flag or revert the change as drift",
      "Confusing push-based CD (CI writes to the cluster) with ArgoCD's pull-based reconciliation model"
    ],
    "interviewTip": "Explain rollback as 'just a git revert' — it's the specific detail that shows you understand GitOps as a philosophy, not just ArgoCD as a tool.",
    "requiredKeywords": [
      "gitops",
      "sync",
      "drift"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-gitops": {
    "category": "CI/CD",
    "difficulty": "Junior DevOps",
    "question": "What is GitOps?",
    "shortAnswer": "GitOps uses Git as the single source of truth for infrastructure and application desired state, with an agent continuously reconciling live state to match it.",
    "detailedAnswer": "Every change goes through Git (a PR, reviewed and merged), and a reconciliation agent (ArgoCD, Flux) continuously ensures the live system matches what's declared, rather than operators running imperative commands directly against production — this makes every change reviewable, auditable, and revertible through normal Git history.",
    "beginnerExplanation": "Instead of someone running commands to change a live system, they change a file in Git, and an automated agent notices the change and applies it — so Git's history is always an accurate record of what's actually running.",
    "professionalExplanation": "The declarative and continuously-reconciled nature is what distinguishes GitOps from just 'storing YAML in Git' — a GitOps agent doesn't just apply on merge, it continuously corrects any drift between live state and Git, which is a meaningfully stronger guarantee than a one-time CI-triggered apply.",
    "realWorldExample": "A Helm values change merged to main can trigger ArgoCD or Flux to deploy the update automatically, without anyone running a manual kubectl or helm command — and if someone later makes a manual change directly in the cluster, the agent reconciles it back to match Git.",
    "commands": [
      "flux get kustomizations",
      "argocd app sync myapp",
      "git log -- k8s/manifests/"
    ],
    "followUpQuestions": [
      "What's the difference between GitOps and simply storing your YAML manifests in Git?",
      "How does continuous reconciliation differ from a one-time CI-triggered deploy?"
    ],
    "commonMistakes": [
      "Conflating 'storing config in Git' with GitOps, missing the continuous-reconciliation piece",
      "Making manual out-of-band cluster changes that the GitOps agent then silently reverts, causing confusion"
    ],
    "interviewTip": "Emphasize continuous reconciliation (not just triggering on merge) as the defining trait — that distinction is what separates a real GitOps understanding from a surface one.",
    "requiredKeywords": [
      "declarative",
      "git",
      "reconciliation"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-ansible-100-servers": {
    "category": "Ansible",
    "difficulty": "Mid-level DevOps",
    "question": "How would you deploy an application to 100 servers using Ansible?",
    "shortAnswer": "Define the inventory, write an idempotent playbook, deploy in rolling batches using serial, and stop on failed health checks.",
    "detailedAnswer": "serial: 10 (or a percentage) updates 10 servers at a time instead of all 100 simultaneously, limiting blast radius if the deploy is bad; combining that with a health-check task and max_fail_percentage means the play halts automatically if too many hosts in a batch fail, rather than continuing to roll a broken deploy across the entire fleet.",
    "beginnerExplanation": "Instead of updating all 100 servers at once (risky if something's wrong), you update them in smaller batches — say 10 at a time — and check each batch is healthy before moving to the next.",
    "professionalExplanation": "max_fail_percentage is the safety mechanism that turns 'rolling deploy' into 'rolling deploy with an automatic circuit breaker' — without it, a bad deploy could still roll through all 10 batches before anyone notices, just more slowly than an all-at-once deploy.",
    "realWorldExample": "serial: 10 with a health-check task after the deploy task, combined with max_fail_percentage: 20, halts the play automatically if more than 2 of a batch of 10 servers fail their health check, preventing the bad rollout from reaching the remaining 90.",
    "commands": [
      "ansible-playbook deploy.yml -i inventory.ini",
      "ansible-playbook deploy.yml --limit batch1",
      "ansible all -m ping -i inventory.ini"
    ],
    "followUpQuestions": [
      "What does max_fail_percentage actually do, and why pair it with serial?",
      "How would you choose the batch size for serial on a 100-server fleet?"
    ],
    "commonMistakes": [
      "Deploying to all 100 servers simultaneously instead of in rolling batches, maximizing blast radius of a bad deploy",
      "Using serial without a max_fail_percentage safety threshold, so a bad deploy still eventually reaches every host"
    ],
    "interviewTip": "Name max_fail_percentage specifically alongside serial — serial alone is the obvious half of this answer, the failure threshold is what shows deeper Ansible fluency.",
    "requiredKeywords": [
      "inventory",
      "serial",
      "health check"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "pdf-docker-exits": {
    "category": "Docker",
    "difficulty": "Junior DevOps",
    "question": "A Docker container stops immediately after starting. How do you troubleshoot?",
    "shortAnswer": "Check docker ps -a for the exit code, docker logs for output, and whether CMD/ENTRYPOINT actually keeps a foreground process running.",
    "detailedAnswer": "Exit code 0 with no useful logs often means the container's main process wasn't actually a long-running foreground process (a service-start command that backgrounds and returns); non-zero codes point to an application error visible in logs; required environment variables missing or a permissions issue on a mounted volume are the other common causes.",
    "beginnerExplanation": "docker ps -a shows the exit code, docker logs shows what it printed, and if both look clean but it still exits, the container's main command probably isn't something meant to keep running in the foreground.",
    "professionalExplanation": "Overriding the entrypoint with docker run -it --entrypoint /bin/sh IMAGE to get an interactive shell inside the image (without running its normal startup command) is the fastest way to check whether required files, environment variables, or permissions are actually correct, when logs alone aren't revealing enough.",
    "realWorldExample": "A container built with CMD [\"service\", \"nginx\", \"start\"] exits immediately with code 0 because that command starts nginx as a background daemon and then returns — Docker sees the foreground process end and stops the container; the fix is nginx -g 'daemon off;' as the actual foreground CMD.",
    "commands": [
      "docker ps -a",
      "docker logs CONTAINER",
      "docker run -it --entrypoint /bin/sh myimage"
    ],
    "followUpQuestions": [
      "Why would a container exit 0 immediately even though the service it started is technically still 'running' in the background?",
      "How would you inspect a container's filesystem and environment before its main process even starts?"
    ],
    "commonMistakes": [
      "Not recognizing that a background-starting CMD causes an immediate clean exit that looks like a crash",
      "Debugging only via logs without trying an interactive shell override to inspect the image directly"
    ],
    "interviewTip": "Give the foreground-process explanation specifically — it's the single most common real-world cause of this exact question and shows hands-on Dockerfile debugging.",
    "requiredKeywords": [
      "logs",
      "entrypoint",
      "exit code"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "pdf-oomkilled-sequence": {
    "category": "Kubernetes",
    "difficulty": "Advanced",
    "question": "Explain the sequence of events when a pod gets OOMKilled in Kubernetes.",
    "shortAnswer": "The container exceeds its memory limit, the Linux kernel's oomkiller terminates it, kubelet records exit 137/OOMKilled, and restartPolicy decides whether it restarts.",
    "detailedAnswer": "cgroup memory limits enforce the container's memory.limit; when exceeded, the kernel's OOM killer sends SIGKILL to the offending process (not a graceful SIGTERM); kubelet observes the container exited and reports status reason OOMKilled with exit code 137 (128+9 for SIGKILL); with the default restartPolicy: Always, kubelet restarts it on the same Pod/node with exponential backoff.",
    "beginnerExplanation": "When a container uses more memory than its limit allows, the kernel forcibly kills it (not a gentle shutdown), Kubernetes records that as 'OOMKilled', and by default the container gets automatically restarted — but if it keeps happening, the restarts get spaced further apart each time.",
    "professionalExplanation": "It's important to distinguish this container-level OOMKill (bounded by the container's own limit, restarted in place) from node-level memory pressure eviction, where the node itself is critically low on memory and the kubelet evicts entire lower-priority Pods to protect node stability — completely different trigger, completely different remediation (raise the container's limit versus address node capacity or Pod priority).",
    "realWorldExample": "A Java service with a memory limit set too low for its actual heap usage under load gets OOMKilled repeatedly during peak traffic — kubectl describe pod shows 'Last State: Terminated, Reason: OOMKilled, Exit Code: 137', and the fix is raising the limit or reducing the JVM's heap footprint, not treating it as an application bug.",
    "commands": [
      "kubectl describe pod POD_NAME",
      "kubectl top pod POD_NAME",
      "kubectl get events --field-selector reason=OOMKilling"
    ],
    "followUpQuestions": [
      "How is a container-level OOMKill different from node-level memory pressure eviction?",
      "How would you determine the right memory limit for a service that's being OOMKilled?"
    ],
    "commonMistakes": [
      "Treating repeated OOMKilled restarts as an application bug instead of a memory limit/usage mismatch",
      "Confusing container-level OOMKill with node-level eviction, which need completely different fixes"
    ],
    "interviewTip": "Give the exact exit code (137) and explain what it decodes to (128+SIGKILL) — that level of specificity is what separates a strong answer from a vague one here.",
    "requiredKeywords": [
      "oomkiller",
      "exit 137",
      "restartPolicy"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-prod-permission-denied": {
    "category": "Troubleshooting",
    "difficulty": "Advanced",
    "question": "The same Docker image works in staging but fails in production with permission denied. How do you debug it?",
    "shortAnswer": "Verify it's genuinely the same image digest, then compare the container's runtime uid, mounted volumes, Kubernetes securityContext, and admission-policy permissions between the two environments.",
    "detailedAnswer": "Confirm the exact same image digest (not just tag) is running in both places first, since 'the same image' by tag can actually differ; if confirmed identical, the difference is almost always environmental — a stricter securityContext or Pod Security Admission policy in production enforcing runAsNonRoot or a read-only root filesystem that staging doesn't, or a volume mount with different ownership.",
    "beginnerExplanation": "First make sure it's actually the exact same image (not just the same tag, which can point to different builds) — then compare the settings around it: what user it runs as, what's mounted, and whether production has stricter security rules than staging.",
    "professionalExplanation": "Most staging-vs-production permission bugs come from policy differences, not the image itself — production environments often enforce stricter Pod Security Standards or OPA/Gatekeeper policies (like requiring a non-root user or read-only filesystem) that staging doesn't, causing an image that writes to a path assuming root access to fail only in the more tightly locked-down environment.",
    "realWorldExample": "An image that writes a cache file to /app/cache works fine in staging (no security context restrictions) but fails with permission denied in production, where a Pod Security Admission policy enforces readOnlyRootFilesystem: true — the fix is either mounting a writable emptyDir at that path or changing the app to not need write access there.",
    "commands": [
      "docker inspect myapp:latest --format '{{.RepoDigests}}'",
      "kubectl get pod POD_NAME -o jsonpath='{.spec.securityContext}'",
      "kubectl get pod POD_NAME -n prod -o yaml | diff - <(kubectl get pod POD_NAME -n staging -o yaml)"
    ],
    "followUpQuestions": [
      "Why might 'the same image tag' not actually mean the same image?",
      "How would Pod Security Admission policies differ between staging and production in a well-run cluster?"
    ],
    "commonMistakes": [
      "Assuming the image itself must be different without first confirming the exact digest running in each environment",
      "Not checking for stricter production-only security policies (Pod Security Standards, OPA/Gatekeeper) as the actual cause"
    ],
    "interviewTip": "Bring up image digest versus tag as the very first verification step — it's a subtle but important distinction that shows rigor before jumping to environment-diffing.",
    "requiredKeywords": [
      "securityContext",
      "uid",
      "permissions"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "pdf-k8s-dns-cross-ns": {
    "category": "Kubernetes",
    "difficulty": "Advanced",
    "question": "How does Kubernetes DNS resolution work across namespaces, and what failure modes matter?",
    "shortAnswer": "Pods resolve Services via CoreDNS using search domains; cross-namespace calls need the full FQDN, service.namespace.svc.cluster.local, or they won't resolve by short name.",
    "detailedAnswer": "A Pod's short name lookup (backend) only resolves within its own namespace due to the search domain ordering in /etc/resolv.conf; reaching a Service in a different namespace requires the qualified name backend.other-ns.svc.cluster.local. Failure modes include CoreDNS itself being unhealthy or overloaded, a NetworkPolicy blocking UDP/TCP port 53 to kube-system, high ndots settings causing unnecessary extra lookup attempts, and the classic empty-endpoints Service problem manifesting as a DNS resolution that succeeds but connection that fails.",
    "beginnerExplanation": "Inside the cluster, calling a Service by its short name only works if you're in the same namespace as that Service — to reach one in a different namespace, you need to use its full name including the namespace.",
    "professionalExplanation": "ndots:5 (Kubernetes' default) means any name with fewer than 5 dots gets multiple search-domain-appended lookup attempts before falling back to the literal name — this adds real latency to external DNS lookups from inside a Pod and is a known, specific performance gotcha worth mentioning at the advanced level.",
    "realWorldExample": "A Pod in namespace frontend calling http://backend:5000 works when backend is also in frontend, but silently fails to resolve if backend actually lives in namespace api — the fix is calling http://backend.api.svc.cluster.local:5000 or using a Service in the same namespace acting as an alias.",
    "commands": [
      "kubectl exec POD -- nslookup backend.api.svc.cluster.local",
      "kubectl get endpoints backend -n api",
      "kubectl logs -n kube-system -l k8s-app=kube-dns"
    ],
    "followUpQuestions": [
      "What does the ndots setting affect, and why does it matter for performance?",
      "How would a NetworkPolicy accidentally break DNS resolution?"
    ],
    "commonMistakes": [
      "Using a Service's short name across namespaces and assuming it should resolve the same way it does within one namespace",
      "Not considering ndots-related latency when debugging external DNS lookup slowness from inside a Pod"
    ],
    "interviewTip": "Mention ndots specifically — it's a genuinely advanced detail that most candidates miss, and bringing it up unprompted signals real depth on this topic.",
    "requiredKeywords": [
      "coredns",
      "fqdn",
      "networkpolicy"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-terraform-lock": {
    "category": "Terraform",
    "difficulty": "Advanced",
    "question": "A terraform apply has a state lock that never releases. How do you safely recover?",
    "shortAnswer": "Confirm no apply is genuinely still running, take a backup of the state, inspect the lock details, then use terraform force-unlock with the exact lock ID.",
    "detailedAnswer": "A stuck lock usually means a previous apply crashed or was killed mid-run without releasing it — before force-unlocking, verify via CI logs or with the team that no apply is genuinely still in progress, since force-unlocking a lock that's actually held by a real in-flight apply can cause state corruption, exactly what locking exists to prevent.",
    "beginnerExplanation": "A lock is Terraform's way of making sure only one apply runs at a time; if it gets stuck (usually because a previous run crashed), you can manually release it with force-unlock, but only after making sure nothing is actually still running.",
    "professionalExplanation": "For an S3+DynamoDB backend specifically, never manually delete the DynamoDB lock item directly as a shortcut — always use terraform force-unlock LOCK_ID, since that's the safe, intended interface and manual table edits risk leaving the lock table in an inconsistent state.",
    "realWorldExample": "A CI runner that got killed (timeout or OOM) mid-apply leaves a stale DynamoDB lock item; after confirming via CI logs that no other apply is actually running, terraform force-unlock LOCK_ID (using the lock ID Terraform reports in its error) safely clears it, followed by a terraform plan to confirm state is still consistent before any further apply.",
    "commands": [
      "terraform force-unlock LOCK_ID",
      "terraform plan",
      "aws dynamodb get-item --table-name terraform-locks --key '{\"LockID\":{\"S\":\"...\"}}'"
    ],
    "followUpQuestions": [
      "How would you confirm no apply is genuinely still running before force-unlocking?",
      "Why is manually deleting the DynamoDB lock item directly risky compared to using force-unlock?"
    ],
    "commonMistakes": [
      "Force-unlocking immediately without confirming no other apply is actually still in progress",
      "Manually editing the DynamoDB lock table directly instead of using the terraform force-unlock command"
    ],
    "interviewTip": "Emphasize the verification step before force-unlock, not just the command itself — that's exactly what separates a safe recovery from a risky one.",
    "requiredKeywords": [
      "force-unlock",
      "backup",
      "plan"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "pdf-observability-stack": {
    "category": "Troubleshooting",
    "difficulty": "Advanced",
    "question": "Differentiate metrics, logs, and traces, then design an observability stack for high traffic microservices.",
    "shortAnswer": "Metrics are numeric time series for dashboards/alerts, logs are discrete event records for context, traces show a request's path across services — a stack needs all three correlated.",
    "detailedAnswer": "Prometheus/Grafana for metrics (cheap to store, great for alerting on trends), Loki or the ELK stack for logs (rich context, more expensive to store at scale), and OpenTelemetry with trace sampling for distributed tracing (shows exactly where latency accumulates across service boundaries) — at high request volume, sampling traces and alerting on SLO burn rate rather than storing everything raw is what keeps the stack both useful and affordable.",
    "beginnerExplanation": "Metrics tell you something is wrong (error rate spiked), logs tell you what happened in detail, and traces show you the exact path one request took across all the services it touched — you generally need all three together to fully debug a distributed system issue.",
    "professionalExplanation": "The design decision that actually matters at high traffic volume is what NOT to store at full fidelity — 100% trace sampling becomes prohibitively expensive and slow at scale, so tail-based or probabilistic sampling (keeping all traces for errors/slow requests, sampling a small percentage of normal ones) is the standard tradeoff between cost and debuggability.",
    "realWorldExample": "An SLO-burn-rate alert on the error-rate metric pages on-call, the correlated trace ID in that time window shows exactly which downstream service call was slow, and the logs for that specific trace ID give the full error context — three tools, one incident, correlated by timestamp and trace ID.",
    "commands": [
      "kubectl port-forward svc/grafana 3000:3000",
      "curl -s http://localhost:9090/api/v1/query?query=up",
      "kubectl logs -l app=myservice --since=5m"
    ],
    "followUpQuestions": [
      "How would you decide a trace sampling rate for a high-traffic service without losing debuggability?",
      "How do you correlate a metric alert with the relevant logs and traces during an incident?"
    ],
    "commonMistakes": [
      "Trying to store 100% of traces at high volume, making the tracing backend prohibitively expensive or slow",
      "Not correlating metrics, logs, and traces by a shared identifier (trace ID, timestamp), forcing manual cross-referencing during an incident"
    ],
    "interviewTip": "Mention tail-based/error-biased sampling specifically as the volume-cost tradeoff — that's the concrete architectural decision interviewers want to hear at the advanced level.",
    "requiredKeywords": [
      "metrics",
      "logs",
      "traces"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-secret-committed": {
    "category": "Troubleshooting",
    "difficulty": "Advanced",
    "question": "A secret was committed to a public GitHub repository. What is your incident response?",
    "shortAnswer": "Assume compromise immediately, rotate/revoke the secret first, then review audit logs, remove it from history, and move to a proper secrets manager.",
    "detailedAnswer": "Rotation is the priority action, not history rewriting — the exposed secret must be treated as compromised the moment it's public, since it could have been scraped by a bot within minutes; only after rotating do you review audit/access logs for signs of misuse, purge the secret from Git history (git filter-repo or BFG), and notify security per your incident process.",
    "beginnerExplanation": "The very first thing to do is change/revoke the leaked credential itself — cleaning up the Git history comes after, because the secret was already visible to anyone (or anything) that saw the public repo before you noticed.",
    "professionalExplanation": "This is a case where the instinct to 'clean up the mistake first' (rewrite history) is actually the wrong priority order — history rewriting does nothing to protect a secret that's already been scraped, and delaying rotation to 'fix it properly first' extends the compromise window unnecessarily.",
    "realWorldExample": "A committed AWS access key found in a public repo should be deactivated in IAM within minutes of discovery, before any git history cleanup begins — enabling secret scanning (GitHub secret scanning, gitleaks in pre-commit) afterward prevents recurrence going forward.",
    "commands": [
      "aws iam update-access-key --access-key-id AKIA... --status Inactive",
      "git filter-repo --path secrets.env --invert-paths",
      "gitleaks detect --source ."
    ],
    "followUpQuestions": [
      "Why is rotating the secret a higher priority than removing it from Git history?",
      "What would you put in place to prevent this from happening again?"
    ],
    "commonMistakes": [
      "Prioritizing history cleanup over immediate secret rotation, extending the actual compromise window",
      "Not enabling secret scanning going forward, treating this as a one-off incident instead of a systemic gap"
    ],
    "interviewTip": "State the priority order explicitly and defend it — 'rotate first, history cleanup second' with the reasoning is exactly the judgment call this question is testing.",
    "requiredKeywords": [
      "rotate",
      "audit logs",
      "secret scanning"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-hpa-internals": {
    "category": "Kubernetes",
    "difficulty": "Advanced",
    "question": "How does Horizontal Pod Autoscaler work internally?",
    "shortAnswer": "HPA periodically reads metrics, computes desired replicas from current versus target values, applies stabilization to avoid flapping, and patches the workload's replica count.",
    "detailedAnswer": "Every sync period (default 15s), HPA queries the metrics API (resource metrics or custom/external metrics) for the current value, computes desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric), applies stabilization windows to prevent rapid scale up/down flapping, then patches the Deployment/ReplicaSet's replica count — the actual Pod creation is then handled normally by the Deployment controller and scheduler, HPA itself never creates Pods directly.",
    "beginnerExplanation": "HPA checks a metric (like CPU usage) periodically, does a calculation to figure out how many replicas would bring that metric back to target, and updates the Deployment's replica count — then Kubernetes' normal Deployment machinery creates or removes Pods to match.",
    "professionalExplanation": "HPA scales pod replica count; it's the Cluster Autoscaler that separately watches for Pods stuck Pending due to insufficient node capacity and adds nodes — the two work together but solve different layers, and confusing them (assuming HPA also adds nodes) is a common gap in understanding autoscaling end to end.",
    "realWorldExample": "During a traffic spike, HPA scales a Deployment from 3 to 10 replicas based on CPU; if the cluster's existing nodes don't have room for those extra 7 Pods, they sit Pending until Cluster Autoscaler separately notices and provisions new nodes — two independent controllers, one outcome.",
    "commands": [
      "kubectl get hpa",
      "kubectl describe hpa myapp-hpa",
      "kubectl top pods"
    ],
    "followUpQuestions": [
      "What's the difference between HPA and Cluster Autoscaler, and how do they interact?",
      "Why does HPA use a stabilization window, and what problem does it prevent?"
    ],
    "commonMistakes": [
      "Assuming HPA also provisions new nodes when it's actually only adjusting Pod replica count",
      "Not understanding stabilization windows, leading to confusion about why HPA doesn't scale down immediately after a metric drops"
    ],
    "interviewTip": "Clearly separate HPA (pod replicas) from Cluster Autoscaler (node capacity) — this is one of the most commonly conflated pairs in Kubernetes autoscaling questions.",
    "requiredKeywords": [
      "metrics api",
      "replicas",
      "stabilization"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-error-budget": {
    "category": "DevOps fundamentals",
    "difficulty": "Advanced",
    "question": "Define error budget, burn rate, and multi-window alerting for a 99.9% SLO.",
    "shortAnswer": "Error budget is the allowed unreliability (0.1% for a 99.9% SLO); burn rate is how fast it's being consumed; multi-window alerting combines short and long windows to catch fast incidents without false-paging on noise.",
    "detailedAnswer": "A 99.9% SLO over 30 days allows about 43 minutes of downtime — that's the error budget. Burn rate expresses consumption speed (a 10x burn rate exhausts a 30-day budget in 3 days); multi-window alerting pages immediately on a short window showing a severe burn rate (fast, serious incident) while requiring a longer window's sustained elevated rate for lower-severity tickets, avoiding both missed fast incidents and false pages from brief blips.",
    "beginnerExplanation": "If your target is 99.9% uptime, you're allowed a small amount of downtime each month — that's your error budget. Burn rate is how quickly you're using it up, and multi-window alerting checks both short and long time windows so you catch real problems fast without getting paged for tiny, harmless blips.",
    "professionalExplanation": "The Google SRE approach specifically combines a short window (5-60 min) requiring a very high burn rate to page immediately, with a longer window (6h) requiring a moderate sustained burn rate for a lower-urgency ticket — this two-window design is what balances fast detection of severe incidents against avoiding alert fatigue from noise, and it's worth naming as a deliberate design pattern, not an accident.",
    "realWorldExample": "A page-now alert fires on a 1-hour window showing a burn rate that would exhaust the entire monthly budget in under a day, while a lower-priority ticket-level alert fires on a 6-hour window showing a more modest but still concerning sustained burn rate — different urgency, different response expectation.",
    "commands": [
      "curl -s http://localhost:9090/api/v1/query?query=slo:error_budget:remaining",
      "kubectl get prometheusrules",
      "amtool alert query"
    ],
    "followUpQuestions": [
      "Why use two different time windows instead of one for burn-rate alerting?",
      "How would you calculate the exact downtime allowed by a 99.9% SLO over 30 days?"
    ],
    "commonMistakes": [
      "Alerting on a single window, causing either missed fast incidents or excessive false pages from noise",
      "Not connecting error budget consumption to an actual policy decision (like freezing risky deploys when budget is nearly exhausted)"
    ],
    "interviewTip": "Do the actual math (99.9% = ~43 min/month) out loud — showing you can derive the number, not just recite the term, is what distinguishes a strong SRE-minded answer.",
    "requiredKeywords": [
      "slo",
      "burn rate",
      "alert"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-periodic-latency": {
    "category": "Troubleshooting",
    "difficulty": "Advanced",
    "question": "A microservice has 500ms latency spikes every 60 seconds. How do you diagnose it?",
    "shortAnswer": "A fixed period this precise points at a timer — correlate the spikes against scheduled behavior (probes, cron, GC, connection pool reaping) before touching application code.",
    "detailedAnswer": "Exactly-60-second periodicity is too regular to be random load — check for a health/liveness probe interval, a cron-scheduled job, garbage collection pauses, a connection pool's idle-connection reaping interval, DNS TTL expiry triggering re-resolution, or a leader-election heartbeat, and correlate their configured intervals against the spike timing before assuming it's an application code issue.",
    "beginnerExplanation": "A spike happening at an exact, regular interval like every 60 seconds is a strong clue that something scheduled is causing it — not random bad luck — so you look for anything in the system configured to run every 60 seconds before digging into the application logic itself.",
    "professionalExplanation": "Distributed tracing around the exact spike windows is what actually confirms the correlation rather than just a plausible guess — pulling traces from a spike moment and comparing against a normal moment shows exactly which downstream call or internal operation is adding the 500ms, turning a hypothesis into a confirmed diagnosis.",
    "realWorldExample": "A connection pool configured to reap idle connections every 60 seconds was closing and re-establishing a database connection right as a request needed it, adding exactly the observed 500ms — found by correlating the pool's reap interval config against the spike timestamps, then confirmed via traces showing the connection-acquisition step as the added latency.",
    "commands": [
      "kubectl logs -l app=myservice --since=2m | grep -E '^.{0,20}(GC|pool|health)'",
      "curl -s http://localhost:9090/api/v1/query_range?query=http_request_duration_seconds",
      "kubectl get cronjobs"
    ],
    "followUpQuestions": [
      "What specific scheduled behaviors would you check for a 60-second periodic pattern?",
      "How would distributed tracing help confirm the root cause versus just correlating timestamps?"
    ],
    "commonMistakes": [
      "Investigating application code logic first instead of checking for scheduled/periodic behavior matching the exact interval",
      "Only correlating timestamps without pulling actual traces to confirm which specific operation adds the latency"
    ],
    "interviewTip": "Lead with 'the exact periodicity is the clue' — recognizing that a precise, regular interval implies something scheduled (not random load) is the key insight this question is testing.",
    "requiredKeywords": [
      "periodicity",
      "tracing",
      "connection pool"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-push-pull-cd": {
    "category": "CI/CD",
    "difficulty": "Advanced",
    "question": "What is the difference between push-based and pull-based CD?",
    "shortAnswer": "Push CD has CI write changes directly into the cluster; pull CD (the GitOps model) uses an in-cluster agent such as ArgoCD or Flux that reconciles from Git on its own, improving credential safety and drift detection.",
    "detailedAnswer": "Push-based means CI holds cluster-write credentials and runs kubectl/helm commands against it directly; pull-based means no external system holds those credentials at all — the in-cluster agent pulls the desired state and applies it locally, and because it continuously reconciles (not just on trigger), it also naturally surfaces and can correct configuration drift.",
    "beginnerExplanation": "Push CD means your CI pipeline reaches out and changes the cluster; pull CD means an agent living inside the cluster reaches out to Git and pulls changes in — the pull model means CI never needs broad access to your production cluster at all.",
    "professionalExplanation": "Sync waves, sync windows, and pre/post-sync hooks (ArgoCD-specific mechanisms) exist specifically to prevent 'deployment storms' — many services all updating simultaneously when a shared config change syncs — by controlling ordering and timing of the reconciliation, a nuance worth naming to show real production ArgoCD/Flux experience beyond the conceptual push-vs-pull distinction.",
    "realWorldExample": "A push-based Jenkins pipeline running kubectl apply directly needs a cluster-admin-scoped credential stored in Jenkins; a pull-based ArgoCD setup needs no external credential at all — ArgoCD itself, running inside the cluster with its own RBAC-scoped service account, does the applying.",
    "commands": [
      "argocd app sync myapp",
      "kubectl apply -f manifests/",
      "argocd app history myapp"
    ],
    "followUpQuestions": [
      "What specifically do sync waves and hooks prevent in a pull-based system?",
      "Why does pull-based CD improve credential security compared to push-based?"
    ],
    "commonMistakes": [
      "Storing broad cluster-admin credentials in an external CI system for push-based deploys instead of scoping them tightly",
      "Not considering deployment-storm risk when many services could reconcile simultaneously in a pull-based system"
    ],
    "interviewTip": "Name sync waves/hooks specifically if you've used ArgoCD — it shows production experience beyond just explaining the push-vs-pull concept.",
    "requiredKeywords": [
      "push",
      "pull",
      "gitops"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-dockerfile-security-size": {
    "category": "Docker",
    "difficulty": "Advanced",
    "question": "Describe Dockerfile practices that improve security and image size.",
    "shortAnswer": "Multi-stage builds, non-root users, pinned base image digests, no secrets in ARG/ENV, a thorough .dockerignore, minimal layers, and image scanning in CI.",
    "detailedAnswer": "Multi-stage builds and a minimal final base (alpine/distroless) cut size by excluding build tooling; running as a non-root USER and pinning the base image by digest (not just a mutable tag) reduce attack surface and improve reproducibility; secrets must never pass through ARG/ENV (they're visible via docker history/inspect) — use build secrets (--secret) or runtime injection instead; scanning the final image in CI (Trivy, Grype) catches known CVEs before it ships.",
    "beginnerExplanation": "Keep the final image small (multi-stage builds, small base image), don't run as root, never put passwords in build arguments or environment variables (they're easy to find later), avoid unnecessary files with .dockerignore, and scan the finished image for known vulnerabilities before shipping it.",
    "professionalExplanation": "The final image should contain only runtime artifacts — no compilers, package manager caches, .git directory, or secrets — verified by actually inspecting docker history and running a scanner in CI as a required gate, not just trusting that the Dockerfile 'looks clean'.",
    "realWorldExample": "A Dockerfile passing a database password via ARG DB_PASSWORD leaves it visible forever in docker history myimage, discoverable by anyone who can pull the image — the fix is a runtime-injected secret (Kubernetes Secret, or Docker BuildKit's --secret flag which never persists it in a layer).",
    "commands": [
      "docker build --secret id=dbpass,src=./dbpass.txt -t myapp .",
      "docker history myapp:latest",
      "trivy image myapp:latest"
    ],
    "followUpQuestions": [
      "Why is ARG/ENV unsafe for secrets even if you don't COPY them into the final stage?",
      "What's the difference between pinning a base image by tag versus by digest?"
    ],
    "commonMistakes": [
      "Passing secrets through ARG or ENV, leaving them permanently visible in the image's layer history",
      "Not scanning the final image for known CVEs before it ships to a registry"
    ],
    "interviewTip": "Explain specifically why ARG/ENV leaks secrets (visible via docker history even without a COPY) — it's the exact mechanism, not just the general 'don't do it' rule.",
    "requiredKeywords": [
      "multi-stage",
      "non-root",
      "dockerignore"
    ],
    "relatedModule": "Docker",
    "reviewStatus": "reviewed"
  },
  "pdf-platform-engineering": {
    "category": "DevOps fundamentals",
    "difficulty": "Advanced",
    "question": "What is Platform Engineering and how does it differ from traditional DevOps?",
    "shortAnswer": "Platform Engineering treats internal infrastructure as a product — an Internal Developer Platform (IDP) provides self-service golden paths, reducing the cognitive load DevOps originally pushed onto every application team.",
    "detailedAnswer": "Early DevOps culture often meant 'every team owns their own infrastructure and pipelines,' which at scale led to significant duplicated effort and cognitive overload; Platform Engineering centralizes that complexity behind a self-service platform (templates, paved-road CI/CD, standardized observability) so application teams get a golden path without needing deep infrastructure expertise themselves.",
    "beginnerExplanation": "Instead of every team figuring out their own way to deploy, monitor, and manage infrastructure, a platform team builds one well-designed, self-service system that every other team just uses — like an internal product with its own users (the other engineering teams).",
    "professionalExplanation": "The measure of a good platform is adoption without a mandate — if the golden path is genuinely easier than the alternative, teams choose it voluntarily; if platform adoption requires policy enforcement, that's usually a signal the platform isn't actually reducing friction for its users the way a real product would need to.",
    "realWorldExample": "A platform team providing a templated 'new service' scaffold that comes with CI/CD, standard observability, and security scanning already wired in reduces the ticket volume for infrastructure questions by making the self-service golden path easier than asking for manual help.",
    "commands": [
      "backstage-cli create component",
      "kubectl apply -f platform/templates/service.yaml",
      "argocd app list"
    ],
    "followUpQuestions": [
      "How would you measure whether a platform is actually succeeding, beyond just being built?",
      "What's the risk of a platform team building something teams don't actually want to use?"
    ],
    "commonMistakes": [
      "Building a platform without validating it against what application teams actually need, leading to low voluntary adoption",
      "Confusing Platform Engineering with simply renaming an existing infrastructure/ops team without changing the self-service model"
    ],
    "interviewTip": "Bring up adoption-without-mandate as the success signal — it reframes platform engineering as a product discipline, which is exactly the mindset shift interviewers are probing for.",
    "requiredKeywords": [
      "idp",
      "self-service",
      "golden path"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-terraform-large-scale": {
    "category": "Terraform",
    "difficulty": "Mid-level DevOps",
    "question": "How do you structure Terraform code for large-scale cloud infrastructure?",
    "shortAnswer": "Reusable modules, environment separation with independent remote state, per-environment tfvars, CI checks (fmt/validate/scan), consistent tagging, and no hardcoded secrets.",
    "detailedAnswer": "Shared modules define the actual resource patterns once; each environment (dev/staging/prod) lives in its own directory with its own state backend so a mistake in one can never touch another; CI runs terraform fmt -check, terraform validate, and a security scanner (tfsec/checkov) on every PR before any apply is allowed; consistent tagging (Environment, Owner, ManagedBy) makes cost attribution and cleanup tractable at scale.",
    "beginnerExplanation": "Write the actual infrastructure patterns once as reusable modules, keep each environment's real deployment in its own folder with its own separate state so mistakes don't cross over, and run automated checks (formatting, validation, security scanning) on every change before it's allowed to apply.",
    "professionalExplanation": "At real scale, the CI gate matters as much as the code structure — tfsec/checkov catching a public S3 bucket or an overly permissive security group in a PR review, before apply, is what prevents a whole category of security misconfigurations from ever reaching real infrastructure.",
    "realWorldExample": "A structure with modules/vpc, modules/eks, environments/prod/main.tf (calling those modules with prod-specific tfvars and its own S3+DynamoDB backend), and a required CI check running tfsec on every pull request before merge is a practical, scale-tested layout many real organizations converge on.",
    "commands": [
      "terraform fmt -check -recursive",
      "tfsec .",
      "terraform validate"
    ],
    "followUpQuestions": [
      "What would you specifically check for with a security scanner like tfsec in CI?",
      "How does separating state per environment limit blast radius at scale?"
    ],
    "commonMistakes": [
      "Sharing one state file across environments at scale, letting a mistake in one environment risk another",
      "Skipping automated security scanning in CI, catching misconfigurations only after they're already live"
    ],
    "interviewTip": "Name a specific scanning tool (tfsec or checkov) and what class of issue it catches — concrete tooling knowledge lands better than describing 'best practices' abstractly.",
    "requiredKeywords": [
      "modules",
      "remote state",
      "tfvars"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "pdf-github-actions-e2e": {
    "category": "CI/CD",
    "difficulty": "Mid-level DevOps",
    "question": "Walk through a GitHub Actions CI/CD pipeline you built end to end.",
    "shortAnswer": "Trigger on push/PR, checkout, run tests, build and scan the image, push to a registry, then deploy through environment-gated jobs with Helm or kubectl.",
    "detailedAnswer": "on: push/pull_request triggers the workflow; actions/checkout pulls the code; a test job runs the suite; a build job builds and tags the image with the commit SHA, scans it, and pushes to a registry; separate deploy jobs target dev automatically and production behind a GitHub environment with required reviewers, running helm upgrade --install or kubectl set image against the pinned image tag.",
    "beginnerExplanation": "Every push triggers the workflow: checkout code, run tests, build the app into a versioned image, push it somewhere, then deploy it — with production requiring someone's approval before it actually happens.",
    "professionalExplanation": "GitHub Actions' 'environments' feature (protected environments with required reviewers and secrets scoped per environment) is what turns a linear pipeline into a properly gated one — production secrets aren't even accessible to a workflow run until it reaches the protected production environment job, which is a real security boundary, not just a manual click.",
    "realWorldExample": "A workflow with jobs test → build-and-push → deploy-dev (auto) → deploy-prod (requires two reviewers, uses a 'production' GitHub environment scoping its own AWS credentials separately from dev) demonstrates the full gated pipeline with measurable impact like reduced deploy time and fewer manual errors.",
    "commands": [
      "gh workflow run deploy.yml",
      "gh run watch",
      "kubectl set image deployment/web web=myapp:${GITHUB_SHA::7}"
    ],
    "followUpQuestions": [
      "How do GitHub Actions environments provide a real security boundary, not just a manual approval UI?",
      "How would you measure the impact of this pipeline compared to the previous manual process?"
    ],
    "commonMistakes": [
      "Using the same credentials/secrets across dev and prod jobs instead of scoping them per protected environment",
      "Not measuring or being able to quote the concrete improvement (deploy time, error rate) this pipeline delivered"
    ],
    "interviewTip": "Mention environment-scoped secrets specifically — it shows the pipeline isn't just automated, it's actually more secure than the manual process it replaced.",
    "requiredKeywords": [
      "build",
      "scan",
      "deploy"
    ],
    "relatedModule": "CI/CD",
    "reviewStatus": "reviewed"
  },
  "pdf-pipeline-secrets": {
    "category": "DevOps fundamentals",
    "difficulty": "Mid-level DevOps",
    "question": "How do you manage secrets and credentials in a cloud DevOps pipeline?",
    "shortAnswer": "Avoid static long-lived credentials entirely — use OIDC federation for CI-to-cloud auth, a cloud secrets manager for app secrets, and least privilege scoped roles throughout.",
    "detailedAnswer": "OIDC lets a CI system (GitHub Actions, GitLab CI) assume a cloud IAM role for the duration of a single job using a short-lived token, with no long-lived access key stored anywhere; application secrets live in a managed service (AWS Secrets Manager, Vault) fetched at runtime, not baked into config files or environment variables committed anywhere; every role/credential should be scoped to exactly what that specific job or service needs.",
    "beginnerExplanation": "Instead of storing a permanent password or access key somewhere that could leak, modern pipelines use short-lived, automatically-issued credentials (OIDC) that expire right after the job finishes, and application secrets are fetched from a dedicated secrets service at runtime instead of being stored in plain config.",
    "professionalExplanation": "The concrete, common improvement here is replacing a long-lived AWS access key stored as a GitHub Actions secret with GitHub's OIDC provider assuming an IAM role scoped to that specific repo and workflow — this eliminates an entire class of risk (a leaked long-lived key) since there's no persistent credential to leak in the first place.",
    "realWorldExample": "A GitHub Actions workflow using aws-actions/configure-aws-credentials with role-to-assume and OIDC gets a token valid only for that job's duration, scoped to only the IAM permissions that specific pipeline needs — replacing a static, broadly-scoped access key that previously sat in the repo's secrets indefinitely.",
    "commands": [
      "aws sts assume-role-with-web-identity",
      "aws secretsmanager get-secret-value --secret-id prod/db-password",
      "gh secret list"
    ],
    "followUpQuestions": [
      "Why is OIDC-based authentication safer than a stored long-lived access key?",
      "How would you scope an IAM role tightly for a specific CI workflow?"
    ],
    "commonMistakes": [
      "Storing long-lived cloud access keys as CI secrets instead of adopting OIDC federation",
      "Granting broad IAM permissions to a CI role instead of scoping it to exactly what that pipeline needs"
    ],
    "interviewTip": "Give the concrete OIDC-replaces-static-key example specifically — it's the single most common, most impactful real-world improvement in this space and shows hands-on migration experience.",
    "requiredKeywords": [
      "oidc",
      "secrets manager",
      "least privilege"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-python-automation": {
    "category": "DevOps fundamentals",
    "difficulty": "Junior DevOps",
    "question": "How do you write Python scripts for DevOps automation?",
    "shortAnswer": "Use Python with cloud SDKs (boto3 for AWS) for repeatable operational tasks like finding idle resources, reporting drift, or running scheduled cleanup jobs.",
    "detailedAnswer": "boto3 (or the equivalent SDK for other clouds) gives programmatic access to the same operations available in the console/CLI, which is what makes it useful for anything that needs to run on a schedule or react to an event rather than be triggered manually — a scheduled Lambda or cron job calling boto3 to find and flag idle resources is a common, practical starting example.",
    "beginnerExplanation": "Instead of manually checking the AWS console for problems like idle unused resources, a Python script using boto3 can check automatically on a schedule and report or fix them.",
    "professionalExplanation": "Idempotency and error handling matter as much in automation scripts as in Ansible playbooks — a script that partially completes and gets re-run should be safe to run again without duplicating actions or leaving things in a broken half-state, which is a discipline worth mentioning explicitly since it's easy to skip in a 'quick script'.",
    "realWorldExample": "A scheduled Lambda running a Python script with boto3 that lists EC2 instances with no CPU activity over 7 days and no Owner tag, then either stops them or posts a report to Slack for review, is a concrete example of automation that saves real, recurring cost.",
    "commands": [
      "python -m venv venv && pip install boto3",
      "aws lambda invoke --function-name idle-resource-check output.json",
      "python check_idle_resources.py --dry-run"
    ],
    "followUpQuestions": [
      "How would you make an automation script safe to re-run if it partially fails halfway through?",
      "Would you run this as a scheduled Lambda, a cron job, or something else, and why?"
    ],
    "commonMistakes": [
      "Writing automation scripts without considering what happens if they're re-run after a partial failure",
      "Hardcoding credentials in the script instead of relying on the execution environment's IAM role"
    ],
    "interviewTip": "Give a specific, concrete automation example (idle resource cleanup, drift reporting) rather than describing Python-for-DevOps abstractly — specificity is what makes this answer credible.",
    "requiredKeywords": [
      "sdk",
      "automation",
      "schedule"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-terraform-state-drift": {
    "category": "Terraform",
    "difficulty": "Mid-level DevOps",
    "question": "How do you handle Terraform state management and drift in production?",
    "shortAnswer": "Remote state with locking and versioning, regular plan runs in CI to detect drift, importing or codifying any manual changes, and never editing production directly through the console.",
    "detailedAnswer": "A scheduled CI job running terraform plan (without applying) against production on a regular cadence surfaces drift automatically rather than waiting to discover it during an actual change; any drift found should be either imported into Terraform (if it should stay) or removed (if it shouldn't), and console access to production resources should be restricted so the pipeline is genuinely the only path for change.",
    "beginnerExplanation": "Regularly run terraform plan against production (without applying) just to see if anything's changed outside of Terraform — if it has, either bring that change into your Terraform code properly or undo it, rather than letting Git and reality quietly diverge.",
    "professionalExplanation": "The structural fix, beyond process discipline, is restricting console/CLI write access to production resources for most engineers entirely — if the pipeline is the only path capable of making changes, drift becomes structurally much harder to introduce in the first place, rather than relying on everyone remembering to always go through Terraform.",
    "realWorldExample": "A security group rule added manually through the AWS console during an incident shows up as an unexpected change in the next scheduled terraform plan — the response is terraform import to codify it properly (if it should stay) rather than ignoring the drift indefinitely, which would leave Terraform blind to that rule's existence.",
    "commands": [
      "terraform plan -detailed-exitcode",
      "terraform import aws_security_group_rule.emergency_rule sg-123/...",
      "terraform state show aws_security_group.web"
    ],
    "followUpQuestions": [
      "How would a scheduled drift-detection job in CI actually work, and what would it do when it finds drift?",
      "What's a structural way to prevent drift beyond just detecting it after the fact?"
    ],
    "commonMistakes": [
      "Only checking for drift reactively during an incident instead of proactively on a schedule",
      "Leaving broad console write access open to production, making drift easy to introduce accidentally"
    ],
    "interviewTip": "Mention scheduled/automated drift detection specifically (not just manual periodic plan checks) — it shows you think about this as a continuous process, not a one-off audit.",
    "requiredKeywords": [
      "remote state",
      "locking",
      "plan"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "pdf-zero-downtime": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "How do you design a Kubernetes deployment strategy for zero-downtime releases?",
    "shortAnswer": "Rolling updates with maxUnavailable: 0 and solid readiness probes for routine changes; blue-green or canary (Argo Rollouts/Istio) for higher-risk releases.",
    "detailedAnswer": "maxUnavailable: 0 ensures old Pods aren't removed until new ones are ready, so capacity never drops during the rollout, while a properly tuned readiness probe ensures 'ready' actually means ready to serve traffic, not just that the process started; for riskier changes, canary (small percentage of traffic to the new version, monitored, then gradually increased) or blue-green (full parallel environment, instant cutover, instant rollback) provide stronger safety than a plain rolling update.",
    "beginnerExplanation": "A rolling update with maxUnavailable: 0 means Kubernetes never removes old working Pods until new ones are confirmed ready, so capacity never dips — for bigger or riskier changes, you send just a small slice of traffic to the new version first (canary) before fully switching over.",
    "professionalExplanation": "The distinction to draw for a mid-level answer is when a plain rolling update is enough versus when it isn't: a rolling update alone doesn't protect against a new version that's 'ready' by its probe but subtly broken in a way that only shows up under real traffic — that's exactly the gap canary deployments with automated metric-based promotion are designed to close.",
    "realWorldExample": "Argo Rollouts shifting 10% of traffic to a new version, monitoring the error-rate metric for 5 minutes, and only auto-promoting to 100% if SLOs stay healthy catches a subtly broken release that a plain rolling update (which only checks readiness, not real traffic behavior) would have rolled out fully.",
    "commands": [
      "kubectl rollout status deployment/web",
      "kubectl argo rollouts get rollout web",
      "kubectl argo rollouts promote web"
    ],
    "followUpQuestions": [
      "What specific risk does a canary deployment catch that a plain rolling update with maxUnavailable: 0 doesn't?",
      "How would you decide the traffic percentage and monitoring window for a canary stage?"
    ],
    "commonMistakes": [
      "Treating maxUnavailable: 0 alone as sufficient safety for a high-risk release that actually needs canary/blue-green",
      "Not tying canary promotion to actual health/SLO metrics, making it just a slower rollout with no real safety benefit"
    ],
    "interviewTip": "Explain what a canary catches that a rolling update doesn't (real-traffic behavior, not just probe health) — that's the actual reasoning behind choosing one strategy over the other.",
    "requiredKeywords": [
      "rolling update",
      "readiness",
      "canary"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-monitoring-k8s": {
    "category": "Troubleshooting",
    "difficulty": "Mid-level DevOps",
    "question": "How do you set up monitoring and alerting for a production Kubernetes cluster?",
    "shortAnswer": "Deploy kube-prometheus-stack, scrape application metrics via ServiceMonitors, route alerts through Alertmanager, and ship logs with Fluent Bit to a log store.",
    "detailedAnswer": "kube-prometheus-stack bundles Prometheus, Grafana, and Alertmanager with sensible cluster-level defaults out of the box; ServiceMonitor CRDs declare which application endpoints Prometheus should additionally scrape for app-specific metrics; Alertmanager routes alerts by severity/team to the right destination (PagerDuty for pages, Slack for lower-priority); Fluent Bit or a similar log shipper forwards container logs to Loki or an ELK stack for searchable log correlation.",
    "beginnerExplanation": "kube-prometheus-stack is a standard, batteries-included way to get metrics dashboards and alerting running on a cluster quickly; you then add ServiceMonitors for your own app's metrics, and a log shipper to send container logs somewhere searchable.",
    "professionalExplanation": "Alert severity routing (P1 pages someone immediately via PagerDuty, lower-priority alerts go to a Slack channel for review) is what prevents alert fatigue at scale — treating every alert as equally urgent trains engineers to ignore the pager, so designing the routing thoughtfully from the start matters as much as the metrics themselves.",
    "realWorldExample": "An Alertmanager route sending a 'pod crash-looping in production' alert to PagerDuty for immediate response, while a 'disk usage above 70%' alert routes to a Slack channel for next-business-day review, is exactly the kind of severity-based routing that keeps on-call sustainable.",
    "commands": [
      "helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack",
      "kubectl apply -f servicemonitor.yaml",
      "kubectl port-forward svc/alertmanager 9093:9093"
    ],
    "followUpQuestions": [
      "How would you decide what should page immediately versus go to a lower-priority channel?",
      "How does a ServiceMonitor actually tell Prometheus what to scrape?"
    ],
    "commonMistakes": [
      "Routing every alert with the same urgency, causing alert fatigue and eventually ignored pages",
      "Not adding application-specific ServiceMonitors, relying only on generic cluster-level metrics that miss real app health signals"
    ],
    "interviewTip": "Describe the severity-based routing design specifically (what pages versus what goes to Slack) — it shows operational maturity beyond just naming the tools.",
    "requiredKeywords": [
      "prometheus",
      "grafana",
      "alertmanager"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-ansible-experience": {
    "category": "Ansible",
    "difficulty": "Junior DevOps",
    "question": "Describe your experience with Ansible for configuration management.",
    "shortAnswer": "Discuss idempotent playbooks, reusable roles, templates, handlers, patching, and using inventory to manage many hosts consistently.",
    "detailedAnswer": "A good answer names a concrete example: a role (e.g. nginx) with tasks that install the package, a template for its config, and a handler that restarts it only when the config actually changes — demonstrating idempotency, role structure, and the notify/handler pattern together rather than describing each concept separately.",
    "beginnerExplanation": "Talk through a real example: I built a role that installs and configures nginx using a template for the config file, with a handler that restarts nginx only when that config actually changes.",
    "professionalExplanation": "At scale, the differentiator worth mentioning is how patching/updates get rolled out safely (serial batching, health checks between batches) and how inventory is managed (static versus dynamic for cloud environments) — those two details signal production experience beyond writing a single working playbook.",
    "realWorldExample": "An nginx role with tasks/main.yml running apt: name=nginx state=present, a templates/nginx.conf.j2 rendered via the template module, and handlers/main.yml with a 'restart nginx' handler notified only when the template task reports changed, is a concrete, complete example to walk through.",
    "commands": [
      "ansible-playbook site.yml -i inventory.ini",
      "ansible-galaxy init nginx-role",
      "ansible-playbook site.yml --check --diff"
    ],
    "followUpQuestions": [
      "How would you roll out a patch across 100 hosts safely using this same structure?",
      "How do you manage inventory for a cloud environment where hosts change frequently?"
    ],
    "commonMistakes": [
      "Giving a purely conceptual answer about Ansible features instead of walking through one concrete real example",
      "Not mentioning safe rollout practices (serial, health checks) when describing fleet-wide patching experience"
    ],
    "interviewTip": "Walk through one specific role you actually built, end to end, rather than listing Ansible features abstractly — concreteness is what this question is testing for.",
    "requiredKeywords": [
      "idempotent",
      "roles",
      "handlers"
    ],
    "relatedModule": "Ansible",
    "reviewStatus": "reviewed"
  },
  "pdf-iam-security": {
    "category": "DevOps fundamentals",
    "difficulty": "Mid-level DevOps",
    "question": "How do you design IAM and cloud security best practices?",
    "shortAnswer": "Least privilege via scoped roles, audit logging enabled everywhere, restricted networks, centralized secrets, and IaC security scanning in CI.",
    "detailedAnswer": "Every role/user gets only the specific permissions their function needs (not broad managed policies out of convenience), CloudTrail (or equivalent) logs every API call for audit, network access is restricted by security groups/NACLs to only what's required, secrets live in a central manager rather than scattered across config files, and CI runs tfsec/checkov to catch IaC misconfigurations before they're ever applied.",
    "beginnerExplanation": "Give people and services only the exact permissions they need (not broad access 'just in case'), log everything for audit purposes, lock down network access, keep secrets in one well-guarded place, and automatically scan infrastructure code for security mistakes before it's deployed.",
    "professionalExplanation": "Naming specific guardrail tools signals real practice: CloudTrail for audit logging, GuardDuty for threat detection, tfsec/checkov for IaC scanning in CI, and Azure Policy or AWS Organizations SCPs for org-wide preventive guardrails — a strong answer references at least a couple of these by name rather than describing 'good security practices' generically.",
    "realWorldExample": "An AWS Organizations SCP that outright blocks any account from disabling CloudTrail, combined with GuardDuty flagging anomalous API activity and tfsec blocking a PR that would create a public S3 bucket, layers preventive and detective controls together rather than relying on just one.",
    "commands": [
      "aws iam get-account-authorization-details",
      "tfsec .",
      "aws cloudtrail lookup-events --max-results 20"
    ],
    "followUpQuestions": [
      "What's the difference between a preventive control (like an SCP) and a detective control (like GuardDuty)?",
      "How would you audit existing IAM roles for overly broad permissions?"
    ],
    "commonMistakes": [
      "Granting broad managed policies (like AdministratorAccess) for convenience instead of scoping precisely",
      "Relying only on detective controls (logging/alerting) without any preventive guardrails blocking risky changes upfront"
    ],
    "interviewTip": "Name specific tools (CloudTrail, GuardDuty, tfsec) rather than speaking generically about 'security best practices' — specificity is what this question is actually testing.",
    "requiredKeywords": [
      "least privilege",
      "audit",
      "scanning"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-prod-rollout-fail": {
    "category": "Scenario-based questions",
    "difficulty": "Mid-level DevOps",
    "question": "Production deployment fails mid-rollout. What do you do?",
    "shortAnswer": "Assess blast radius, roll back first, communicate status in the incident channel, monitor recovery, then run a blameless postmortem.",
    "detailedAnswer": "Restoring service comes before root-causing — roll back immediately once the failure is confirmed real and user-impacting, post a clear status update so stakeholders aren't guessing, confirm recovery via dashboards/health checks, and only then dig into why it failed, documenting it in a blameless postmortem focused on systemic fixes rather than blame.",
    "beginnerExplanation": "First stop the bleeding (roll back), tell people what's happening, confirm things are actually back to normal, and only after that's done, figure out what went wrong and how to prevent it next time.",
    "professionalExplanation": "For Kubernetes specifically, kubectl rollout history and kubectl rollout undo make rollback fast and low-risk since the prior ReplicaSet's Pod template is retained — this is exactly why 'roll back first, investigate after' is a safe default rather than a shortcut, since rollback itself carries low risk when the platform supports it well.",
    "realWorldExample": "kubectl rollout undo deployment/api restores the prior version within seconds; kubectl rollout status confirms the restored Pods are healthy, and only after posting 'service restored, investigating root cause' does the actual root-cause investigation and postmortem begin.",
    "commands": [
      "kubectl rollout undo deployment/api",
      "kubectl rollout status deployment/api",
      "kubectl rollout history deployment/api"
    ],
    "followUpQuestions": [
      "Why is rolling back first generally safer than trying to fix forward during an active incident?",
      "What makes a postmortem 'blameless' in practice, not just in name?"
    ],
    "commonMistakes": [
      "Trying to debug and fix forward during an active incident instead of rolling back to restore service first",
      "Skipping the postmortem once service is restored, missing the chance to fix the systemic cause"
    ],
    "interviewTip": "Explicitly justify 'rollback first' as a deliberate low-risk default, not just a panic reaction — that framing is what shows incident-response maturity.",
    "requiredKeywords": [
      "rollback",
      "communicate",
      "postmortem"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-terraform-destroy-prod": {
    "category": "Scenario-based questions",
    "difficulty": "Mid-level DevOps",
    "question": "Terraform plan shows resources will be destroyed in production. How do you handle it?",
    "shortAnswer": "Stop before applying, understand whether the destroy is actually expected, use state mv/import for renames, protect critical resources with lifecycle rules, and require manual approval.",
    "detailedAnswer": "An unexpected destroy in a plan is a hard stop, not something to click through — first determine whether it's actually intentional (a genuine decommission) or an artifact of a resource being effectively renamed (which Terraform sees as destroy-then-create unless you use terraform state mv to tell it otherwise); prevent_destroy lifecycle rules on genuinely critical resources add a safety net that fails the plan outright rather than allowing an accidental destroy through.",
    "beginnerExplanation": "If a plan says it's going to destroy something in production, treat that as a red flag to stop and investigate first — it might be a real intended change, or it might be Terraform misreading a rename as delete-and-recreate, which state mv can fix without ever actually destroying anything.",
    "professionalExplanation": "A pipeline should be designed to automatically flag and block any plan containing a destroy against production resources, requiring explicit human approval specifically for that destroy — not just a generic 'apply' approval that could rubber-stamp past a destructive change nobody actually reviewed carefully.",
    "realWorldExample": "A plan showing a database resource will be destroyed and recreated because of a renamed Terraform resource block (not an actual infrastructure change) is fixed with terraform state mv aws_db_instance.old aws_db_instance.new, which tells Terraform it's the same resource, avoiding a real destroy-and-recreate of production data.",
    "commands": [
      "terraform plan -detailed-exitcode",
      "terraform state mv aws_db_instance.old aws_db_instance.new",
      "terraform plan"
    ],
    "followUpQuestions": [
      "How would terraform state mv prevent an unnecessary destroy-and-recreate?",
      "What would a pipeline check look like that specifically blocks unreviewed destroys in production?"
    ],
    "commonMistakes": [
      "Approving a plan with an unexpected destroy without first confirming whether it's an actual intended change",
      "Not using prevent_destroy or state mv, treating a renamed resource as a real destroy-and-recreate"
    ],
    "interviewTip": "Distinguish an actual intended destroy from a rename-misread-as-destroy explicitly — that distinction, and knowing state mv fixes the latter, is the specific knowledge this question probes for.",
    "requiredKeywords": [
      "destroy",
      "prevent_destroy",
      "approval"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "pdf-k8s-cloud-autoscaling": {
    "category": "Kubernetes",
    "difficulty": "Mid-level DevOps",
    "question": "How do you implement autoscaling in Kubernetes and cloud environments?",
    "shortAnswer": "HPA for pod replicas based on metrics, VPA for right-sizing resource requests, KEDA for event-driven scaling, and Cluster Autoscaler for node capacity.",
    "detailedAnswer": "HPA scales replica count based on CPU/memory or custom metrics; VPA adjusts a Pod's resource requests/limits over time based on observed usage (rarely used together with HPA on the same metric without care, since they can conflict); KEDA extends scaling triggers to event sources like queue depth or Kafka lag, which is often a far better signal for async workers than CPU; Cluster Autoscaler watches for Pods stuck Pending due to insufficient capacity and provisions new nodes to fit them.",
    "beginnerExplanation": "HPA adds/removes pod copies based on load, VPA adjusts how much CPU/memory each pod is allowed to request based on actual usage, KEDA scales based on things like queue length instead of just CPU, and Cluster Autoscaler adds more physical/virtual machines when there's no room left for new pods.",
    "professionalExplanation": "For many async worker workloads, CPU is actually a poor scaling signal — a worker can sit at low CPU while a queue backs up (waiting on I/O, not computing), which is exactly why KEDA's queue-depth or Kafka-lag-based scaling produces much more responsive, accurate autoscaling than CPU-based HPA for that workload shape.",
    "realWorldExample": "A KEDA ScaledObject scaling a worker Deployment based on SQS queue depth (scale up when messages pile up, scale to zero when the queue is empty) responds to actual backlog far more accurately than a CPU-based HPA would for a workload that's mostly waiting on I/O, not burning CPU.",
    "commands": [
      "kubectl get hpa",
      "kubectl get scaledobject",
      "kubectl get nodes -o wide"
    ],
    "followUpQuestions": [
      "Why might CPU be a poor autoscaling signal for an async worker workload?",
      "How do HPA and Cluster Autoscaler work together when a scale-up event needs more node capacity?"
    ],
    "commonMistakes": [
      "Using CPU-based HPA for I/O-bound async workers instead of a more accurate signal like queue depth via KEDA",
      "Running HPA and VPA on the same metric simultaneously without understanding how they can conflict"
    ],
    "interviewTip": "Explain specifically why CPU is a poor signal for queue-driven workers and how KEDA solves it — that's the nuanced, senior-level insight this question is really asking for beyond naming the four tools.",
    "requiredKeywords": [
      "hpa",
      "keda",
      "cluster autoscaler"
    ],
    "relatedModule": "Kubernetes",
    "reviewStatus": "reviewed"
  },
  "pdf-terraform-multi-env": {
    "category": "Terraform",
    "difficulty": "Mid-level DevOps",
    "question": "How do you manage dev, staging, and prod infrastructure in Terraform?",
    "shortAnswer": "Separate environment directories (or workspaces for simpler cases), shared reusable modules, and environment differences driven through tfvars and separate backend state.",
    "detailedAnswer": "Directory-based separation (environments/dev, environments/staging, environments/prod each with their own state) gives the strongest isolation and is preferred once environments diverge meaningfully in configuration or need independent access control; Terraform workspaces are lighter-weight and fine when environments are nearly identical and share the exact same backend, but they share more risk since a wrong workspace selection is an easy mistake.",
    "beginnerExplanation": "Either keep each environment in its own folder with its own settings and state (safest, most explicit), or use Terraform's built-in workspace feature for lighter cases where environments are nearly identical — either way, the actual resource definitions live in shared modules so you're not duplicating code.",
    "professionalExplanation": "Production should be able to enforce stricter settings (multi-AZ, larger instance sizes, tighter security groups) while reusing the exact same module interface as dev — that's the actual test of whether the module was designed well: can it flex to a stricter, higher-availability configuration purely through input variables, without needing separate module code for prod.",
    "realWorldExample": "The same module \"app\" { source = \"../modules/app\" } called from environments/dev/main.tf with multi_az = false, instance_type = \"t3.small\" and from environments/prod/main.tf with multi_az = true, instance_type = \"m5.large\" demonstrates one module flexing to very different environment needs through variables alone.",
    "commands": [
      "terraform workspace select prod",
      "terraform plan -var-file=prod.tfvars",
      "terraform init -backend-config=prod.backend.hcl"
    ],
    "followUpQuestions": [
      "When would you choose workspaces over directory-based separation, and what's the tradeoff?",
      "How do you prevent accidentally applying dev's tfvars against production's state?"
    ],
    "commonMistakes": [
      "Using workspaces when environments actually need independent access control or diverge significantly, when directories would be safer",
      "Accidentally running an environment's plan/apply against the wrong workspace or state due to insufficient safeguards"
    ],
    "interviewTip": "Explain the actual tradeoff between workspaces and directories (isolation strength versus simplicity) rather than just naming both options — the tradeoff reasoning is what's being tested.",
    "requiredKeywords": [
      "workspaces",
      "directories",
      "tfvars"
    ],
    "relatedModule": "Terraform",
    "reviewStatus": "reviewed"
  },
  "pdf-ha-dr": {
    "category": "DevOps fundamentals",
    "difficulty": "Advanced",
    "question": "How do you ensure high availability and disaster recovery in cloud infrastructure?",
    "shortAnswer": "Design across availability zones, use managed database failover, replicate critical data, define RPO/RTO explicitly, and test failover with regular game days.",
    "detailedAnswer": "Multi-AZ deployment protects against a single data center failure; a managed database with automated failover (RDS Multi-AZ, Aurora) removes manual intervention from that specific failure mode; RPO (how much data loss is acceptable) and RTO (how long recovery may take) should be explicit numbers agreed with the business, not assumed — and the DR plan is only real if it's been tested via an actual game day, not just documented and never exercised.",
    "beginnerExplanation": "Spread your infrastructure across multiple physical data centers (availability zones) so one failing doesn't take everything down, use a database that can fail over automatically, define exactly how much data loss and downtime is acceptable, and actually practice your disaster recovery plan periodically instead of just writing it down and hoping.",
    "professionalExplanation": "The detail that separates a real DR posture from a documented-but-untested one is the game day — actually failing over to the DR region/AZ on a schedule and measuring whether the real RTO matches what was assumed, since untested runbooks reliably fail in ways nobody predicted when the real disaster happens.",
    "realWorldExample": "Route53 health-check-based failover automatically redirecting traffic to a standby region if the primary's health checks fail, combined with a quarterly game day that actually triggers this failover in a controlled way to verify the runbook and measured RTO both still hold, is what a tested (not just documented) DR posture looks like.",
    "commands": [
      "aws rds describe-db-instances --query 'DBInstances[].MultiAZ'",
      "aws route53 get-health-check-status --health-check-id ...",
      "aws rds failover-db-cluster --db-cluster-identifier prod-cluster"
    ],
    "followUpQuestions": [
      "What's the difference between RPO and RTO, and how would you set realistic numbers for each?",
      "How often should a disaster recovery plan actually be tested, and why?"
    ],
    "commonMistakes": [
      "Writing a DR plan/runbook that's never actually tested with a real failover exercise",
      "Not defining explicit RPO/RTO numbers, making it unclear what 'good enough' recovery actually means"
    ],
    "interviewTip": "Emphasize game-day testing specifically — a DR plan nobody has ever exercised is the single biggest red flag interviewers listen for in this answer.",
    "requiredKeywords": [
      "multi-az",
      "rpo",
      "rto"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-behavioural-migration": {
    "category": "Behavioural questions",
    "difficulty": "Mid-level DevOps",
    "question": "Tell me about a time you led a critical infrastructure migration.",
    "shortAnswer": "Use STAR: the situation that forced the migration, your ownership, discovery and runbook approach, risk mitigation, execution, and a quantified measurable outcome.",
    "detailedAnswer": "Structure it as: what forced the migration (cost, EOL, a scaling limit), what you specifically owned versus the broader team, how you discovered scope and wrote a runbook, what risk mitigation you built in (a rollback plan, a staged cutover), and end with a quantified result — avoided cost, reduced provisioning time, or improved reliability, not just 'it went well'.",
    "beginnerExplanation": "Tell it like a story: why the migration was needed, what your specific role was, how you planned and reduced risk, and what measurable result came out of it at the end.",
    "professionalExplanation": "The strongest signal in this answer is the risk mitigation detail — describing a staged/reversible cutover plan (not a single big-bang switch) and a tested rollback path shows the same judgment a senior engineer would want to see in how you'd handle a future migration, not just that you can execute one that happened to go fine.",
    "realWorldExample": "A concrete answer: 'We migrated from self-managed Jenkins to GitHub Actions to cut licensing cost and maintenance burden; I owned the runbook and a staged cutover by team, kept the old system running in parallel for two weeks as rollback, and completed it with zero missed deploys, cutting annual tooling cost by $40k.'",
    "commands": [
      "terraform plan -target=module.new_infra",
      "kubectl get pods -n legacy",
      "git log --oneline -- migration/"
    ],
    "followUpQuestions": [
      "What was your rollback plan if the migration had gone wrong partway through?",
      "What would you do differently if you led a similar migration again?"
    ],
    "commonMistakes": [
      "Describing the migration's outcome without any quantified impact (cost, time, reliability)",
      "Not mentioning a rollback or risk mitigation plan, implying the migration was a single risky big-bang switch"
    ],
    "interviewTip": "Quantify the outcome specifically (a dollar figure, a time reduction, an incident count) — vague 'it went smoothly' answers are the most common weak version of this question.",
    "requiredKeywords": [
      "situation",
      "action",
      "result"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-behavioural-incident": {
    "category": "Behavioural questions",
    "difficulty": "Mid-level DevOps",
    "question": "Tell me about a time you resolved a major production incident.",
    "shortAnswer": "Use STAR: the user impact, your immediate diagnosis, the mitigation/rollback taken, stakeholder updates, and the concrete lesson and follow-up prevention work.",
    "detailedAnswer": "Name the actual impact (which users, how severe, for how long), the specific diagnostic steps you took in order, the mitigation action (rollback, scaling, a config fix), how you kept stakeholders informed during the incident, and — critically — what changed afterward so the same failure mode can't recur the same way; an answer without that last part reads as firefighting without learning.",
    "beginnerExplanation": "Tell the story with a clear timeline: what broke and who it affected, what you actually did to fix it (step by step), how you kept people updated while it was happening, and what you changed afterward to prevent it happening again.",
    "professionalExplanation": "A mature answer balances both restoration speed and postmortem depth — interviewers are listening for whether you treat incidents as a source of systemic learning (a new test, a new alert, a runbook update) rather than just a fire you happened to put out once.",
    "realWorldExample": "A concrete answer: 'A bad deploy caused checkout 500s affecting roughly 15% of traffic; I confirmed via error-rate dashboards, rolled back within 4 minutes, posted updates in the incident channel every 5 minutes, and in the postmortem we added a pre-deploy smoke test on the checkout path that would have caught this exact regression before it shipped.'",
    "commands": [
      "kubectl rollout undo deployment/checkout",
      "kubectl logs -l app=checkout --since=15m",
      "curl -s http://localhost:9090/api/v1/query?query=error_rate"
    ],
    "followUpQuestions": [
      "What specifically changed in your systems or process as a direct result of that incident?",
      "How did you decide when it was safe to declare the incident resolved?"
    ],
    "commonMistakes": [
      "Describing the fix but not the follow-up prevention work, missing the systemic-learning half of the answer",
      "Being vague about actual user impact and timeline instead of giving specific numbers"
    ],
    "interviewTip": "End with the specific prevention change made afterward — that's the part of the answer that most distinguishes candidates and is the easiest to forget under interview pressure.",
    "requiredKeywords": [
      "impact",
      "rollback",
      "lesson"
    ],
    "relatedModule": "Troubleshooting",
    "reviewStatus": "reviewed"
  },
  "pdf-behavioural-disagreement": {
    "category": "Behavioural questions",
    "difficulty": "Junior DevOps",
    "question": "How do you handle disagreements with developers about infrastructure decisions?",
    "shortAnswer": "Listen first, clarify the actual requirement, explain security/cost/reliability tradeoffs with evidence, document options, and escalate with context only when needed.",
    "detailedAnswer": "Start by genuinely understanding what the developer actually needs (not just their proposed solution) — often the disagreement is about the how, not the what, and there's a compromise that satisfies both the functional need and the operational concern; when there's a real tradeoff, bring data (cost numbers, a past incident, a security scan result) rather than just an opinion, and if you still can't agree, document both options clearly and escalate rather than letting it stall silently.",
    "beginnerExplanation": "Listen to understand what they're actually trying to achieve, explain your concern with real reasons (not just 'because that's not how we do it'), try to find a middle ground that meets both needs, and if you truly can't agree, bring it to someone who can make the call rather than letting it sit unresolved.",
    "professionalExplanation": "The strongest version of this answer includes a real example ending in a compromise, not a 'win' — a good outcome is usually neither side simply capitulating but a solution that met the delivery need without ignoring the actual operational risk, which is the kind of nuanced resolution interviewers are listening for over a story where you were simply 'right'.",
    "realWorldExample": "A developer wanting broad IAM permissions 'to move faster' and a compromise of a scoped role with a documented process to request additional temporary permissions when genuinely needed satisfies both the delivery need and the least-privilege security concern, rather than either side just winning outright.",
    "commands": [
      "aws iam simulate-principal-policy",
      "git log --oneline -- infra/",
      "terraform plan"
    ],
    "followUpQuestions": [
      "Can you give a specific example where you actually reached a compromise, not just convinced the other person you were right?",
      "How would you handle it if the disagreement kept recurring with the same person?"
    ],
    "commonMistakes": [
      "Framing the story as convincing the other person you were right instead of describing a genuine compromise",
      "Escalating too quickly without first trying to understand the actual underlying need behind the disagreement"
    ],
    "interviewTip": "Tell a story that ends in genuine compromise, not a clean 'I was right and they agreed' — the nuance of a real tradeoff resolution is what this question is actually probing for.",
    "requiredKeywords": [
      "listen",
      "tradeoffs",
      "data"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  },
  "pdf-stay-current": {
    "category": "Behavioural questions",
    "difficulty": "Beginner",
    "question": "How do you stay current with DevOps tools and cloud trends?",
    "shortAnswer": "Follow release notes, newsletters, and official documentation, practice hands-on in a lab repo, pursue targeted certifications, join community channels, and share learnings with the team.",
    "detailedAnswer": "Reading about a tool is a weak substitute for actually using it — the most durable way to stay current is picking one specific new tool or feature relevant to real work, testing it in a throwaway lab environment, and then sharing what you learned (a short writeup, a demo) so the learning compounds across the team instead of staying siloed with you.",
    "beginnerExplanation": "Read release notes and newsletters to know what's new, but more importantly actually try new tools hands-on in a low-stakes lab environment, and tell your team what you learned so everyone benefits.",
    "professionalExplanation": "The strongest version of this answer names a specific, recent example with a concrete outcome — a tool you tested that got adopted, or a certification that directly informed a real architecture decision — rather than a generic 'I read blogs and go to conferences' answer that could apply to literally anyone.",
    "realWorldExample": "Testing Argo Rollouts in a personal lab cluster after reading about progressive delivery, then proposing and implementing canary deployments for a real production service based on that hands-on evaluation, is a concrete example connecting learning to actual applied impact.",
    "commands": [
      "kind create cluster",
      "helm install argo-rollouts argo/argo-rollouts",
      "kubectl argo rollouts get rollout demo"
    ],
    "followUpQuestions": [
      "What's the most recent new tool or technique you tested, and what did you learn from it?",
      "How do you decide which of the constant stream of new DevOps tools is actually worth your time to evaluate?"
    ],
    "commonMistakes": [
      "Giving a generic answer ('I read blogs and follow people on Twitter') with no specific recent example",
      "Never connecting what was learned back to an actual applied outcome at work"
    ],
    "interviewTip": "Name one specific, recent tool you actually tested and what came of it — a concrete recent example beats a generic learning philosophy every time.",
    "requiredKeywords": [
      "documentation",
      "practice",
      "community"
    ],
    "relatedModule": "DevOps fundamentals",
    "reviewStatus": "reviewed"
  }
};
