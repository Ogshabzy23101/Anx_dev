// Interview Prep data model
//
// Every question is tagged with a formulaType, which maps to a fixed set of
// stages (see interviewFormulas below). The practice UI shows those stage
// labels as a strip above the answer box so the learner knows the *shape*
// an interview answer should take, without being handed a script to recite.
// The checklist is a set of pattern-based rules (same mechanism as the
// module practice validators) that check whether the learner's own answer
// actually hit each stage — not an exact-match grader.

export const interviewCategories = [
  "Linux",
  "Docker",
  "Kubernetes",
  "Helm",
  "Terraform",
  "Ansible",
  "CI/CD",
  "Cloud & AWS",
  "DevOps fundamentals",
  "Troubleshooting & scenarios",
  "Behavioral & project",
];

export const interviewDifficulties = ["Junior", "Mid-level", "Senior"];

export const interviewFormulas = {
  concept: {
    label: "Concept",
    stages: ["What it is", "Why it matters", "Example", "Gotcha"],
    hint: "Define it precisely, contrast it with the naive alternative, give one concrete example, then name a real pitfall.",
  },
  troubleshooting: {
    label: "Troubleshooting",
    stages: ["Clarify", "Cheap checks", "Narrow down", "Fix", "Prevent"],
    hint: "Scope the problem, check the cheap/obvious things first, narrow down layer by layer, state the fix, then mention how you'd prevent a repeat.",
  },
  star: {
    label: "Behavioral (STAR)",
    stages: ["Situation", "Task", "Action", "Result"],
    hint: "Set the scene in one sentence, state what you owned, walk through what you actually did, close with a measurable or observable result.",
  },
};

function mentions(...alternatives) {
  const escaped = alternatives.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(escaped.join("|"), "i");
}

const questions = [
  // ---------------------------------------------------------------------
  // Linux
  // ---------------------------------------------------------------------
  {
    id: "linux-permissions",
    category: "Linux", difficulty: "Junior", formulaType: "concept",
    question: "Explain Linux file permissions.",
    modelAnswer: "Every file has three permission groups — owner, group, and everyone else — and each group can have read, write, and execute set independently. You see it as a string like rwxr-xr-x, or as octal like 755. Read lets you view a file's contents or list a directory, write lets you modify it, and execute lets you run a file or, for a directory, actually enter it. I'd use chmod to change permissions and chown to change ownership. The gotcha people miss is that execute on a directory doesn't mean 'run it' — it means you can cd into it and access files inside, which is why you'll sometimes see a directory with read but not execute and still can't list what's in it properly.",
    checklist: [
      { label: "names owner/group/other", pattern: mentions("owner", "group", "other", "everyone else") },
      { label: "names read/write/execute", pattern: mentions("read", "write", "execute") },
      { label: "mentions chmod or chown", pattern: mentions("chmod", "chown") },
      { label: "gives a directory execute-bit gotcha or similar pitfall", pattern: mentions("directory", "execute bit", "list", "cd into") },
    ],
    commonMistake: "Reciting 'rwx' without explaining what execute means on a directory versus a file — that's usually the follow-up question.",
    relatedModule: "Linux",
  },
  {
    id: "linux-high-cpu",
    category: "Linux", difficulty: "Junior", formulaType: "troubleshooting",
    question: "A Linux server is running hot. How do you find out why?",
    modelAnswer: "First I'd clarify scope — is this one process or system-wide, and did it start suddenly or creep up. Cheap check first: top or htop sorted by CPU, which usually points straight at the offending process. If it's not obvious from there, I'd narrow down with ps aux and check whether it's a runaway process, a cron job that's overlapping with itself, or a legitimate load spike. I'd also check dmesg and the service's own logs in case it's stuck in a retry loop. Once I know the process, the fix depends on the cause — kill and restart it, patch a bug causing an infinite loop, or scale the box if the load is genuinely legitimate. To prevent a repeat I'd add CPU alerting and, if it's a specific service, resource limits so one bad process can't take the whole box down.",
    checklist: [
      { label: "starts with top/htop", pattern: mentions("top", "htop") },
      { label: "narrows down to a specific process", pattern: mentions("ps aux", "process", "pid") },
      { label: "checks logs", pattern: mentions("log", "dmesg") },
      { label: "mentions prevention", pattern: mentions("alert", "limit", "prevent", "cgroup") },
    ],
    commonMistake: "Jumping straight to 'restart the server' without first identifying which process is actually responsible.",
    relatedModule: "Linux",
  },
  {
    id: "linux-pipe",
    category: "Linux", difficulty: "Junior", formulaType: "concept",
    question: "What does a pipe do in Linux, and why use one?",
    modelAnswer: "A pipe connects one command's stdout directly to the next command's stdin, so data streams between them without ever touching disk. It's the difference between running a command, writing the output to a temp file, then running a second command against that file — versus just chaining them with a pipe and letting the shell handle it. A simple example is ps aux | grep node | awk '{print $2}' to get the PID of a running node process in one line. The gotcha is that a pipe only forwards stdout, not stderr, by default — if a command in the middle of your pipeline is failing silently, its error output isn't going through the pipe, so you have to redirect stderr separately (2>&1) if you want to catch it too.",
    checklist: [
      { label: "connects stdout to stdin", pattern: mentions("stdout", "stdin") },
      { label: "gives a concrete piped example", pattern: mentions("|") },
      { label: "notes stderr isn't piped by default", pattern: mentions("stderr", "2>&1") },
    ],
    commonMistake: "Describing a pipe as 'combining commands' without being specific that it's stdout going to stdin, and only stdout at that.",
    relatedModule: "Linux",
  },
  {
    id: "linux-disk-usage",
    category: "Linux", difficulty: "Junior", formulaType: "concept",
    question: "How do you check disk usage and find what's eating space?",
    modelAnswer: "df -h gives me the filesystem-level view — how full each mounted volume is. If a volume is nearly full, I need to find what's actually taking the space, and that's where du comes in — something like du -sh /var/* sorted by size to find the biggest directories, then drilling down from there. A common real-world case is /var/log filling up because a service is logging aggressively without rotation, or Docker's overlay storage growing unbounded from old images and containers. The gotcha is a deleted-but-still-open file — if a process has a large log file open and you delete it, df still shows the space as used until that process closes the file handle or restarts, which confuses people who deleted a file and don't understand why space wasn't freed.",
    checklist: [
      { label: "mentions df for filesystem view", pattern: mentions("df") },
      { label: "mentions du for finding big directories", pattern: mentions("du") },
      { label: "gives a real cause like logs or docker images", pattern: mentions("log", "docker", "image") },
      { label: "mentions the deleted-but-open-file gotcha", pattern: mentions("deleted", "open file", "file handle", "restart") },
    ],
    commonMistake: "Only mentioning df and never explaining how you'd actually locate the specific directory or file responsible.",
    relatedModule: "Linux",
  },
  {
    id: "linux-journalctl",
    category: "Linux", difficulty: "Junior", formulaType: "concept",
    question: "How do you inspect and follow service logs on a systemd-managed server?",
    modelAnswer: "journalctl is the tool — journalctl -u servicename shows that unit's logs, and adding -f follows them live the same way tail -f would on a plain log file. If I only care about recent activity I'd add --since \"10 min ago\", and -p err filters down to just error-level entries when I'm scanning a noisy service. The reason journalctl matters over just grepping a log file is that systemd centralizes logs from every unit in one structured store, so you're not hunting for where a specific service happens to write its logs. The gotcha is that by default the journal isn't persistent across reboots unless persistent storage is configured in journald.conf — so on a fresh VM you might find journalctl -u servicename comes back nearly empty even though the service has clearly been running.",
    checklist: [
      { label: "names journalctl -u", pattern: mentions("journalctl") },
      { label: "mentions following logs live", pattern: mentions("-f", "follow", "tail") },
      { label: "mentions filtering by time or severity", pattern: mentions("--since", "-p err", "priority", "severity") },
      { label: "notes the persistence gotcha", pattern: mentions("persistent", "reboot", "journald.conf") },
    ],
    commonMistake: "Not knowing journalctl at all and defaulting to 'check /var/log' without acknowledging systemd-managed services log through journald.",
    relatedModule: "Linux",
  },
  {
    id: "linux-service-wont-start",
    category: "Linux", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "A service won't start after a config change. Walk me through your diagnosis.",
    modelAnswer: "First thing I ask is what actually changed — the config diff tells me where to look before I touch anything. Cheap check: systemctl status servicename usually tells you immediately if it's a syntax error the service itself caught on startup. If that's not conclusive, journalctl -u servicename -n 50 gives the actual startup error. I'd narrow down from there — is it a config syntax problem, a missing file the config now references, a port already in use, or a permissions issue on a file the service needs to read. Most tools also have a built-in config-check command, like nginx -t, which I'd run before even trying to start the service again. Once I've found and fixed the actual line, I'd restart and confirm with systemctl status and a functional check, not just 'active (running)'. To prevent this going forward, config validation should run in CI or as a pre-deploy step, not discovered live on the box.",
    checklist: [
      { label: "starts by checking what changed", pattern: mentions("changed", "diff", "config change") },
      { label: "uses systemctl status or journalctl", pattern: mentions("systemctl status", "journalctl") },
      { label: "mentions a config validation tool", pattern: mentions("nginx -t", "config check", "validate", "syntax") },
      { label: "mentions prevention via CI validation", pattern: mentions("ci", "pre-deploy", "pipeline", "validate") },
    ],
    commonMistake: "Restarting the service repeatedly hoping it works, instead of reading the actual startup error from journalctl first.",
    relatedModule: "Linux",
  },

  // ---------------------------------------------------------------------
  // Docker
  // ---------------------------------------------------------------------
  {
    id: "docker-image-vs-container",
    category: "Docker", difficulty: "Junior", formulaType: "concept",
    question: "What's the difference between a Docker image and a container?",
    modelAnswer: "An image is a read-only, layered template — it's the built artifact that contains your application code, dependencies, and filesystem, but it isn't running anything. A container is a running instance of that image, with its own writable layer on top and its own process, network namespace, and lifecycle. The relationship is like a class and an object — you can start many containers from the same image, and each one is independent, so changes inside one container don't affect the image or any other container started from it. The gotcha is that anything written inside a running container's writable layer is gone the moment that container is removed, unless it's in a mounted volume — which is exactly why you don't store real application data inside a container's own filesystem.",
    checklist: [
      { label: "calls image the template/artifact", pattern: mentions("template", "artifact", "read-only", "read only") },
      { label: "calls container the running instance", pattern: mentions("running instance", "instance of")},
      { label: "gives an analogy or one-to-many relationship", pattern: mentions("class", "instance", "many containers") },
      { label: "notes writable layer is lost without a volume", pattern: mentions("writable layer", "volume", "removed", "gone") },
    ],
    commonMistake: "Saying 'an image is like a snapshot of a container' — it's backwards; the image comes first and the container is derived from it.",
    relatedModule: "Docker",
  },
  {
    id: "docker-port-mapping",
    category: "Docker", difficulty: "Junior", formulaType: "concept",
    question: "How does Docker port mapping/publishing work?",
    modelAnswer: "By default a container's ports aren't reachable from outside the Docker host at all — -p hostPort:containerPort explicitly publishes a container port onto the host, so traffic hitting the host on that port gets forwarded into the container's network namespace. It's a genuinely different port on each side, which is why -p 8080:80 means the app listens on 80 inside the container but you'd reach it on the host at 8080. The common confusion is EXPOSE in a Dockerfile — that's just documentation of which port the app listens on, it doesn't actually publish anything; you still need -p (or ports: in Compose) at runtime to make it reachable. The gotcha in production is binding to 0.0.0.0 versus 127.0.0.1 on the host side — publishing to 127.0.0.1:8080:80 only accepts local traffic, which trips people up when they expect it to be reachable externally.",
    checklist: [
      { label: "explains -p hostPort:containerPort", pattern: mentions("-p", "publish", "hostport", "containerport") },
      { label: "distinguishes EXPOSE from publishing", pattern: mentions("expose") },
      { label: "mentions the host bind-address gotcha", pattern: mentions("0.0.0.0", "127.0.0.1", "bind") },
    ],
    commonMistake: "Confusing EXPOSE in a Dockerfile with actually publishing a port — EXPOSE alone makes nothing reachable.",
    relatedModule: "Docker",
  },
  {
    id: "docker-multistage",
    category: "Docker", difficulty: "Mid-level", formulaType: "concept",
    question: "What is a multi-stage build and why use one?",
    modelAnswer: "A multi-stage build lets you use multiple FROM statements in one Dockerfile, where each stage can build on the previous one, but only the final stage's contents end up in the resulting image. The classic case is compiling or building in a stage that has all your build tools and dev dependencies, then copying just the compiled output into a clean runtime-only base image for the final stage. That means your shipped image doesn't carry compilers, source maps, node_modules dev dependencies, or anything else only needed at build time — smaller image, smaller attack surface. In my own project the frontend build stage runs npm ci and npm run build with full dev dependencies, then the runtime stage is a minimal nginx-unprivileged image that only gets the compiled dist folder copied in — nothing from the build stage's node_modules ever reaches the final image. The gotcha is forgetting COPY --from=stage-name, and accidentally copying from the default final stage instead of the named build stage, which silently ships build tooling you meant to leave behind.",
    checklist: [
      { label: "explains multiple FROM stages", pattern: mentions("multiple from", "stages", "stage")},
      { label: "explains only final stage ships", pattern: mentions("final stage", "only the final", "copy --from") },
      { label: "gives a build-vs-runtime rationale", pattern: mentions("build tool", "dev dependencies", "smaller", "attack surface") },
      { label: "ties to a real or plausible example", pattern: mentions("nginx", "compile", "npm run build", "dist") },
    ],
    commonMistake: "Explaining multi-stage builds as just 'a way to make images smaller' without explaining the actual mechanism of copying artifacts between named stages.",
    relatedModule: "Docker",
  },
  {
    id: "docker-cmd-entrypoint",
    category: "Docker", difficulty: "Mid-level", formulaType: "concept",
    question: "What's the difference between CMD and ENTRYPOINT?",
    modelAnswer: "ENTRYPOINT sets the fixed command that always runs when the container starts, and CMD supplies default arguments to it — but CMD alone can also just be the whole command if there's no ENTRYPOINT. The practical difference shows up when you run docker run image somearg — if the image only has CMD, that argument replaces the whole CMD; if it has ENTRYPOINT, that argument gets appended as an argument to the entrypoint instead of replacing it. That's genuinely useful for images meant to behave like a CLI tool, where you always want the same binary to run but let the caller pass different flags. The gotcha is mixing shell form and exec form — shell form (CMD npm start, no brackets) runs inside /bin/sh -c, which means your process isn't PID 1 and doesn't receive signals like SIGTERM directly, so graceful shutdown on docker stop can silently fail unless you use exec form with brackets.",
    checklist: [
      { label: "explains ENTRYPOINT as fixed, CMD as default args", pattern: mentions("fixed", "default", "arguments") },
      { label: "explains what happens with a runtime argument", pattern: mentions("append", "replace", "override") },
      { label: "mentions shell form vs exec form / PID 1 signal handling", pattern: mentions("shell form", "exec form", "pid 1", "sigterm", "signal") },
    ],
    commonMistake: "Treating CMD and ENTRYPOINT as interchangeable without explaining how a runtime argument interacts differently with each.",
    relatedModule: "Docker",
  },
  {
    id: "docker-exits-immediately",
    category: "Docker", difficulty: "Junior", formulaType: "troubleshooting",
    question: "A container exits immediately after starting. How do you troubleshoot it?",
    modelAnswer: "First I'd clarify whether this is every run or intermittent, and check docker ps -a to see the actual exit code — that alone narrows things a lot. Cheap check: docker logs containername, which usually shows the crash reason directly. If logs are empty, that's a hint the process never really started, so I'd check the CMD/ENTRYPOINT and whether the main process is staying in the foreground — a container exits the moment its PID 1 process exits, so if the entrypoint script backgrounds the real process and then exits itself, Docker sees that as 'done' and stops the container. I'd also check required environment variables and file permissions, since a missing DB connection string or a permissions error on a mounted volume are common silent-exit causes. Once I've found the cause, the fix is usually in the entrypoint script or the missing config; to prevent it, I'd add a healthcheck and make sure any wrapper script uses exec so the real process actually becomes PID 1.",
    checklist: [
      { label: "checks docker ps -a for exit code", pattern: mentions("docker ps -a", "exit code") },
      { label: "checks docker logs", pattern: mentions("docker logs", "logs") },
      { label: "explains PID 1 / foreground process reasoning", pattern: mentions("pid 1", "foreground", "background") },
      { label: "checks env vars or permissions as a cause", pattern: mentions("environment variable", "env var", "permission") },
    ],
    commonMistake: "Jumping to 'the image is broken' without first reading the exit code and logs, which usually name the exact problem.",
    relatedModule: "Docker",
  },
  {
    id: "docker-image-too-big",
    category: "Docker", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "Your production image is 500MB and slow to pull. How do you shrink it?",
    modelAnswer: "First I'd clarify what's actually in it — docker history shows each layer's size, which quickly tells me if it's a bloated base image, leftover build tools, or genuinely large dependencies. Cheap check: switch the base image to an alpine or slim variant if it isn't already, which alone often cuts a huge chunk. If the Dockerfile isn't already multi-stage, that's usually the biggest single win — separating build-time dependencies from the runtime image. I'd also check for things like copying the entire repo instead of just what's needed, missing a .dockerignore so node_modules or .git gets baked in, or unnecessarily installing dev dependencies in the final image. Once I've trimmed the obvious layers, I'd re-run docker history to confirm the reduction and check that functionality still works. To prevent regressions, I'd add an image size check or scan step in CI so a future change that doubles the image size gets flagged before it ships.",
    checklist: [
      { label: "inspects layers with docker history", pattern: mentions("docker history", "layer") },
      { label: "mentions switching to a smaller base image", pattern: mentions("alpine", "slim", "base image") },
      { label: "mentions multi-stage builds", pattern: mentions("multi-stage", "multistage") },
      { label: "mentions .dockerignore or excess copied files", pattern: mentions("dockerignore", "copy", "node_modules") },
    ],
    commonMistake: "Guessing at fixes without first checking docker history to see which layer is actually responsible for the size.",
    relatedModule: "Docker",
  },

  // ---------------------------------------------------------------------
  // Kubernetes
  // ---------------------------------------------------------------------
  {
    id: "k8s-pod",
    category: "Kubernetes", difficulty: "Junior", formulaType: "concept",
    question: "What is a Pod, and why not just run containers directly?",
    modelAnswer: "A Pod is the smallest deployable unit in Kubernetes — it wraps one or more containers that are always scheduled, started, and stopped together, sharing a network namespace and any mounted volumes. Kubernetes doesn't schedule bare containers directly because it needs a consistent unit to reason about placement, networking, and lifecycle, and a Pod gives it that, including support for genuinely coupled multi-container patterns like a sidecar that ships logs alongside a main application container. In practice you rarely create bare Pods yourself — a Deployment or StatefulSet manages Pods on your behalf and recreates them automatically on failure, whereas a standalone Pod that dies just stays dead with nothing watching to bring it back. The gotcha is exactly that — creating a bare Pod for a real workload instead of wrapping it in a Deployment, and being surprised when a node failure takes it down permanently.",
    checklist: [
      { label: "calls it the smallest deployable unit", pattern: mentions("smallest", "deployable unit") },
      { label: "mentions shared network namespace/volumes", pattern: mentions("network namespace", "shared network", "localhost", "volumes") },
      { label: "contrasts with a controller like Deployment", pattern: mentions("deployment", "replicaset", "controller") },
      { label: "notes a bare pod isn't recreated on failure", pattern: mentions("bare pod", "not recreated", "stays dead", "no controller") },
    ],
    commonMistake: "Describing a Pod as 'the same thing as a container' instead of explaining it as a wrapper that can hold one or more containers sharing network and storage.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-deployment-replicaset",
    category: "Kubernetes", difficulty: "Junior", formulaType: "concept",
    question: "What problem does a Deployment solve, and how does it relate to a ReplicaSet?",
    modelAnswer: "A Deployment manages ReplicaSets underneath it, and a ReplicaSet's job is just to keep a fixed number of matching Pods running. What a Deployment adds on top is rollout history and controlled updates — when you change the Pod template, like bumping an image tag, the Deployment creates a new ReplicaSet and scales it up while scaling the old one down, following a rolling update strategy so the app stays available the whole time. You almost never create a bare ReplicaSet yourself, because it has no memory of previous versions and no built-in rollback — that's exactly what the Deployment layer gives you with kubectl rollout undo. The gotcha is editing a ReplicaSet directly instead of the Deployment that owns it — the change works briefly, but the Deployment's own reconciliation loop overwrites it back to whatever's in the Deployment spec the next time it reconciles.",
    checklist: [
      { label: "explains Deployment manages ReplicaSets", pattern: mentions("replicaset", "manages", "underneath", "owns")},
      { label: "explains rolling update / rollout history", pattern: mentions("rolling update", "rollout", "history") },
      { label: "mentions rollback support", pattern: mentions("rollback", "rollout undo", "revision") },
      { label: "notes editing a ReplicaSet directly gets overwritten", pattern: mentions("overwritten", "reconcil", "revert") },
    ],
    commonMistake: "Describing a Deployment and ReplicaSet as basically the same thing instead of explaining the actual ownership relationship.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-service-routing",
    category: "Kubernetes", difficulty: "Mid-level", formulaType: "concept",
    question: "How do Services route traffic to the right Pods?",
    modelAnswer: "A Service has a label selector, and it continuously watches for Pods matching that selector — the matching Pod IPs become the Service's endpoints, which is what actually receives traffic, load-balanced across all current matches. The Service itself gets a stable virtual IP and DNS name that doesn't change even as individual Pods are replaced, so clients never need to know or track individual Pod IPs directly. In practice I'd debug a routing issue by checking kubectl get endpointslices first — if that list is empty, the selector doesn't match any Pod's labels, which is almost always a typo, and no amount of network debugging downstream fixes that. The gotcha, once endpoints look correct, is confusing the Service's own port with targetPort — targetPort has to match whatever port the container actually listens on, and a mismatch there means the Service looks perfectly configured but every request still fails.",
    checklist: [
      { label: "explains label selector matching Pods", pattern: mentions("selector", "label")},
      { label: "explains endpoints as the actual routing target", pattern: mentions("endpoint")},
      { label: "mentions stable virtual IP / DNS", pattern: mentions("virtual ip", "dns", "stable")},
      { label: "distinguishes port from targetPort", pattern: mentions("targetport", "target port") },
    ],
    commonMistake: "Saying 'Services route to Pods' without explaining the selector-to-endpoint mechanism, which is exactly what an interviewer is probing for.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-configmap-secret",
    category: "Kubernetes", difficulty: "Junior", formulaType: "concept",
    question: "What's the role of ConfigMaps and Secrets, and how are they different?",
    modelAnswer: "Both hold configuration data that Pods can consume as environment variables or mounted files, keeping config separate from the container image — but ConfigMaps are for non-sensitive values like feature flags or log levels, while Secrets are meant for sensitive values like passwords or API keys. Structurally they're nearly identical, but Secrets are base64-encoded by convention and RBAC tooling treats them as needing tighter access control. The important gotcha is that base64 is encoding, not encryption — it's trivially reversible by anyone who can read the Secret object, so the real security boundary is RBAC controlling who can get or list Secrets, not the encoding itself. In my own project, the committed Postgres Secret is explicitly documented as local/demo-only for exactly this reason — a real deployment should use something like Sealed Secrets, SOPS, or a cloud secrets manager instead of a plaintext-in-Git manifest.",
    checklist: [
      { label: "distinguishes sensitive vs non-sensitive use", pattern: mentions("sensitive", "non-sensitive", "password", "credential") },
      { label: "notes base64 is not encryption", pattern: mentions("base64", "encod", "not encrypt") },
      { label: "names RBAC as the real security boundary", pattern: mentions("rbac", "access control") },
      { label: "mentions a real secrets-management path", pattern: mentions("sealed secret", "sops", "secrets manager", "external secrets") },
    ],
    commonMistake: "Treating Secret's base64 encoding as if it were real encryption — this is one of the most common Kubernetes interview traps.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-liveness-readiness",
    category: "Kubernetes", difficulty: "Mid-level", formulaType: "concept",
    question: "What's the difference between a liveness probe and a readiness probe?",
    modelAnswer: "A liveness probe answers 'is this container broken enough to need a restart' — if it keeps failing, the kubelet kills and restarts the container. A readiness probe answers a completely different question — 'is this container ready to receive traffic right now' — and failing it doesn't restart anything, it just pulls the Pod out of the Service's endpoints until it passes again. The reason both exist is that a container can be alive but not ready — still warming a cache, still connecting to a database — and that's a normal, temporary state, not a crash. The gotcha is using the exact same check with tight thresholds for both — a slow-starting container then gets killed by the liveness probe for something readiness should have handled gracefully by just withholding traffic. That's also exactly what a rolling update relies on — a new Pod only gets added to a Service's endpoints once its readiness probe passes, which is what makes the rollout actually zero-downtime.",
    checklist: [
      { label: "explains liveness triggers a restart", pattern: mentions("restart", "kill", "kubelet")},
      { label: "explains readiness controls traffic/endpoints", pattern: mentions("traffic", "endpoint", "service")},
      { label: "notes alive-but-not-ready is a normal state", pattern: mentions("warming", "starting up", "not ready yet", "temporary") },
      { label: "ties readiness to zero-downtime rollouts", pattern: mentions("rolling update", "zero-downtime", "zero downtime", "rollout") },
    ],
    commonMistake: "Explaining what each probe does without explaining why using the same check for both is a real, common misconfiguration.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-crashloopbackoff",
    category: "Kubernetes", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "How do you troubleshoot a Pod stuck in CrashLoopBackOff?",
    modelAnswer: "First I'd clarify whether it's crashing on every restart or intermittently, since that changes where I look. Cheap check: kubectl describe pod gives the recent Events and the last termination reason and exit code in one place — that alone often points straight at the cause. The critical command here is kubectl logs podname --previous, because the current instance's logs are often nearly empty since it just started — the actual crash output is sitting in the previous instance's logs. From there I'd narrow down based on what I see: exit code 1 usually means an application error I need to read in the logs, exit code 137 means it was OOMKilled and I need to check the memory limit against actual usage, and a missing ConfigMap or Secret reference shows up directly in the describe output as a mount or env error. Once I've found the actual cause — bad config, insufficient memory limit, a missing dependency — I'd fix that root cause and confirm with rollout status, not just watch the restart count stop climbing. To prevent it recurring, I'd make sure the deploy pipeline validates config and sets sane resource requests before it ever reaches the cluster.",
    checklist: [
      { label: "uses kubectl describe pod for events/exit code", pattern: mentions("describe pod", "exit code", "events") },
      { label: "uses kubectl logs --previous", pattern: mentions("--previous", "previous") },
      { label: "interprets a specific exit code like 137/OOMKilled", pattern: mentions("137", "oomkilled", "oom") },
      { label: "confirms fix with rollout status, not just restart count", pattern: mentions("rollout status", "confirm") },
    ],
    commonMistake: "Only checking kubectl logs on the current Pod and missing that the actual crash output is in the previous instance's logs.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-service-unreachable-external",
    category: "Kubernetes", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "A Deployment succeeded but the app isn't reachable externally. Walk me through it.",
    modelAnswer: "I'd clarify first whether it's unreachable from outside only, or from inside the cluster too — that immediately splits the problem in half. Cheap check: kubectl get pods to confirm they're actually Running and Ready, not just scheduled. Next, kubectl get endpointslices for the Service — if that's empty, the Service's selector doesn't match the Pod labels, which is the single most common cause and has nothing to do with anything external yet. If endpoints look correct, I'd narrow down the external path — is this going through a NodePort, a LoadBalancer, or an Ingress. For Ingress specifically I'd check that an Ingress controller is actually installed and that ingressClassName matches it, since an Ingress object with no matching controller looks perfectly valid but routes nothing. I'd also check DNS resolution and, for a LoadBalancer, whether the external IP is still pending. Once I've isolated the layer, the fix is usually a selector typo, a missing Ingress controller, or a firewall/security group blocking the port; to prevent it, I'd add a post-deploy smoke test that actually curls the external URL, not just checks that the Deployment rolled out.",
    checklist: [
      { label: "splits internal vs external reachability", pattern: mentions("inside the cluster", "internal", "external") },
      { label: "checks Service endpoints for selector mismatch", pattern: mentions("endpoint", "selector") },
      { label: "checks Ingress controller / ingressClassName", pattern: mentions("ingress controller", "ingressclassname", "ingress class") },
      { label: "mentions a post-deploy smoke test as prevention", pattern: mentions("smoke test", "curl", "verify", "post-deploy") },
    ],
    commonMistake: "Debugging DNS or firewall rules before checking whether the Service even has any endpoints — an empty endpoint list rules out everything downstream instantly.",
    relatedModule: "Kubernetes",
  },
  {
    id: "k8s-rollout-stuck",
    category: "Kubernetes", difficulty: "Senior", formulaType: "troubleshooting",
    question: "A rollout is stuck — old and new Pods are both running and it's not progressing. What do you check?",
    modelAnswer: "I'd clarify how long it's been stuck versus just mid-rollout, since a RollingUpdate genuinely does run old and new Pods side by side briefly by design. Cheap check: kubectl rollout status deployment/name, which will tell me directly if it's waiting on availability. If it's genuinely stuck, kubectl describe pod on one of the new Pods almost always shows why — commonly a failing readinessProbe that never passes, which means the new ReplicaSet can never satisfy maxUnavailable and the rollout stalls indefinitely rather than failing outright. I'd narrow down whether it's the application itself failing to start correctly with the new image, a config or Secret reference that changed and is now invalid, or a resource request the cluster can't currently satisfy so the new Pods can't even schedule. Once I've found the cause, the fix is either correcting the new revision or rolling back immediately with kubectl rollout undo while I investigate further, since leaving a stalled rollout running doesn't roll back automatically. To prevent this, I'd want a maxSurge/maxUnavailable and readiness probe configuration that's actually been tested, plus a CI gate that catches a broken image before it reaches the cluster at all.",
    checklist: [
      { label: "checks kubectl rollout status", pattern: mentions("rollout status") },
      { label: "identifies readinessProbe as a likely cause of a stalled rollout", pattern: mentions("readiness", "probe") },
      { label: "notes a stalled rollout doesn't auto-rollback", pattern: mentions("doesn't roll back", "no auto", "not automatic", "rollout undo") },
      { label: "checks scheduling/resource constraints on new pods", pattern: mentions("resource", "schedul", "cannot schedule") },
    ],
    commonMistake: "Assuming a stuck rollout will eventually resolve itself, when a failing readiness probe can leave it stalled indefinitely with no automatic rollback.",
    relatedModule: "Kubernetes",
  },

  // ---------------------------------------------------------------------
  // Helm
  // ---------------------------------------------------------------------
  {
    id: "helm-chart",
    category: "Helm", difficulty: "Junior", formulaType: "concept",
    question: "What is a Helm chart, and why not just apply raw manifests?",
    modelAnswer: "A Helm chart is a packaged, templated set of Kubernetes manifests plus a values file that parameterizes them — instead of hand-editing raw YAML for every environment, you template the parts that actually change, like replica count, image tag, or resource limits, and drive them from values.yaml. The benefit over raw manifests is reuse and consistency — the same chart can deploy to dev, staging, and prod with different values files instead of maintaining near-duplicate YAML trees that drift out of sync. In my own project I kept both a Helm chart and the raw manifests side by side specifically as a learning comparison — the raw manifests are easier to read line by line when you're first learning what a Deployment or Service actually needs, while the chart shows how that same structure gets parameterized for reuse. The gotcha with Helm is that templating logic can get genuinely hard to read once you're several {{ if }} blocks deep, so helm template is worth running locally to see the actual rendered YAML before you trust what you're about to apply.",
    checklist: [
      { label: "explains templating + values.yaml parameterization", pattern: mentions("template", "values.yaml", "parameteriz") },
      { label: "explains reuse across environments", pattern: mentions("reuse", "environment", "dev", "staging", "prod") },
      { label: "mentions helm template for previewing rendered output", pattern: mentions("helm template", "rendered", "render") },
    ],
    commonMistake: "Describing Helm as 'just a way to install things' without explaining the actual templating and values mechanism that makes it useful.",
    relatedModule: "Helm",
  },
  {
    id: "helm-release-rollback",
    category: "Helm", difficulty: "Mid-level", formulaType: "concept",
    question: "What is a Helm release, and how does rollback work?",
    modelAnswer: "A release is a specific deployed instance of a chart with a given set of values — the same chart can be installed multiple times under different release names, each tracked independently. Helm keeps a revision history for every release, so each helm upgrade creates a new numbered revision rather than overwriting anything blindly. That history is exactly what makes helm rollback releasename revisionNumber possible — it reverts the release to a previously recorded set of rendered manifests, the same way kubectl rollout undo works for a Deployment, just at the chart level instead of a single resource. The gotcha is that rollback reverts what Helm manages, but it doesn't automatically undo anything that changed outside of Helm's tracking, like a manually-applied Secret or a resource edited directly with kubectl — those are untouched by a Helm rollback.",
    checklist: [
      { label: "explains a release as a deployed chart instance", pattern: mentions("release", "instance", "deployed")},
      { label: "explains revision history tracking", pattern: mentions("revision", "history")},
      { label: "explains helm rollback command", pattern: mentions("helm rollback", "rollback") },
      { label: "notes rollback doesn't touch things changed outside Helm", pattern: mentions("outside", "manually", "kubectl edit", "untracked") },
    ],
    commonMistake: "Confusing a Helm release with the chart itself — the same chart can produce many independent releases.",
    relatedModule: "Helm",
  },
  {
    id: "helm-template-lint",
    category: "Helm", difficulty: "Junior", formulaType: "concept",
    question: "Why would you run helm template or helm lint before helm install?",
    modelAnswer: "helm template renders the chart locally without touching the cluster at all — it's the way to see the actual YAML your values are going to produce, which is essential once templating logic gets nested with conditionals and loops, because it's easy to get a values change subtly wrong and not realize until you see the rendered output. helm lint is a separate, faster check that looks for structural problems in the chart itself — missing required values, malformed YAML, common chart authoring mistakes — before you even get to rendering. I'd run both as a normal part of the workflow: lint to catch chart-authoring mistakes quickly, then template to actually eyeball the rendered manifests before committing to helm install or helm upgrade. The gotcha is that helm template validates locally, not against the live cluster's API — it won't catch something like an invalid apiVersion for your specific cluster version, which is what --dry-run=server on the actual install would additionally catch.",
    checklist: [
      { label: "explains helm template renders locally without deploying", pattern: mentions("template", "render", "without deploying", "local") },
      { label: "explains helm lint checks chart structure", pattern: mentions("lint", "structural", "chart authoring") },
      { label: "notes template doesn't validate against the live cluster", pattern: mentions("live cluster", "server", "dry-run=server", "api version") },
    ],
    commonMistake: "Treating helm template as equivalent to a full cluster-side validation, when it only renders locally and can't catch cluster-specific API issues.",
    relatedModule: "Helm",
  },

  // ---------------------------------------------------------------------
  // Terraform
  // ---------------------------------------------------------------------
  {
    id: "terraform-state",
    category: "Terraform", difficulty: "Junior", formulaType: "concept",
    question: "What is Terraform state, and why does it matter?",
    modelAnswer: "State is Terraform's record of what it believes actually exists in the real world, mapped to your configuration — without it, Terraform would have no way to know whether a resource in your .tf files already exists, needs to be created, or has drifted from what you declared. Every plan and apply reads that state first to compute the difference between desired and actual. The reason it matters so much operationally is that state has to be shared safely across a team — if two people run apply against local state files at the same time, they can corrupt each other's changes, which is exactly why remote state with locking, like an S3 backend with DynamoDB locking, exists. The gotcha people hit is manual changes made directly in the cloud console — Terraform's state doesn't know about them, so the next plan either wants to 'fix' your manual change back to what's declared, or worse, wants to recreate a resource entirely if the drift is severe enough.",
    checklist: [
      { label: "explains state as the desired-vs-actual mapping", pattern: mentions("mapping", "actual", "real world", "desired state") },
      { label: "mentions remote state and locking for teams", pattern: mentions("remote state", "locking", "s3", "dynamodb") },
      { label: "mentions drift from manual console changes", pattern: mentions("drift", "manual", "console") },
    ],
    commonMistake: "Describing state as just 'a file Terraform keeps' without explaining why remote state and locking matter for a real team.",
    relatedModule: "Terraform",
  },
  {
    id: "terraform-plan-apply",
    category: "Terraform", difficulty: "Junior", formulaType: "concept",
    question: "What's the purpose of terraform plan versus apply?",
    modelAnswer: "plan computes and shows the difference between your current state and your configuration without actually changing anything — it's a dry run that tells you exactly what will be created, changed, or destroyed. apply is what actually executes those changes against real infrastructure. The reason plan matters so much is that it's the only real safety check before a destructive change reaches production — reviewing a plan output that unexpectedly shows a resource being destroyed and recreated, instead of just updated in place, is often the only warning you get before real data loss. In any serious pipeline, plan should run and be reviewed — ideally by a human, or at minimum checked for anything destructive — before apply is ever allowed to run automatically. The gotcha is that plan's output can go stale if something changes between generating the plan and running apply, which is why some setups save the plan output to a file and apply that exact saved plan rather than re-planning at apply time.",
    checklist: [
      { label: "explains plan is a dry run / preview", pattern: mentions("dry run", "preview", "without changing")},
      { label: "explains apply actually executes changes", pattern: mentions("execute", "actually change", "apply")},
      { label: "mentions reviewing plan for destructive changes before apply", pattern: mentions("destroy", "destructive", "review") },
    ],
    commonMistake: "Not mentioning that plan output should actually be reviewed for destructive changes before apply runs — that's the real reason the two-step process exists.",
    relatedModule: "Terraform",
  },
  {
    id: "terraform-modules",
    category: "Terraform", difficulty: "Mid-level", formulaType: "concept",
    question: "When would you reach for a Terraform module?",
    modelAnswer: "A module is a reusable, self-contained group of resources with defined inputs and outputs — I'd reach for one whenever I'm repeating the same pattern of resources across environments or projects, like a VPC with public and private subnets, or a standard EC2-plus-security-group pairing. Instead of copy-pasting the same block of resources into every environment's config and letting them slowly drift apart, a module lets you define that pattern once and instantiate it multiple times with different inputs. In my own infrastructure I used the community terraform-aws-modules/vpc and terraform-aws-modules/eks modules rather than writing that from scratch, since VPC and EKS cluster setup is exactly the kind of well-understood, repeatable pattern where reinventing it adds risk without adding value. The gotcha is over-modularizing too early — wrapping a single resource in its own module before you actually have a second use case just adds indirection without the reuse benefit that justifies it.",
    checklist: [
      { label: "explains a module as reusable resource grouping", pattern: mentions("reusable", "reuse", "group of resources") },
      { label: "gives a concrete repeated-pattern example", pattern: mentions("vpc", "subnet", "security group", "pattern") },
      { label: "mentions avoiding premature/over modularization", pattern: mentions("premature", "over-modulariz", "too early", "second use case") },
    ],
    commonMistake: "Saying 'modules are for organizing code' without explaining the actual reuse-across-environments motivation.",
    relatedModule: "Terraform",
  },
  {
    id: "terraform-state-lock-stuck",
    category: "Terraform", difficulty: "Senior", formulaType: "troubleshooting",
    question: "A terraform apply has a state lock that never releases. How do you recover safely?",
    modelAnswer: "First I'd clarify whether there's actually still a real apply running somewhere — CI, another engineer's terminal — because force-unlocking while a genuine operation is in progress can corrupt state, so that check comes before anything else. Cheap check: look at who or what holds the lock, which the lock info usually shows, including a timestamp. If I've confirmed nothing is genuinely running, I'd back up the current state file before touching anything. Then I'd use terraform force-unlock with the specific lock ID rather than deleting the lock entry directly in the backend — for example, never manually delete a DynamoDB lock item without being certain of what you're clearing. Once unlocked, I would not immediately apply — I'd run terraform plan first to see whether state is actually consistent with reality before trusting it enough to apply again. To prevent this, the underlying cause is usually a crashed CI job or a killed terminal session that never released its lock cleanly, so making sure pipeline steps have proper timeout and cleanup handling reduces how often this happens.",
    checklist: [
      { label: "checks whether an operation is genuinely still running first", pattern: mentions("still running", "genuinely running", "in progress") },
      { label: "backs up state before acting", pattern: mentions("back up", "backup") },
      { label: "uses terraform force-unlock with the lock ID", pattern: mentions("force-unlock", "lock id") },
      { label: "runs plan before the next apply, not straight to apply", pattern: mentions("plan first", "run plan", "before apply") },
    ],
    commonMistake: "Force-unlocking immediately without first confirming no genuine operation is still running — that's exactly how you corrupt shared state.",
    relatedModule: "Terraform",
  },

  // ---------------------------------------------------------------------
  // Ansible
  // ---------------------------------------------------------------------
  {
    id: "ansible-agentless",
    category: "Ansible", difficulty: "Junior", formulaType: "concept",
    question: "What makes Ansible agentless, and why does that matter?",
    modelAnswer: "Ansible doesn't require any persistent agent or daemon installed on the machines it manages — it connects over plain SSH from a control node, pushes a small Python payload temporarily, executes the task, and cleans up after itself. That's the contrast with tools that need an installed agent phoning home constantly. The practical benefit is a much lower operational burden — nothing extra to install, patch, or keep running on every managed host, and no agent-to-controller trust relationship to maintain beyond SSH access you probably already have. The gotcha is that this means Ansible's execution speed and reliability depend entirely on SSH connectivity and the target having Python available — a host with SSH locked down differently, or missing the Python interpreter Ansible expects, can fail in ways that look like an Ansible bug but are really an environment mismatch.",
    checklist: [
      { label: "explains connecting via SSH, no persistent agent", pattern: mentions("ssh", "no agent", "agentless", "persistent")},
      { label: "contrasts with agent-based tools", pattern: mentions("agent", "daemon")},
      { label: "mentions SSH/Python as a dependency gotcha", pattern: mentions("python", "ssh connectivity", "interpreter") },
    ],
    commonMistake: "Saying 'Ansible doesn't need anything installed' without qualifying that it still needs SSH access and Python on the target.",
    relatedModule: "Ansible",
  },
  {
    id: "ansible-inventory",
    category: "Ansible", difficulty: "Junior", formulaType: "concept",
    question: "What is an Ansible inventory, and how do you target hosts with it?",
    modelAnswer: "An inventory is the list of managed hosts, organized into groups, that Ansible knows how to reach — it can be a static INI or YAML file, or generated dynamically from a cloud provider's API for environments where hosts come and go. Groups let you target a subset of hosts in a playbook, like hosts: web to run a play only against your web tier, or hosts: all for something that applies everywhere. You can also nest groups and define group-level or host-level variables directly in the inventory, which is how you'd set something like an environment-specific variable without repeating it per host. The gotcha is static inventories going stale in a dynamic environment — if hosts are being created and destroyed by autoscaling and the inventory isn't updated to match, Ansible either can't reach a new host at all or tries to configure a host that no longer exists.",
    checklist: [
      { label: "explains inventory as a list of hosts in groups", pattern: mentions("hosts", "group")},
      { label: "mentions static vs dynamic inventory", pattern: mentions("dynamic", "static", "cloud provider")},
      { label: "explains targeting a group in a playbook", pattern: mentions("hosts:", "target", "play")},
      { label: "notes stale inventory in dynamic/autoscaled environments", pattern: mentions("stale", "autoscal", "dynamic environment") },
    ],
    commonMistake: "Only describing inventory as 'a list of IPs' without mentioning groups and how a play actually targets a subset of hosts.",
    relatedModule: "Ansible",
  },
  {
    id: "ansible-idempotency",
    category: "Ansible", difficulty: "Mid-level", formulaType: "concept",
    question: "What does idempotency mean in Ansible, and why does it matter practically?",
    modelAnswer: "Idempotent means running the same playbook against a host that's already in the desired state produces no changes — Ansible checks current state before acting, so a task like 'ensure this package is installed' does nothing on a second run if the package is already there, instead of blindly re-running an install command every time. That matters practically because it's what makes a playbook safe to re-run at any time, for any reason, without worrying about side effects piling up — you can rerun it after a failure, on a schedule, or just to confirm drift hasn't crept in, and it converges the host to the declared state rather than repeating actions. The gotcha is that not every module or every task is naturally idempotent — a raw shell or command task that just runs an arbitrary command has no built-in awareness of current state, so it'll re-execute every single run unless you explicitly add a check with something like creates or a conditional, which is a common source of playbooks that aren't actually safe to rerun despite looking like they should be.",
    checklist: [
      { label: "explains no-op on an already-satisfied state", pattern: mentions("no change", "already", "no-op", "already in the desired state") },
      { label: "explains it makes reruns safe", pattern: mentions("safe to rerun", "re-run", "rerun") },
      { label: "notes shell/command tasks aren't automatically idempotent", pattern: mentions("shell", "command module", "raw", "creates") },
    ],
    commonMistake: "Claiming every Ansible task is automatically idempotent, when shell/command tasks specifically need explicit handling to behave that way.",
    relatedModule: "Ansible",
  },
  {
    id: "ansible-handlers",
    category: "Ansible", difficulty: "Mid-level", formulaType: "concept",
    question: "Why use handlers instead of always restarting a service after every task?",
    modelAnswer: "A handler is a task that only runs when it's explicitly notified by another task, and it only fires once at the end of the play even if multiple tasks notify it — which is exactly the behavior you want for something like restarting a service after a config change. If I instead put an unconditional 'restart service' task after every config-related task, I'd be restarting the service on every single playbook run regardless of whether anything actually changed, which causes unnecessary downtime or connection drops for a service that didn't need to restart at all. With a handler, only a task that notice a real change — like a template task that actually rewrote the config file — notifies the handler, so the restart only happens when it's genuinely needed, and even if five different config tasks all notify the same handler, it still only restarts once instead of five times. The gotcha is that handlers run at the end of the play by default, not immediately after the notifying task, so if you need a restart to happen mid-play before a later task depends on it, you need meta: flush_handlers to force it early.",
    checklist: [
      { label: "explains handlers only run when notified", pattern: mentions("notify", "notified")},
      { label: "explains it only fires once even with multiple notifies", pattern: mentions("once", "single restart", "not multiple times") },
      { label: "contrasts with unconditional restart causing unnecessary downtime", pattern: mentions("unnecessary", "every run", "downtime") },
      { label: "mentions handlers run at end of play / flush_handlers", pattern: mentions("end of play", "flush_handlers", "flush handlers") },
    ],
    commonMistake: "Not explaining the 'only restart if something actually changed' benefit, which is the entire reason handlers exist over an unconditional restart task.",
    relatedModule: "Ansible",
  },

  // ---------------------------------------------------------------------
  // CI/CD
  // ---------------------------------------------------------------------
  {
    id: "cicd-ci-vs-cd",
    category: "CI/CD", difficulty: "Junior", formulaType: "concept",
    question: "What's the difference between CI and CD, and why run tests before deploying?",
    modelAnswer: "CI is about integrating code changes frequently and validating them automatically — every push or pull request runs builds, linting, and tests, so problems surface within minutes instead of being discovered days later after multiple people have built on top of a broken change. CD then takes a validated build and gets it into an environment, either continuous delivery, where a human still approves the final release step, or continuous deployment, where it goes out automatically once it passes every gate. The reason tests run before deploy, not after, is that a pipeline is the last cheap checkpoint before a change reaches real users — catching a regression in CI costs a failed build; catching the same regression in production costs an incident, a rollback, and possibly real user impact. The gotcha is a pipeline that has tests but doesn't actually gate on them — if a failing test doesn't block the deploy step, you've built the illusion of safety without the actual safety.",
    checklist: [
      { label: "explains CI as frequent integration + validation", pattern: mentions("integrat", "validat", "build", "lint")},
      { label: "explains CD as getting a build into an environment", pattern: mentions("deploy", "delivery", "release")},
      { label: "explains why catching issues pre-deploy is cheaper", pattern: mentions("cheaper", "cheap", "before it reaches", "before production") },
      { label: "notes tests must actually gate the pipeline to matter", pattern: mentions("gate", "block", "fail the build") },
    ],
    commonMistake: "Defining CI and CD as generic buzzwords without explaining the actual cost difference between catching a bug in CI versus in production.",
    relatedModule: "CI/CD",
  },
  {
    id: "cicd-good-pipeline",
    category: "CI/CD", difficulty: "Mid-level", formulaType: "concept",
    question: "Walk me through what a solid CI/CD pipeline includes end to end.",
    modelAnswer: "I'd start with lint and unit tests on every pull request, so obvious problems are caught before anything even merges. On merge to main, the pipeline builds the artifact — for a containerized app, that means building and tagging Docker images — and I'd tag with something traceable, like the commit SHA, so every deployed image maps back to an exact commit. From there I'd push to a registry, then trigger deployment, ideally gated behind at least one approval for production even if lower environments deploy automatically. After deployment, the pipeline shouldn't just assume success — it should run a verification step that actually confirms the app is healthy and serving real traffic, not just that the deploy command returned successfully. In my own project this is the exact chain — lint and version-bump checks on PRs, then image build and push tagged by commit SHA on merge to main, then an Ansible-triggered deployment, then a separate verification workflow that curls the live endpoint and checks a real product actually comes back in the response before calling the deploy successful.",
    checklist: [
      { label: "mentions lint/tests on PRs", pattern: mentions("lint", "test", "pull request", "pr")},
      { label: "mentions building and tagging an artifact traceably", pattern: mentions("tag", "commit sha", "artifact", "build")},
      { label: "mentions an approval gate for production", pattern: mentions("approval", "gate", "manual")},
      { label: "mentions post-deploy verification, not just assuming success", pattern: mentions("verify", "verification", "healthy", "smoke test") },
    ],
    commonMistake: "Describing the pipeline as ending at 'deploy' without mentioning that a real pipeline verifies the deployment actually succeeded afterward.",
    relatedModule: "CI/CD",
  },
  {
    id: "cicd-push-pull-gitops",
    category: "CI/CD", difficulty: "Senior", formulaType: "concept",
    question: "What's the difference between push-based and pull-based deployment, and what is GitOps?",
    modelAnswer: "Push-based deployment means the CI system itself has credentials to reach into the target environment and apply changes — CI runs kubectl apply or an Ansible playbook directly against production. Pull-based, which is what GitOps is built on, flips that around — an agent running inside the target environment, like Argo CD or Flux, continuously watches a Git repository and reconciles the live state to match what's declared there, so nothing external ever needs standing credentials to push into the cluster. The security benefit is real — push-based CI needs broad, often long-lived credentials to every environment it deploys to, while pull-based only needs the in-cluster agent to have read access to Git, which is a much smaller blast radius if CI itself is ever compromised. GitOps also gives you drift detection for free — since the agent is continuously reconciling, any manual out-of-band change gets flagged or automatically reverted, which push-based CI has no visibility into at all. The gotcha is that GitOps isn't automatically safer if the Git repo itself isn't protected — branch protection and review on the manifests repo matters just as much as it does on the application code repo.",
    checklist: [
      { label: "explains push-based CI applies directly with standing credentials", pattern: mentions("push", "credentials", "standing")},
      { label: "explains pull-based agent reconciling from Git", pattern: mentions("pull", "agent", "reconcil", "argo", "flux")},
      { label: "explains the credential/blast-radius security benefit", pattern: mentions("blast radius", "credential", "compromise", "security")},
      { label: "mentions drift detection as a GitOps benefit", pattern: mentions("drift") },
    ],
    commonMistake: "Describing GitOps as just 'storing manifests in Git' without explaining the actual pull-based reconciliation model that makes it meaningfully different from push-based CI/CD.",
    relatedModule: "CI/CD",
  },
  {
    id: "cicd-protect-prod",
    category: "CI/CD", difficulty: "Mid-level", formulaType: "concept",
    question: "How do you protect production deployments in a pipeline?",
    modelAnswer: "The first layer is a required approval gate before anything reaches production, even if lower environments deploy automatically — that gives a human a chance to catch something automated checks didn't. Second, deployments should use a strategy that limits blast radius, like a rolling update with proper readiness gating, or canary/blue-green for genuinely risky changes, so a bad release affects a fraction of traffic instead of everyone at once. Third, rollback needs to be fast and well-understood — not something you're figuring out for the first time during an incident — so the team should already know exactly how to revert, whether that's kubectl rollout undo, redeploying a previous image tag, or reverting a Git commit in a GitOps setup. Finally, I'd make sure the pipeline has real post-deploy verification, not just a successful deploy command, since a deploy that 'succeeds' but breaks the app is the exact failure mode all the other protections are trying to prevent.",
    checklist: [
      { label: "mentions an approval gate before production", pattern: mentions("approval", "gate", "manual approval") },
      { label: "mentions a deployment strategy limiting blast radius", pattern: mentions("canary", "blue-green", "blue green", "rolling") },
      { label: "mentions rollback being fast and well-known ahead of time", pattern: mentions("rollback", "revert", "undo") },
      { label: "mentions post-deploy verification", pattern: mentions("verif", "smoke test", "health check") },
    ],
    commonMistake: "Only mentioning 'add an approval step' without also covering deployment strategy and rollback readiness, which are equally important production safeguards.",
    relatedModule: "CI/CD",
  },
  {
    id: "cicd-pipeline-secrets",
    category: "CI/CD", difficulty: "Mid-level", formulaType: "concept",
    question: "How do you manage secrets and credentials in a CI/CD pipeline?",
    modelAnswer: "The starting principle is avoiding long-lived static credentials wherever possible — for cloud deployments, OIDC federation lets the pipeline assume a short-lived, scoped role directly instead of storing a permanent access key that has to be rotated manually and is a standing risk if it ever leaks. For anything that does need a stored secret, it belongs in the CI platform's own encrypted secret store, like GitHub Actions secrets, never hardcoded in a workflow file or committed to the repo. Within the pipeline itself, secrets should be scoped as narrowly as possible — a deployment step needs deploy credentials, a build step generally doesn't need production database access, and giving every step the same broad credentials is exactly how a compromised or misconfigured step turns into a much bigger incident than it needed to be. In my own project this is a genuine gap I'm upfront about — the deployment SSH key and registry credentials are stored properly as GitHub Actions secrets, but the committed Kubernetes Secret manifest is explicitly flagged as local/demo-only, not something I'd consider production-safe, and moving to something like Sealed Secrets or a cloud secrets manager is the next real step.",
    checklist: [
      { label: "mentions OIDC or short-lived credentials over static keys", pattern: mentions("oidc", "short-lived", "long-lived", "static credential") },
      { label: "mentions the CI platform's encrypted secret store", pattern: mentions("secret store", "encrypted", "github actions secret") },
      { label: "mentions scoping secrets narrowly per step", pattern: mentions("scope", "narrow", "least privilege") },
      { label: "is honest about a real gap in their own setup", pattern: mentions("demo", "local", "not production", "gap") },
    ],
    commonMistake: "Giving a textbook answer about secrets management without being able to speak honestly about how their own project actually handles it, including its gaps.",
    relatedModule: "CI/CD",
  },
  {
    id: "cicd-works-dev-fails-prod",
    category: "CI/CD", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "A pipeline works fine in dev but fails when deploying to production. How do you debug it?",
    modelAnswer: "First I'd clarify exactly which stage fails — build, push, or the deploy step itself — since that narrows the search space immediately. Cheap check: read the actual failure message from the pipeline logs rather than assuming; a permissions error looks nothing like a network timeout or a missing resource. From there I'd compare environment parity — are the credentials for prod actually valid and scoped correctly, is there a firewall or security group difference between dev and prod that dev never hits, and are prod-specific variables or secrets actually configured, since a missing prod-only secret is one of the most common causes of exactly this symptom. I'd also check whether prod has stricter approval or protection rules that dev doesn't, which can fail in a way that looks like a technical error but is actually a policy gate. Once I've isolated it — commonly expired or missing prod credentials, or a network path that's blocked in prod but open in dev — I'd fix that specific gap. To prevent it, keeping dev and prod pipeline configuration as close to identical as possible, with only the necessary environment-specific values different, avoids this whole class of 'works here, not there' failure.",
    checklist: [
      { label: "identifies which stage actually fails first", pattern: mentions("which stage", "which step", "narrow")},
      { label: "reads the actual failure message/logs", pattern: mentions("log", "error message", "failure message")},
      { label: "compares credentials/permissions between environments", pattern: mentions("credential", "permission", "iam", "expired")},
      { label: "mentions keeping environments close to identical to prevent recurrence", pattern: mentions("parity", "identical", "consistent", "same configuration") },
    ],
    commonMistake: "Guessing at network or firewall causes before actually reading the specific error the pipeline reported.",
    relatedModule: "CI/CD",
  },

  // ---------------------------------------------------------------------
  // Cloud & AWS
  // ---------------------------------------------------------------------
  {
    id: "aws-security-groups",
    category: "Cloud & AWS", difficulty: "Junior", formulaType: "concept",
    question: "How do EC2 security groups work?",
    modelAnswer: "A security group is a stateful virtual firewall attached to an instance's network interface — you define inbound and outbound rules by protocol, port, and source, and because it's stateful, a response to an allowed inbound request is automatically allowed back out without needing a matching outbound rule. Multiple security groups can attach to one instance, and the effective rule set is the union of all of them, so it's easy to accidentally over-grant access by attaching a group that's broader than intended. The gotcha, and something I'd be honest about from my own setup, is opening SSH or HTTP to 0.0.0.0/0 as a demo shortcut — that's fine for a short-lived learning environment, but I know it's not something to carry into anything production-facing, where SSH access should be scoped to a specific IP range or go through a bastion or SSM Session Manager instead of being open to the entire internet.",
    checklist: [
      { label: "explains stateful inbound/outbound rules", pattern: mentions("stateful", "inbound", "outbound") },
      { label: "explains multiple groups combine as a union", pattern: mentions("union", "multiple security group", "combine") },
      { label: "names the 0.0.0.0/0 SSH exposure risk", pattern: mentions("0.0.0.0/0", "open to the internet", "public")},
      { label: "mentions a safer alternative like SSM or a bastion", pattern: mentions("ssm", "bastion", "session manager") },
    ],
    commonMistake: "Explaining security groups purely in the abstract without being able to speak to a real security trade-off they've actually made, like an open SSH rule in a demo environment.",
    relatedModule: "Cloud & AWS",
  },
  {
    id: "aws-vpc-subnets",
    category: "Cloud & AWS", difficulty: "Mid-level", formulaType: "concept",
    question: "What's the difference between public and private subnets in a VPC, and why does it matter?",
    modelAnswer: "A public subnet has a route to an internet gateway, so resources in it can have a public IP and be reached directly from the internet. A private subnet has no direct route to an internet gateway — anything in it can't be reached from outside directly, and if it needs outbound internet access at all, that goes through a NAT gateway sitting in a public subnet instead. The reason this separation matters is blast radius and exposure — you want things like load balancers or bastion hosts in public subnets since they're meant to be internet-facing, but application servers, databases, and worker nodes belong in private subnets where they simply aren't reachable from outside no matter what security group rules say, because there's no network path there at all. In my own EKS setup, the cluster's node groups sit in private subnets while only the public subnets are tagged for the load balancer to use — so even if a security group were misconfigured, the nodes still wouldn't be directly internet-reachable, since network routing is a more fundamental control than security group rules.",
    checklist: [
      { label: "explains public subnet has internet gateway route", pattern: mentions("internet gateway", "public subnet") },
      { label: "explains private subnet has no direct route / uses NAT", pattern: mentions("private subnet", "nat gateway", "no route") },
      { label: "explains why app/db workloads belong in private subnets", pattern: mentions("blast radius", "not reachable", "exposure") },
      { label: "ties to a real setup like EKS node groups", pattern: mentions("eks", "node group", "cluster") },
    ],
    commonMistake: "Explaining public vs private subnets purely by 'has a public IP or not' without explaining that routing, not just IP assignment, is the actual control.",
    relatedModule: "Terraform",
  },
  {
    id: "aws-autoscaling-nodegroups",
    category: "Cloud & AWS", difficulty: "Mid-level", formulaType: "concept",
    question: "What does an EKS managed node group actually do, and how does scaling work?",
    modelAnswer: "A managed node group is AWS handling the lifecycle of the EC2 instances that back your Kubernetes worker nodes — provisioning, patching, and replacing them, so you're not manually managing an Auto Scaling Group's launch template by hand for Kubernetes-specific concerns. You configure a min, max, and desired size, and the node group's underlying Auto Scaling Group keeps that many instances running, joining them to the cluster automatically. That's separate from the Kubernetes-level Horizontal Pod Autoscaler — HPA scales the number of Pod replicas based on metrics, while node group scaling, or a Cluster Autoscaler on top of it, scales the number of actual machines available to schedule those Pods onto. In my own Terraform setup I've got a node group configured with min 2, max 4, desired 2 — meaning it always runs at least 2 nodes for baseline availability, and can grow to 4 if the cluster genuinely needs more scheduling capacity, though I'd need Cluster Autoscaler actually wired in for that scaling to happen automatically in response to real pending-Pod pressure rather than just being a static ceiling.",
    checklist: [
      { label: "explains AWS manages EC2 lifecycle for worker nodes", pattern: mentions("lifecycle", "provision", "patch", "manage")},
      { label: "explains min/max/desired size", pattern: mentions("min", "max", "desired")},
      { label: "distinguishes HPA (pods) from node scaling (machines)", pattern: mentions("hpa", "horizontal pod autoscaler", "pod replicas") },
      { label: "mentions Cluster Autoscaler as the actual trigger for node scaling", pattern: mentions("cluster autoscaler") },
    ],
    commonMistake: "Conflating HPA and node-group/cluster autoscaling as the same thing — one scales Pods, the other scales the machines Pods run on.",
    relatedModule: "Terraform",
  },
  {
    id: "aws-lb-unreachable",
    category: "Cloud & AWS", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "An app behind a load balancer is suddenly unreachable. How do you troubleshoot it?",
    modelAnswer: "I'd clarify first whether it's fully down or intermittent, and whether this followed a recent deploy — that timing is often the biggest clue. Cheap check: the load balancer's own target health view — if targets show unhealthy, the problem is likely the application or its health check, not the network path. I'd verify the health check path actually returns a healthy response directly on the instance, not just assume it does, since a changed health check path or port after a deploy is a common self-inflicted cause. If targets look healthy but traffic still isn't getting through, I'd narrow down to security groups next — confirming the load balancer's security group can actually reach the instance's security group on the health check and traffic ports. From there I'd check the instance itself — is the application process actually running, what do its logs show, and is the instance under memory or disk pressure. Once I've isolated the actual layer — bad health check config, a security group rule, or the app itself crashed — I'd fix that specific thing and confirm targets go healthy again before considering it resolved.",
    checklist: [
      { label: "checks target health status first", pattern: mentions("target health", "unhealthy", "healthy")},
      { label: "verifies the health check path/port directly", pattern: mentions("health check", "/health", "port")},
      { label: "checks security group rules between LB and instance", pattern: mentions("security group")},
      { label: "checks the application/instance itself as a final layer", pattern: mentions("logs", "process", "instance", "cpu", "memory", "disk") },
    ],
    commonMistake: "Jumping straight to checking the instance's OS-level health before first checking whether the load balancer even considers the target healthy.",
    relatedModule: "Terraform",
  },

  // ---------------------------------------------------------------------
  // DevOps fundamentals
  // ---------------------------------------------------------------------
  {
    id: "devops-fundamentals-meaning",
    category: "DevOps fundamentals", difficulty: "Junior", formulaType: "concept",
    question: "What does DevOps actually mean to you, day to day?",
    modelAnswer: "To me it's less a job title and more a set of practices around closing the gap between writing software and actually running it reliably — automation instead of manual repeatable steps, infrastructure defined as code instead of hand-configured servers, and fast, safe feedback loops so a problem is caught in minutes, not discovered days later in production. Day to day that looks like maintaining CI/CD pipelines so changes ship safely and repeatably, writing infrastructure as code so environments are consistent and reviewable instead of drifting apart, and building enough observability that when something does break, I can actually see why quickly instead of guessing. The part people sometimes miss is that it's also genuinely about collaboration — a deploy pipeline and a monitoring dashboard don't fix a culture where developers and operations don't talk until something's already on fire; the tooling supports the collaboration, it doesn't replace it.",
    checklist: [
      { label: "mentions automation and IaC", pattern: mentions("automation", "infrastructure as code", "iac") },
      { label: "mentions fast feedback loops", pattern: mentions("feedback", "fast", "quickly") },
      { label: "names concrete daily practices", pattern: mentions("ci/cd", "pipeline", "observability", "monitoring") },
      { label: "mentions the collaboration/culture angle, not just tooling", pattern: mentions("collaboration", "culture", "developers and operations") },
    ],
    commonMistake: "Giving a purely tool-list answer ('Docker, Kubernetes, Terraform') without connecting it to the actual reliability and collaboration goals those tools serve.",
    relatedModule: "DevOps fundamentals",
  },
  {
    id: "devops-iac-value",
    category: "DevOps fundamentals", difficulty: "Junior", formulaType: "concept",
    question: "Why is infrastructure as code useful instead of clicking through a console?",
    modelAnswer: "Code you can version, review, and diff — a console click leaves no trail, no review step, and no way to see exactly what changed between two points in time. With IaC, a change to infrastructure goes through the same discipline as an application code change — a pull request, a diff someone can actually read, a plan showing exactly what will happen before it happens. It also makes environments genuinely reproducible — spinning up a second environment that matches production isn't a multi-hour manual checklist prone to human error, it's applying the same configuration again. The gotcha is that IaC only delivers that benefit if it's actually the source of truth — if people still make manual changes in the console 'just this once' alongside a Terraform-managed environment, you get drift, and the next apply either fights the manual change or the state file simply doesn't reflect reality anymore.",
    checklist: [
      { label: "mentions version control / review / diffability", pattern: mentions("version", "review", "diff", "pull request") },
      { label: "mentions reproducibility of environments", pattern: mentions("reproducib", "reproduce", "consistent")},
      { label: "notes drift if manual changes bypass IaC", pattern: mentions("drift", "manual change", "bypass") },
    ],
    commonMistake: "Only mentioning 'it's faster' without mentioning the review/audit trail and drift-prevention benefits, which are usually the stronger argument.",
    relatedModule: "Terraform",
  },
  {
    id: "devops-immutable-infra",
    category: "DevOps fundamentals", difficulty: "Mid-level", formulaType: "concept",
    question: "What is immutable infrastructure?",
    modelAnswer: "Instead of patching or modifying a running server in place, you build a new version — a new image or a new instance — and replace the old one entirely, rather than SSHing in and changing things live. The value is consistency and predictability — a server that's been manually patched a dozen times over months can end up in a state nobody fully understands or can reproduce, sometimes called configuration drift or 'snowflake' servers, while a freshly-built replacement from the same versioned image is identical every time, in every environment. Containers are a natural fit for this — you don't patch a running container, you build a new image with the fix and replace the container, which is exactly the model Kubernetes rolling updates are built around. The gotcha is that immutability doesn't remove the need for good rollback and health-checking during that replacement — replacing something 'immutably' but pushing a broken version out to everything at once is still a bad rollout, just with cleaner artifacts.",
    checklist: [
      { label: "explains replace-not-patch", pattern: mentions("replace", "rebuild", "new instance", "new image") },
      { label: "mentions configuration drift / snowflake servers as the problem it solves", pattern: mentions("drift", "snowflake", "unpredictab") },
      { label: "ties to containers/Kubernetes rolling updates", pattern: mentions("container", "rolling update", "kubernetes") },
    ],
    commonMistake: "Defining immutable infrastructure without explaining what problem it actually solves — configuration drift and unreproducible servers.",
    relatedModule: "Docker",
  },
  {
    id: "devops-observability",
    category: "DevOps fundamentals", difficulty: "Mid-level", formulaType: "concept",
    question: "What's the difference between metrics, logs, and traces?",
    modelAnswer: "Metrics are numeric time series — request counts, latency percentiles, error rates — cheap to store and great for dashboards and alerting on trends, but they don't tell you the story of any single request. Logs are individual event records with context, useful for understanding exactly what happened for a specific request or error, but expensive to store at scale and hard to correlate across services without good structure. Traces show a single request's path across multiple services, with timing at each hop, which is what actually lets you answer 'where in this whole chain did the extra 400ms come from' in a microservices system where a metric alone just tells you latency went up somewhere. In my own project I've only really implemented the metrics layer so far — the backend exposes request count and duration metrics through prom-client, with a ServiceMonitor for a Prometheus Operator setup to scrape them — logs and traces are genuinely the next layer I'd add for a fuller observability picture, and I'd say that honestly rather than pretend I've built all three.",
    checklist: [
      { label: "explains metrics as numeric time series for trends", pattern: mentions("time series", "numeric", "trend", "dashboard") },
      { label: "explains logs as event-level context", pattern: mentions("log", "event", "context") },
      { label: "explains traces as cross-service request flow", pattern: mentions("trace", "trac", "request path", "microservices") },
      { label: "is honest about what's actually implemented in their own project", pattern: mentions("prom-client", "prometheus", "servicemonitor", "next layer") },
    ],
    commonMistake: "Reciting textbook definitions of the three pillars without being able to say honestly which ones are actually implemented in a project they've built.",
    relatedModule: "Kubernetes",
  },
  {
    id: "devops-slo-error-budget",
    category: "DevOps fundamentals", difficulty: "Senior", formulaType: "concept",
    question: "What is an SLO and an error budget, in practical terms?",
    modelAnswer: "An SLO is a target for how reliable a service should be — say, 99.9% of requests succeed over a rolling window. The error budget is just the inverse of that — the amount of allowed unreliability, which for 99.9% is roughly 43 minutes of downtime a month. The practical value of framing it this way is that it turns reliability into a number you can actually make decisions with — if the error budget is nearly exhausted, that's a real, quantified signal to slow down risky releases and focus on stability; if there's plenty of budget left, that's justification to ship faster and take on more calculated risk, instead of everyone just arguing based on gut feeling about how careful to be. Burn rate is how fast you're consuming that budget — a multi-window alert setup, combining a short window to catch a fast, severe burn and a longer window to catch a slow, sustained one, avoids both false alarms from brief blips and missing a real slow leak. The gotcha is picking an SLO that isn't actually tied to what users care about — 99.99% uptime on a metric that doesn't reflect real user-facing failures is a number that looks impressive and means very little.",
    checklist: [
      { label: "explains SLO as a reliability target", pattern: mentions("target", "reliability", "99")},
      { label: "explains error budget as allowed unreliability", pattern: mentions("error budget", "allowed", "budget")},
      { label: "explains burn rate and using budget for release-pace decisions", pattern: mentions("burn rate", "slow down", "release pace", "risk") },
      { label: "mentions multi-window alerting or SLOs tied to real user impact", pattern: mentions("multi-window", "user", "false alarm") },
    ],
    commonMistake: "Defining SLO and error budget correctly but not connecting them to an actual decision they inform, like pacing releases.",
    relatedModule: "Kubernetes",
  },
  {
    id: "devops-config-drift",
    category: "DevOps fundamentals", difficulty: "Mid-level", formulaType: "concept",
    question: "What is configuration drift, and how do you prevent it?",
    modelAnswer: "Drift is when a system's actual running configuration diverges from what's declared in your source of truth — someone SSHes in and tweaks a setting directly, or clicks a change in a cloud console, and now the live environment no longer matches what your Terraform or Ansible configuration says it should be. It matters because it quietly breaks the guarantee that your infrastructure-as-code actually reflects reality — the next time someone applies that configuration expecting it to be a no-op, it either silently reverts a manual fix that was actually needed, or the tooling gets confused about what state it's even reconciling from. Preventing it starts with discipline — no direct manual changes to anything managed by code, full stop — but discipline alone doesn't scale, so I'd also want regular automated drift detection, like a scheduled terraform plan or an Ansible check-mode run that alerts if it finds unexpected differences, so drift gets caught within hours instead of being discovered accidentally months later during an actual incident.",
    checklist: [
      { label: "explains drift as actual state diverging from declared config", pattern: mentions("diverge", "divergen", "actual", "declared")},
      { label: "gives a concrete cause like manual console/SSH changes", pattern: mentions("manual", "ssh", "console")},
      { label: "mentions discipline of not bypassing IaC", pattern: mentions("discipline", "no manual", "bypass")},
      { label: "mentions automated drift detection", pattern: mentions("drift detection", "scheduled plan", "check-mode", "check mode") },
    ],
    commonMistake: "Only saying 'don't make manual changes' without acknowledging that discipline alone doesn't scale and automated detection is still needed.",
    relatedModule: "Ansible",
  },

  // ---------------------------------------------------------------------
  // Troubleshooting & scenarios
  // ---------------------------------------------------------------------
  {
    id: "scenario-prod-rollout-fails",
    category: "Troubleshooting & scenarios", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "A production deployment fails mid-rollout. What do you do, in order?",
    modelAnswer: "First, I assess blast radius — how many users or requests are actually affected right now, since that determines urgency. Cheap and immediate: roll back first, investigate second — for a mid-rollout failure, restoring service takes priority over root-causing it live in production, so kubectl rollout undo or redeploying the last known-good version happens before I go digging into why. While that's happening I'd communicate in whatever incident channel the team uses, so people aren't independently discovering the outage and duplicating investigation effort. Once service is restored, I'd narrow down the actual cause using the failed rollout's logs and events, which are still available even after rolling back. Once I understand the root cause, I'd write it up, and for anything with real user impact, run a blameless postmortem focused on what process or safeguard would have caught this earlier, not on who pushed the change.",
    checklist: [
      { label: "assesses blast radius/impact first", pattern: mentions("blast radius", "impact", "affected") },
      { label: "rolls back before investigating live in prod", pattern: mentions("roll back", "rollback", "restore service", "undo") },
      { label: "communicates to the team/incident channel", pattern: mentions("communicat", "incident channel", "stakeholder") },
      { label: "mentions a blameless postmortem afterward", pattern: mentions("postmortem", "post-mortem", "blameless", "root cause") },
    ],
    commonMistake: "Trying to root-cause the issue live in production before restoring service — restore first, investigate second.",
    relatedModule: "Kubernetes",
  },
  {
    id: "scenario-secret-committed",
    category: "Troubleshooting & scenarios", difficulty: "Senior", formulaType: "troubleshooting",
    question: "A secret was accidentally committed to a public GitHub repository. What's your incident response?",
    modelAnswer: "I'd treat it as compromised the moment it's confirmed public, full stop — no assumption that 'probably nobody saw it' is safe, since scrapers actively watch public repos for exactly this. The very first action is rotating or revoking that credential, before anything else, because rewriting Git history or deleting the file does nothing to protect a secret that's already been exposed — anyone who cloned or cached the repo before the fix still has it. After rotation, I'd check audit logs for that credential to see if it was actually used by anyone unexpected in the exposure window. Then I'd clean the repo history and notify whoever needs to know, including security if there's a formal process for it. Longer term, the real fix is prevention — enabling secret scanning on the repo so this is caught automatically before merge next time, and moving whatever that secret protected into a proper secrets manager instead of being the kind of value that could end up in a commit at all.",
    checklist: [
      { label: "treats it as compromised immediately", pattern: mentions("compromised", "assume", "immediately") },
      { label: "rotates/revokes the credential first, before cleanup", pattern: mentions("rotate", "revoke", "first") },
      { label: "checks audit logs for actual misuse", pattern: mentions("audit log", "check", "misuse") },
      { label: "mentions secret scanning or a secrets manager as prevention", pattern: mentions("secret scanning", "secrets manager", "gitleaks", "prevent") },
    ],
    commonMistake: "Starting with rewriting Git history instead of rotating the credential first — history rewriting doesn't protect an already-exposed secret.",
    relatedModule: "DevOps fundamentals",
  },
  {
    id: "scenario-cost-spike",
    category: "Troubleshooting & scenarios", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "AWS billing spiked suddenly. How do you find the cause?",
    modelAnswer: "I'd clarify the timeframe first — exactly when the spike started narrows down what changed around that time. Cheap check: Cost Explorer grouped by service, which usually surfaces the culprit service immediately rather than requiring a resource-by-resource hunt. From there I'd narrow down further by region and by resource tags — an untagged resource is both a cost mystery and an ownership mystery at the same time, so poor tagging hygiene makes this kind of investigation much slower than it needs to be. Common real causes are an oversized instance left running, a NAT gateway racking up data transfer charges, or a test resource someone spun up and forgot to tear down. Once I've identified the specific resource, the fix is straightforward — right-size or terminate it — but to prevent a repeat, I'd set up budget alerts and cost anomaly detection so a spike like this gets flagged automatically within hours instead of being discovered when the bill arrives.",
    checklist: [
      { label: "starts in Cost Explorer grouped by service", pattern: mentions("cost explorer", "grouped by service") },
      { label: "narrows by region/tags", pattern: mentions("region", "tag") },
      { label: "names a realistic cause like NAT gateway or oversized instance", pattern: mentions("nat gateway", "oversized", "instance size", "untagged") },
      { label: "mentions budget alerts/anomaly detection as prevention", pattern: mentions("budget alert", "anomaly detection", "alert") },
    ],
    commonMistake: "Jumping straight to terminating resources before actually identifying which specific resource or service caused the spike.",
    relatedModule: "Terraform",
  },
  {
    id: "scenario-intermittent-latency",
    category: "Troubleshooting & scenarios", difficulty: "Senior", formulaType: "troubleshooting",
    question: "A service shows latency spikes every 60 seconds. How do you diagnose it?",
    modelAnswer: "The exact periodicity is the biggest clue here, so I'd clarify first whether it's truly every 60 seconds or approximately — a fixed period almost always points to something scheduled rather than organic load. Cheap check: correlate the spike timestamps against anything running on a timer — a health check interval, a cron job, a metrics scrape interval, garbage collection, or a connection pool reaping idle connections on a fixed cycle. I'd narrow down by checking whether the spike is CPU-bound, which would point toward GC or a scheduled compute-heavy task, or I/O-bound, which would point more toward a connection pool cycling or a scheduled external call, like a health check hitting a slow dependency. Traces around the exact spike windows are the most direct evidence, since they'd show exactly which operation is taking the extra time during that window versus a normal request. Once I've matched the pattern to its actual scheduled cause, the fix is usually adjusting that specific interval or making it non-blocking; the discipline worth remembering here is to match the pattern to scheduled behavior before touching any application code, since 'random-looking optimization' on the wrong component wastes time and doesn't fix a periodic root cause.",
    checklist: [
      { label: "treats the fixed period as the key clue", pattern: mentions("period", "fixed interval", "every 60", "timer")},
      { label: "correlates against scheduled things like GC, cron, health checks", pattern: mentions("garbage collection", "gc", "cron", "health check", "connection pool") },
      { label: "distinguishes CPU-bound vs I/O-bound to narrow the cause", pattern: mentions("cpu-bound", "cpu bound", "i/o-bound", "io bound") },
      { label: "uses traces around the spike window as direct evidence", pattern: mentions("trace") },
    ],
    commonMistake: "Treating this like generic latency and skipping straight to code optimization, instead of recognizing the fixed period as evidence of scheduled behavior.",
    relatedModule: "Kubernetes",
  },
  {
    id: "scenario-oncall-first-ten-minutes",
    category: "Troubleshooting & scenarios", difficulty: "Mid-level", formulaType: "troubleshooting",
    question: "You get paged at 2am for a P1 outage. Walk me through your first ten minutes.",
    modelAnswer: "First minute, acknowledge the page so the team knows someone's on it and it doesn't escalate further while I'm getting oriented. Cheap check: the dashboard or alert that fired — what exactly tripped, and is it still actively firing or already recovering, since that changes urgency. I'd quickly clarify blast radius — is this affecting all users or a subset, one region or everywhere — because that shapes both how I communicate and how aggressively I act. If there's an obvious, low-risk mitigation, like rolling back a very recent deploy that lines up with when the alert started, I'd do that immediately rather than debugging deeply at 2am with a clear, fast lever available. I'd post a short status update to the incident channel early, even before I have a root cause, just so stakeholders aren't in the dark — 'investigating a P1, here's the impact, more in 10 minutes' is enough. Only once mitigation is underway or service is restored do I actually slow down and dig into root cause properly, ideally with a clearer head than the first adrenaline-driven minutes.",
    checklist: [
      { label: "acknowledges the page and orients on the alert first", pattern: mentions("acknowledge", "alert", "dashboard") },
      { label: "assesses blast radius/scope", pattern: mentions("blast radius", "scope", "affected users", "region") },
      { label: "reaches for a fast, low-risk mitigation like rollback before deep debugging", pattern: mentions("rollback", "roll back", "mitigat") },
      { label: "communicates status early even without a root cause", pattern: mentions("status update", "communicat", "incident channel") },
    ],
    commonMistake: "Diving straight into deep root-cause debugging before mitigating impact or communicating status — mitigate and communicate first, investigate deeply second.",
    relatedModule: "DevOps fundamentals",
  },
  {
    id: "scenario-team-disagreement",
    category: "Troubleshooting & scenarios", difficulty: "Mid-level", formulaType: "concept",
    question: "Two teams disagree on an infrastructure decision. How do you help resolve it?",
    modelAnswer: "I'd start by making sure I actually understand both positions before taking one — often what looks like disagreement on the surface is really two teams optimizing for different things, like one prioritizing delivery speed and the other prioritizing security or cost, and neither is wrong given their own constraints. From there I'd try to ground the discussion in concrete trade-offs and evidence rather than opinions — what's the actual cost difference, what's the actual risk being introduced, what's the actual time saved — since a specific number is much easier to agree on than a vague preference. If there's a real middle ground, like a scoped exception with a review date instead of an all-or-nothing decision, that's often the fastest way to unblock both sides without either feeling overruled. If it genuinely can't be resolved at that level, I'd escalate with the framed trade-offs already laid out, rather than escalating the raw disagreement and making someone else do the work of understanding both sides from scratch.",
    checklist: [
      { label: "listens to both sides and understands their actual constraints first", pattern: mentions("understand", "both", "listen", "perspective") },
      { label: "grounds the discussion in concrete trade-offs/data", pattern: mentions("trade-off", "tradeoff", "evidence", "data", "cost") },
      { label: "looks for a middle ground or scoped compromise", pattern: mentions("middle ground", "compromise", "scoped exception") },
      { label: "escalates with context already framed, if needed", pattern: mentions("escalat") },
    ],
    commonMistake: "Framing this as 'who's technically right' instead of recognizing it's usually a difference in priorities that needs trade-offs made explicit.",
    relatedModule: "DevOps fundamentals",
  },

  // ---------------------------------------------------------------------
  // Behavioral & project
  // ---------------------------------------------------------------------
  {
    id: "project-walkthrough",
    category: "Behavioral & project", difficulty: "Junior", formulaType: "star",
    question: "Walk me through a project you're proud of.",
    modelAnswer: "I built phone-store-3tier, a small e-commerce app — React frontend, Node/Express API, Postgres database — and used it specifically as a vehicle to practice real DevOps workflows, not just to build a working app. My task was to take it beyond 'it runs on my machine' and actually operate it the way a real team would. I containerized the frontend and backend separately with multi-stage Docker builds, ran local development with Docker Compose, then deployed it two ways — through raw Kubernetes manifests and through a Helm chart — specifically so I could compare the hand-written version against the templated one while learning. I wired up GitHub Actions for linting, image builds tagged by commit SHA, an Ansible-triggered deployment to an EC2 instance provisioned with Terraform, and a verification workflow that actually curls the live app afterward to confirm it's serving real product data, not just that the deploy command exited zero. I also exposed Prometheus metrics from the backend and set up a ServiceMonitor for scraping. The result is a project that shows the full lifecycle — build, containerize, deploy, observe, verify — using one small app as the thread that ties it all together, which is a much stronger story than five disconnected tutorials would be.",
    checklist: [
      { label: "states what the project is concisely", pattern: mentions("3-tier", "three-tier", "e-commerce", "phone-store") },
      { label: "names the actual stack", pattern: mentions("react", "node", "express", "postgres") },
      { label: "covers containerization and deployment path(s)", pattern: mentions("docker", "kubernetes", "helm") },
      { label: "mentions CI/CD and verification, not just deployment", pattern: mentions("github actions", "ci/cd", "verif") },
    ],
    commonMistake: "Describing only what the app does (an online phone store) instead of what it demonstrates about how you operate and deploy software.",
    relatedModule: "DevOps fundamentals",
  },
  {
    id: "project-tricky-bug",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "star",
    question: "Tell me about a tricky bug you had to debug on this project.",
    modelAnswer: "The situation was checkout requests failing with a 405 error through Nginx, even though product browsing worked completely fine. My task was to figure out why one specific route was broken when the rest of the app clearly worked. I started by ruling out the backend entirely — hitting the API directly confirmed it handled POST requests fine, so the problem had to be in the proxy layer sitting in front of it. I checked the Nginx config that serves the frontend and proxies /api, and found the routing block wasn't correctly configured to pass POST-method requests for that specific path through to the backend — it was more permissive for GET requests than POST. Once I fixed the proxy configuration to correctly forward the /api path regardless of method, checkout started working immediately, and I retested the full flow end to end, not just the one broken request, to make sure nothing else on the proxy layer had the same gap. The result was a working checkout flow, and it taught me to be specific about which HTTP methods a reverse proxy config actually allows through per route — an easy thing to get subtly wrong when writing that config by hand.",
    checklist: [
      { label: "states the specific symptom", pattern: mentions("405", "checkout", "orders")},
      { label: "shows a systematic isolation process, not a guess", pattern: mentions("ruled out", "isolat", "confirmed")},
      { label: "names the actual root cause", pattern: mentions("nginx", "proxy", "routing")},
      { label: "closes with the result and the lesson learned", pattern: mentions("result", "learned", "taught", "lesson") },
    ],
    commonMistake: "Describing the symptom in detail but skipping the actual diagnostic process — the diagnostic reasoning is what the interviewer is actually evaluating.",
    relatedModule: "Docker",
  },
  {
    id: "project-technical-tradeoff",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "star",
    question: "Tell me about a technical decision or trade-off you made on this project.",
    modelAnswer: "The situation was designing how order creation works — a user checks out, and I need to record the order while also decrementing product stock, without letting two simultaneous orders oversell the same limited stock. My task was to make that safe under concurrency, not just correct in the simple case. I chose to wrap the whole operation in a database transaction, using SELECT ... FOR UPDATE to lock the specific product rows being ordered before checking stock, so a second concurrent request for the same product has to wait for the first transaction to finish rather than reading a stale stock count. I insert the order and its line items, decrement stock, and only commit at the end — if anything fails partway, the whole transaction rolls back so I never end up with a half-written order. The trade-off I accepted is that row-level locking adds some contention under very high concurrent load on the same product, which I decided was the right call for a learning project prioritizing correctness — in a system with genuinely heavy contention, I'd look at something like an application-level reservation queue instead. The result is order creation that's actually safe against the classic overselling race condition, not just correct when tested one request at a time.",
    checklist: [
      { label: "states the actual problem being solved", pattern: mentions("stock", "concurren", "oversell")},
      { label: "names the specific technical choice", pattern: mentions("transaction", "for update", "lock")},
      { label: "explains the trade-off honestly, not just the upside", pattern: mentions("trade-off", "tradeoff", "contention", "downside") },
      { label: "closes with the concrete result", pattern: mentions("result", "safe", "race condition") },
    ],
    commonMistake: "Describing only the chosen solution without naming the actual trade-off accepted — every real technical decision has one, and naming it shows judgment.",
    relatedModule: "Terraform",
  },
  {
    id: "project-secrets-handling",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "concept",
    question: "How do you handle secrets and credentials across your projects?",
    modelAnswer: "In my CI/CD pipeline, real credentials — Docker Hub login, the EC2 SSH key, the deploy host — are stored as GitHub Actions secrets, never hardcoded in a workflow file. On the Ansible side, when I generate the .env file on the remote host during deployment, I explicitly set its file mode to 0600 so it's not world-readable once it lands on the box. Where I'm honest about a real gap is the committed Kubernetes Secret manifest for Postgres — it's plaintext stringData in Git, and I flagged that explicitly in my own project documentation as local/demo-only, not something I'd consider production-safe, because base64 in a Secret object is encoding, not encryption, and anyone with repo access can read it directly. If I were taking this to production, the next step is clear — move to something like Sealed Secrets or SOPS so what's committed to Git is actually encrypted, or use a cloud secrets manager and inject values at runtime instead of committing them at all. I'd rather be upfront about that gap and show I understand the correct direction than pretend the demo setup is already production-grade.",
    checklist: [
      { label: "distinguishes CI secrets storage from in-repo manifests", pattern: mentions("github actions secret", "ci")},
      { label: "names the real gap (plaintext committed Secret)", pattern: mentions("plaintext", "committed", "demo")},
      { label: "explains why base64 isn't real protection", pattern: mentions("base64", "encod", "encrypt")},
      { label: "names a concrete next step like Sealed Secrets or SOPS", pattern: mentions("sealed secret", "sops", "secrets manager") },
    ],
    commonMistake: "Claiming secrets are fully handled correctly when a real project has a known gap — interviewers respect honesty about trade-offs far more than a claim of perfection that falls apart under a follow-up question.",
    relatedModule: "Kubernetes",
  },
  {
    id: "project-cicd-walkthrough",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "star",
    question: "Walk me through your CI/CD pipeline end to end.",
    modelAnswer: "On a pull request, a lint workflow runs against both frontend and backend, and a separate check enforces that version.txt was actually bumped if application or deployment files changed — that's a lightweight but effective way to force versioning discipline instead of relying on people remembering. Once merged to main, a build-and-push workflow builds both the frontend and backend Docker images and tags them with the commit SHA, so every image traces back to an exact commit. That successful build triggers a second workflow that runs an Ansible playbook against the EC2 host — it copies over the compose file and init SQL, writes a fresh .env with the new image tag, validates the compose config, stops the old containers, pulls the newly tagged images, and brings the stack back up. Once that Ansible workflow completes successfully, a final workflow_run-triggered job does the actual verification — it curls the frontend to confirm it's reachable, hits /ready on the backend, and calls /api/products checking that real seeded data, like an iPhone entry, actually comes back. That chained, workflow_run-triggered structure means each stage only runs if the previous one genuinely succeeded, so a broken build never even reaches the deploy step.",
    checklist: [
      { label: "covers PR-stage checks (lint/version)", pattern: mentions("lint", "version", "pull request", "pr")},
      { label: "covers image build and tagging", pattern: mentions("build", "tag", "commit sha", "image")},
      { label: "covers the Ansible-based deployment step", pattern: mentions("ansible", "ec2", "compose")},
      { label: "covers post-deploy verification with a real check", pattern: mentions("verif", "curl", "/ready", "/api/products") },
    ],
    commonMistake: "Describing the pipeline in generic terms instead of naming the actual chained workflow structure and what each stage genuinely does.",
    relatedModule: "CI/CD",
  },
  {
    id: "project-observability-approach",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "star",
    question: "How did you approach observability in this project?",
    modelAnswer: "The situation was wanting some real visibility into the backend instead of just assuming it's healthy because the process is running. My task was to add meaningful signal without over-building it for what's still a learning project. I instrumented the backend with prom-client, exposing /metrics alongside dedicated /health and /ready endpoints — health for basic liveness, ready specifically checking the database connection so I know the difference between 'the process is up' and 'the app can actually serve a real request.' I added a ServiceMonitor manifest so a Prometheus Operator-managed stack can auto-discover and scrape the backend, plus a monitoring ingress exposing Grafana and Prometheus under local hostnames for when that stack is installed. What I'd say honestly is the result so far is metrics-only — I haven't built out structured logging or tracing yet, and the repo doesn't include the actual Prometheus/Grafana installation, just the integration points expecting one to exist. That's a deliberate scope decision for now, and it's exactly the kind of thing I'd name as a next step if asked what I'd improve.",
    checklist: [
      { label: "names concrete endpoints implemented", pattern: mentions("/health", "/ready", "/metrics")},
      { label: "explains the difference between health and readiness checks", pattern: mentions("liveness", "readiness", "database connection")},
      { label: "mentions ServiceMonitor / Prometheus Operator integration", pattern: mentions("servicemonitor", "prometheus operator", "scrape")},
      { label: "is honest that it's metrics-only, not full observability", pattern: mentions("metrics-only", "honest", "next step", "haven't") },
    ],
    commonMistake: "Overstating the observability setup as a 'full monitoring stack' when only the metrics integration points actually exist in the repo.",
    relatedModule: "Kubernetes",
  },
  {
    id: "project-future-improvements",
    category: "Behavioral & project", difficulty: "Junior", formulaType: "star",
    question: "What would you improve about this project if you had more time?",
    modelAnswer: "A few things, honestly and in priority order. First, secrets — replacing the committed demo Secret manifest with Sealed Secrets or a real secrets manager, since that's the biggest gap between this being a learning project and something production-ready. Second, storage — right now Postgres in Kubernetes doesn't use a persistent volume, so data doesn't survive a Pod being rescheduled, which is fine for a demo but wouldn't be acceptable for anything real. Third, I'd want HTTPS and a real ingress controller strategy instead of local hostnames, and I'd adopt something like Argo CD for GitOps-based deployment instead of the current push-based Ansible flow, which would also close the credential-exposure gap that push-based CI/CD inherently has. I'd also want to migrate from Minikube to a real EKS cluster — the Terraform for that already exists in the repo, I just haven't fully wired the Kubernetes deployment path to run against it yet — and round out observability with logs and traces, not just metrics. I like being asked this question, honestly, because it shows I understand the difference between 'it works' and 'it's production-ready,' and I know exactly which gap to close first.",
    checklist: [
      { label: "names secrets management as a priority gap", pattern: mentions("secret", "sealed secret", "sops")},
      { label: "names persistent storage for Postgres", pattern: mentions("persistent volume", "storage", "postgres")},
      { label: "mentions GitOps/Argo CD or a similar deployment improvement", pattern: mentions("argo", "gitops", "cd")},
      { label: "frames the answer as prioritized, showing judgment not just a wishlist", pattern: mentions("priority", "first", "biggest gap") },
    ],
    commonMistake: "Giving an unordered wishlist instead of a prioritized list — the ordering itself is what demonstrates judgment about what actually matters most.",
    relatedModule: "DevOps fundamentals",
  },
  {
    id: "project-learning-new-tool",
    category: "Behavioral & project", difficulty: "Junior", formulaType: "star",
    question: "Tell me about a time you had to learn a new tool quickly.",
    modelAnswer: "The situation was needing to provision an EKS cluster with Terraform, which I hadn't worked with directly before — I'd used Terraform for simpler resources but not a full managed Kubernetes cluster with its networking. My task was to get a working, sensibly-configured cluster rather than just copy-pasting something I didn't understand. I started with the official terraform-aws-modules for VPC and EKS instead of writing it from scratch, specifically because that's a well-understood, widely-used pattern, and reading well-documented modules is a faster way to learn the shape of a correct setup than trial-and-error on my own resources. I worked through the module's inputs deliberately — figuring out why private subnets matter for node groups, what the addons block actually configures, why min/max/desired size need to be set thoughtfully rather than arbitrarily — instead of just accepting defaults I didn't understand. The result is a working VPC-plus-EKS setup in the repo with managed node groups actually configured correctly, and more importantly, I came away able to explain why each major piece is there, not just that it works.",
    checklist: [
      { label: "states what was unfamiliar", pattern: mentions("hadn't", "new to", "first time", "unfamiliar")},
      { label: "shows a deliberate learning approach, not just trial and error", pattern: mentions("official", "documented", "module", "deliberate")},
      { label: "shows understanding gained, not just task completion", pattern: mentions("why", "understand", "figuring out")},
      { label: "closes with a concrete result", pattern: mentions("result", "working", "explain") },
    ],
    commonMistake: "Saying 'I read the docs and figured it out' without any specific detail — vague answers to this question are extremely common and forgettable.",
    relatedModule: "Terraform",
  },
  {
    id: "behavioral-disagreement-devs",
    category: "Behavioral & project", difficulty: "Mid-level", formulaType: "star",
    question: "How do you handle disagreement with developers about an infrastructure decision?",
    modelAnswer: "I try to listen first and actually understand what they're optimizing for, since a developer pushing back on an infra constraint usually has a real reason — a deadline, a workflow that constraint makes harder, or a case I hadn't considered. My task in that moment is to find the actual right answer, not to win the disagreement. I'd lay out the trade-off concretely — what risk or cost the constraint is protecting against, specifically, not just 'best practice says so' — and genuinely stay open to being wrong if their case is solid. If it's a matter of timing rather than principle, I look for a middle ground, like a scoped, time-boxed exception with a follow-up date, rather than an immediate hard no that just breeds resentment and workarounds. If we still can't agree and it's consequential enough, I'd escalate with both perspectives clearly laid out, rather than escalating my side of it alone. The result I aim for isn't 'I was right' — it's a decision the team actually understands and can live with, which matters more for how smoothly the next disagreement goes too.",
    checklist: [
      { label: "listens and tries to understand their reasoning first", pattern: mentions("listen", "understand", "reason")},
      { label: "explains trade-offs concretely rather than citing 'best practice'", pattern: mentions("trade-off", "concrete", "specific")},
      { label: "looks for a scoped middle ground", pattern: mentions("middle ground", "compromise", "scoped")},
      { label: "frames the goal as a shared decision, not winning", pattern: mentions("team", "shared", "not about winning", "understand") },
    ],
    commonMistake: "Framing the answer around convincing the developer they're wrong, instead of genuinely engaging with why they disagree.",
    relatedModule: "DevOps fundamentals",
  },
];

export const interviewQuestions = questions;
