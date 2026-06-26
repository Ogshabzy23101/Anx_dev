import { interviewReviewedOverrides } from "./interviewReviewedOverrides.js";
import { normalizeReviewedQuestion } from "../utils/interviewReviewWorkflow.js";

export const interviewCategories = [
  "Linux",
  "Docker",
  "Kubernetes",
  "Helm",
  "Terraform",
  "Ansible",
  "CI/CD",
  "DevOps fundamentals",
  "Troubleshooting",
  "Scenario-based questions",
  "Behavioural questions",
];

export const interviewDifficulties = [
  "Beginner",
  "Junior DevOps",
  "Mid-level DevOps",
  "Advanced",
];

export const interviewReviewStatuses = [
  "generated",
  "needs-review",
  "reviewed",
  "approved",
];

const categoryTopics = {
  Linux: [
    ["Explain Linux file permissions.", ["read", "write", "execute"], "Linux"],
    ["How do you troubleshoot high CPU on a Linux server?", ["top", "process", "logs"], "Linux"],
    ["What does a pipe do in Linux?", ["stdout", "stdin", "command"], "Linux"],
    ["How do you inspect service logs?", ["journalctl", "service", "logs"], "Linux"],
    ["How do you check disk usage?", ["df", "du", "filesystem"], "Linux"],
  ],
  Docker: [
    ["What is the difference between an image and a container?", ["image", "container", "runtime"], "Docker"],
    ["How does Docker port mapping work?", ["host", "container", "port"], "Docker"],
    ["Why use a .dockerignore file?", ["build context", "ignore", "image"], "Docker"],
    ["What is a multi-stage build?", ["stage", "smaller", "artifact"], "Docker"],
    ["How would you debug a failing container?", ["logs", "exec", "inspect"], "Docker"],
  ],
  Kubernetes: [
    ["What is a Pod?", ["pod", "container", "smallest"], "Kubernetes"],
    ["What problem does a Deployment solve?", ["replicas", "rollout", "desired state"], "Kubernetes"],
    ["How do Services route traffic?", ["selector", "pods", "port"], "Kubernetes"],
    ["What is the role of ConfigMaps and Secrets?", ["configuration", "secret", "environment"], "Kubernetes"],
    ["How do you troubleshoot a CrashLoopBackOff?", ["logs", "describe", "events"], "Kubernetes"],
  ],
  Helm: [
    ["What is a Helm chart?", ["chart", "templates", "values"], "Helm"],
    ["What is a Helm release?", ["release", "install", "revision"], "Helm"],
    ["How do values.yaml files work?", ["values", "override", "template"], "Helm"],
    ["Why run helm template or helm lint?", ["render", "lint", "debug"], "Helm"],
    ["How do you roll back a Helm release?", ["rollback", "revision", "release"], "Helm"],
  ],
  Terraform: [
    ["What is Terraform state?", ["state", "mapping", "resources"], "Terraform"],
    ["What is the purpose of terraform plan?", ["plan", "preview", "changes"], "Terraform"],
    ["How do providers work?", ["provider", "api", "resource"], "Terraform"],
    ["When would you use modules?", ["module", "reuse", "inputs"], "Terraform"],
    ["How do you handle remote state safely?", ["backend", "locking", "state"], "Terraform"],
  ],
  Ansible: [
    ["What makes Ansible agentless?", ["ssh", "control node", "managed node"], "Ansible"],
    ["What is an inventory?", ["inventory", "hosts", "groups"], "Ansible"],
    ["Why are handlers useful?", ["notify", "handler", "restart"], "Ansible"],
    ["What does idempotency mean in Ansible?", ["idempotent", "desired state", "repeat"], "Ansible"],
    ["How do roles organize automation?", ["roles", "tasks", "templates"], "Ansible"],
  ],
  "CI/CD": [
    ["What is the purpose of CI?", ["integrate", "test", "feedback"], "CI/CD"],
    ["What is the purpose of CD?", ["deploy", "pipeline", "release"], "CI/CD"],
    ["Why should pipelines run tests before deploy?", ["tests", "quality", "regression"], "CI/CD"],
    ["How would you protect production deployments?", ["approval", "rollback", "environment"], "CI/CD"],
    ["What should a good pipeline artifact provide?", ["artifact", "version", "repeatable"], "CI/CD"],
  ],
  "DevOps fundamentals": [
    ["What does DevOps mean?", ["collaboration", "automation", "delivery"], "DevOps fundamentals"],
    ["Why is infrastructure as code useful?", ["version", "repeatable", "review"], "Terraform"],
    ["What is immutable infrastructure?", ["replace", "consistent", "image"], "Docker"],
    ["How do monitoring and alerting support operations?", ["metrics", "alerts", "response"], "Observability"],
    ["What is configuration drift?", ["drift", "desired state", "change"], "Ansible"],
  ],
  Troubleshooting: [
    ["A deployment fails after release. What do you check first?", ["logs", "events", "rollback"], "Kubernetes"],
    ["A service is unreachable. How do you isolate the issue?", ["network", "dns", "port"], "Linux"],
    ["A container exits immediately. What do you inspect?", ["logs", "command", "exit code"], "Docker"],
    ["Terraform apply fails halfway. What do you do?", ["state", "plan", "retry"], "Terraform"],
    ["An Ansible play fails on one host. How do you debug it?", ["verbose", "limit", "module"], "Ansible"],
  ],
  "Scenario-based questions": [
    ["Design a simple deployment flow for a web app.", ["build", "test", "deploy"], "CI/CD"],
    ["How would you migrate a manual server setup into automation?", ["inventory", "playbook", "idempotent"], "Ansible"],
    ["How would you expose a Kubernetes backend API?", ["service", "ingress", "selector"], "Kubernetes"],
    ["How would you reduce Docker image size?", ["multi-stage", "cache", "dependencies"], "Docker"],
    ["How would you structure Terraform for dev and prod?", ["modules", "backend", "variables"], "Terraform"],
  ],
  "Behavioural questions": [
    ["Tell me about a time you handled an outage.", ["impact", "action", "lesson"], "DevOps fundamentals"],
    ["How do you communicate risk before a deployment?", ["risk", "stakeholders", "rollback"], "CI/CD"],
    ["How do you learn a tool you have not used before?", ["documentation", "practice", "feedback"], "DevOps fundamentals"],
    ["Describe a time you improved a process.", ["problem", "automation", "result"], "DevOps fundamentals"],
    ["How do you handle disagreement during incident response?", ["listen", "evidence", "priority"], "Troubleshooting"],
  ],
};

const difficultyForIndex = (index) => interviewDifficulties[index % interviewDifficulties.length];

const baseInterviewQuestions = Object.entries(categoryTopics).flatMap(([category, topics]) => (
  topics.map(([question, requiredKeywords, relatedModule], index) => ({
    id: `interview-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    category,
    difficulty: difficultyForIndex(index),
    question,
    shortAnswer: `A strong answer should mention ${requiredKeywords.join(", ")}.`,
    detailedAnswer: `Explain the concept clearly, connect it to real operational work, and show how ${requiredKeywords.join(", ")} affect reliability, repeatability, or delivery speed.`,
    example: `Example: in a ${relatedModule} workflow, use ${requiredKeywords[0]} as the starting point, verify ${requiredKeywords[1]}, and confirm ${requiredKeywords[2]} before moving on.`,
    commonMistake: `Giving a memorized definition without explaining ${requiredKeywords[0]} in a real troubleshooting or delivery context.`,
    interviewTip: "Answer in a simple structure: define it, explain why it matters, then give a concrete example.",
    requiredKeywords,
    relatedModule,
  }))
));

const importedQuestionSpecs = [
  ["pdf-behavioural-intro", "Behavioural questions", "Junior DevOps", "Brief yourself: your background, project, and responsibilities.", ["role", "tools", "impact"], "DevOps fundamentals", "Give a concise two-minute summary covering your current role, years of experience, core tools, current project, daily responsibilities, and one measurable achievement.", "For example: mention managing CI/CD pipelines, Terraform infrastructure, Kubernetes workloads, incidents handled, and a quantified improvement such as reducing build time."],
  ["pdf-aws-lb-unavailable", "Troubleshooting", "Mid-level DevOps", "An EC2 application behind a load balancer is suddenly unavailable. How do you troubleshoot?", ["target health", "security group", "logs"], "Troubleshooting", "Debug layer by layer: load balancer target health, health check path, app process, security groups, recent logs, CPU, memory, disk, and subnet routing.", "Check unhealthy targets, verify /health returns 200, run systemctl status, inspect journal logs, and confirm the instance security group allows traffic from the load balancer."],
  ["pdf-aws-cost-spike", "Troubleshooting", "Mid-level DevOps", "AWS billing increased suddenly. How do you identify the cost spike?", ["cost explorer", "region", "tags"], "DevOps fundamentals", "Start in Cost Explorer grouped by service and region, then inspect untagged resources, instance sizes, NAT gateway data transfer, and recent activity logs.", "A common case is a large instance, NAT gateway transfer, or untagged test resource left running; add budgets and anomaly alerts afterward."],
  ["pdf-dev-ec2", "Scenario-based questions", "Junior DevOps", "A developer needs an EC2 instance for local deployment. What instance type and controls would you choose?", ["t3.medium", "least privilege", "ssm"], "DevOps fundamentals", "Use a small burstable instance such as t3.medium in a dev VPC, attach a least-privilege IAM role, restrict access, tag ownership, and prefer SSM Session Manager over open SSH.", "Add auto-stop scheduling and owner/env tags so temporary dev instances do not become unmanaged cost or security risk."],
  ["pdf-k8s-external-access", "Troubleshooting", "Junior DevOps", "A Kubernetes deployment succeeded but the app is not accessible externally. How do you troubleshoot?", ["service", "selector", "ingress"], "Kubernetes", "Check pod readiness, Service type, selector labels, endpoints, Ingress controller, security groups, and DNS records.", "If endpoints are empty, the Service selector does not match pod labels; test with kubectl get endpoints and curl from inside the cluster."],
  ["pdf-k8s-node-fails", "Kubernetes", "Mid-level DevOps", "When a Kubernetes node fails, what happens to the pods?", ["notready", "rescheduled", "deployment"], "Kubernetes", "The node becomes NotReady, pods on it are eventually evicted, and controller-managed pods are recreated on healthy nodes; standalone pods are not automatically replaced.", "Explain the difference between Deployments and standalone pods, and mention PodDisruptionBudgets for availability."],
  ["pdf-k8s-prod-podspec", "Kubernetes", "Mid-level DevOps", "What should you configure in a pod spec for production readiness?", ["requests", "probes", "securityContext"], "Kubernetes", "Production pods should define resource requests and limits, liveness/readiness probes, pinned image tags, security context, graceful shutdown, ConfigMaps/Secrets, and spreading rules.", "A good answer includes readiness probes for traffic safety and runAsNonRoot/readOnlyRootFilesystem for security."],
  ["pdf-git-mirror", "CI/CD", "Junior DevOps", "How do you migrate a Git repository with full commit history?", ["bare clone", "mirror", "tags"], "CI/CD", "Use a bare clone and mirror push so all commits, branches, tags, and refs are preserved.", "Run git clone --bare from the source, then git push --mirror to the destination remote."],
  ["pdf-git-branching", "CI/CD", "Beginner", "What is Git, why do we use it, and what is a branching strategy?", ["distributed", "history", "branching"], "CI/CD", "Git is distributed version control used for collaboration, history, rollback, and parallel work. Branching strategies define how teams isolate, review, and release changes.", "Compare Git Flow, GitHub Flow, and trunk-based development, then name the one you used."],
  ["pdf-pipeline-dev-uat", "CI/CD", "Junior DevOps", "Write or describe a CI/CD pipeline to test and deploy from Dev to UAT.", ["test", "build", "manual approval"], "CI/CD", "A solid pipeline runs tests, builds and pushes an artifact or image, deploys to Dev automatically, then gates UAT with manual approval.", "For a container app: npm test, docker build/push, kubectl set image for dev, and manual promotion to UAT."],
  ["pdf-maven-repositories", "CI/CD", "Beginner", "What is Maven and what are Maven repositories?", ["pom.xml", "local", "remote"], "CI/CD", "Maven is a Java build and dependency tool using pom.xml. It resolves dependencies from local, private/remote, and central repositories.", "Mention Nexus or Artifactory for controlled internal artifact storage."],
  ["pdf-jenkins-prod-fail", "Troubleshooting", "Mid-level DevOps", "A Jenkins pipeline works in Dev but fails in Production. How do you fix it?", ["environment parity", "credentials", "permissions"], "CI/CD", "Compare environment versions, configuration, credentials, network access, failing stage, IAM permissions, and add verbose logs to isolate the difference.", "Common real causes include expired prod credentials, missing cross-account permissions, or firewall restrictions."],
  ["pdf-argocd", "CI/CD", "Junior DevOps", "What is ArgoCD and why do teams use it?", ["gitops", "sync", "drift"], "CI/CD", "ArgoCD is a pull-based GitOps CD tool for Kubernetes that syncs cluster state to manifests stored in Git and detects drift.", "Explain that rollback can be done by reverting Git and letting ArgoCD reconcile."],
  ["pdf-gitops", "CI/CD", "Junior DevOps", "What is GitOps?", ["declarative", "git", "reconciliation"], "CI/CD", "GitOps uses Git as the source of truth for infrastructure and app deployment, with agents continuously reconciling live state to declared state.", "A Helm values change merged to main can trigger ArgoCD or Flux to deploy without manual kubectl commands."],
  ["pdf-ansible-100-servers", "Ansible", "Mid-level DevOps", "How would you deploy an application to 100 servers using Ansible?", ["inventory", "serial", "health check"], "Ansible", "Define inventory, write an idempotent playbook, deploy in rolling batches with serial, and stop on failed health checks.", "Use serial: 10 to update ten servers at a time instead of all at once."],
  ["pdf-docker-exits", "Docker", "Junior DevOps", "A Docker container stops immediately after starting. How do you troubleshoot?", ["logs", "entrypoint", "exit code"], "Docker", "Check docker ps -a, container logs, exit code, CMD/ENTRYPOINT, required environment variables, permissions, and whether the app stays in the foreground.", "Override the entrypoint with /bin/sh to inspect the image interactively."],
  ["pdf-oomkilled-sequence", "Kubernetes", "Advanced", "Explain the sequence of events when a pod gets OOMKilled in Kubernetes.", ["oomkiller", "exit 137", "restartPolicy"], "Kubernetes", "When a container exceeds its memory limit, the kernel OOM killer terminates the process, kubelet records exit code 137/OOMKilled, and restartPolicy controls whether the container restarts with backoff.", "Stress that the container restarts on the same pod/node; node memory pressure eviction is a different path."],
  ["pdf-prod-permission-denied", "Troubleshooting", "Advanced", "The same Docker image works in staging but fails in production with permission denied. How do you debug it?", ["securityContext", "uid", "permissions"], "Docker", "Verify identical image digest, compare runtime user, mounted volumes, Kubernetes securityContext, read-only filesystem settings, environment paths, and production admission policies.", "Most staging-vs-prod permission bugs come from security context or policy differences, not the image."],
  ["pdf-k8s-dns-cross-ns", "Kubernetes", "Advanced", "How does Kubernetes DNS resolution work across namespaces, and what failure modes matter?", ["coredns", "fqdn", "networkpolicy"], "Kubernetes", "Pods use CoreDNS and search domains. Cross-namespace calls should use service.namespace.svc.cluster.local; failures include CoreDNS outage, UDP/53 NetworkPolicy blocks, ndots behavior, and empty endpoints.", "Debug with nslookup from the pod and kubectl get endpoints in the target namespace."],
  ["pdf-terraform-lock", "Terraform", "Advanced", "A terraform apply has a state lock that never releases. How do you safely recover?", ["force-unlock", "backup", "plan"], "Terraform", "Confirm no apply is still running, back up the state, inspect the lock, use terraform force-unlock with the lock ID, then run terraform plan before any further apply.", "Never manually delete a DynamoDB lock item without understanding the active operation."],
  ["pdf-observability-stack", "Troubleshooting", "Advanced", "Differentiate metrics, logs, and traces, then design an observability stack for high traffic microservices.", ["metrics", "logs", "traces"], "Troubleshooting", "Metrics are numeric time series for dashboards and alerts, logs are event records for context, and traces show request flow across services. Use Prometheus/Grafana, Loki or ELK, OpenTelemetry, and trace sampling.", "At high request volume, sample traces and alert on SLO burn rates instead of storing everything."],
  ["pdf-secret-committed", "Troubleshooting", "Advanced", "A secret was committed to a public GitHub repository. What is your incident response?", ["rotate", "audit logs", "secret scanning"], "DevOps fundamentals", "Assume compromise, rotate/revoke the secret first, review audit logs, remove it from history, notify security, enable scanning, and move secrets to a proper manager.", "History rewriting does not protect an already-exposed secret; rotation is the priority."],
  ["pdf-hpa-internals", "Kubernetes", "Advanced", "How does Horizontal Pod Autoscaler work internally?", ["metrics api", "replicas", "stabilization"], "Kubernetes", "HPA periodically reads metrics, calculates desired replicas from current versus target metric values, applies stabilization rules, patches the workload replica count, and lets controllers/scheduler create pods.", "Mention Cluster Autoscaler separately: HPA scales pods, Cluster Autoscaler scales nodes."],
  ["pdf-error-budget", "DevOps fundamentals", "Advanced", "Define error budget, burn rate, and multi-window alerting for a 99.9% SLO.", ["slo", "burn rate", "alert"], "DevOps fundamentals", "Error budget is the allowed unreliability. Burn rate is how quickly it is consumed. Multi-window alerts combine short and long windows to reduce false positives while catching fast incidents.", "A strong answer mentions page-now and ticket-level alerts using different burn-rate windows."],
  ["pdf-periodic-latency", "Troubleshooting", "Advanced", "A microservice has 500ms latency spikes every 60 seconds. How do you diagnose it?", ["periodicity", "tracing", "connection pool"], "Troubleshooting", "The fixed period suggests a timer. Correlate metrics, probes, cron jobs, GC, connection pool reaping, DNS TTL, leader election, and traces around spike windows.", "Start by matching the 60-second pattern to scheduled behavior before changing code."],
  ["pdf-push-pull-cd", "CI/CD", "Advanced", "What is the difference between push-based and pull-based CD?", ["push", "pull", "gitops"], "CI/CD", "Push CD lets CI write to the cluster, while pull CD uses an in-cluster agent such as ArgoCD or Flux to reconcile from Git. Pull-based delivery improves credential safety and drift detection.", "Explain sync waves, windows, and hooks as ways to prevent deployment storms."],
  ["pdf-dockerfile-security-size", "Docker", "Advanced", "Describe Dockerfile practices that improve security and image size.", ["multi-stage", "non-root", "dockerignore"], "Docker", "Use multi-stage builds, non-root users, pinned base image digests, no secrets in ARG/ENV, .dockerignore, minimal layers, and image scanning in CI.", "The final image should contain runtime artifacts, not compilers, package caches, .git, or secrets."],
  ["pdf-platform-engineering", "DevOps fundamentals", "Advanced", "What is Platform Engineering and how does it differ from traditional DevOps?", ["idp", "self-service", "golden path"], "DevOps fundamentals", "Platform Engineering treats internal infrastructure as a product: an Internal Developer Platform provides self-service golden paths, templates, observability, and paved workflows for engineers.", "A good platform reduces tickets by making the safe path the easiest path."],
  ["pdf-terraform-large-scale", "Terraform", "Mid-level DevOps", "How do you structure Terraform code for large-scale cloud infrastructure?", ["modules", "remote state", "tfvars"], "Terraform", "Use reusable modules, environment separation, remote state with locking, tfvars per environment, CI checks, consistent tagging, and no hardcoded secrets.", "A practical structure separates live environments from shared modules and runs fmt, validate, and scanning in pull requests."],
  ["pdf-github-actions-e2e", "CI/CD", "Mid-level DevOps", "Walk through a GitHub Actions CI/CD pipeline you built end to end.", ["build", "scan", "deploy"], "CI/CD", "Describe triggers, checkout, tests, image build, security scan, registry push, environment approvals, and deployment with Helm or kubectl.", "A strong answer includes protected environments and measurable deployment improvement."],
  ["pdf-pipeline-secrets", "DevOps fundamentals", "Mid-level DevOps", "How do you manage secrets and credentials in a cloud DevOps pipeline?", ["oidc", "secrets manager", "least privilege"], "DevOps fundamentals", "Avoid static credentials. Use OIDC federation, cloud secrets managers, managed identities, encrypted CI secrets, and least-privilege roles.", "Mention replacing long-lived access keys with GitHub Actions OIDC role assumption."],
  ["pdf-python-automation", "DevOps fundamentals", "Junior DevOps", "How do you write Python scripts for DevOps automation?", ["sdk", "automation", "schedule"], "DevOps fundamentals", "Use Python with cloud SDKs for repeatable operational tasks such as finding idle resources, reporting drift, or running scheduled cleanup jobs.", "A good example is a scheduled Lambda or cron job that identifies idle EC2 instances from CloudWatch metrics."],
  ["pdf-terraform-state-drift", "Terraform", "Mid-level DevOps", "How do you handle Terraform state management and drift in production?", ["remote state", "locking", "plan"], "Terraform", "Use remote state with locking and versioning, run plan in CI, detect drift regularly, import or codify manual changes, and avoid direct console edits.", "If a security group rule was added manually, import or encode it in Terraform instead of ignoring drift."],
  ["pdf-zero-downtime", "Kubernetes", "Mid-level DevOps", "How do you design a Kubernetes deployment strategy for zero-downtime releases?", ["rolling update", "readiness", "canary"], "Kubernetes", "Use rolling updates with maxUnavailable 0 and readiness probes for normal changes; use blue-green or canary with Argo Rollouts/Istio for riskier releases.", "Monitor error rate during canary and auto-promote only if SLOs stay healthy."],
  ["pdf-monitoring-k8s", "Troubleshooting", "Mid-level DevOps", "How do you set up monitoring and alerting for a production Kubernetes cluster?", ["prometheus", "grafana", "alertmanager"], "Troubleshooting", "Deploy kube-prometheus-stack, scrape app metrics with ServiceMonitors, route alerts through Alertmanager, and ship logs with Fluent Bit to ELK or Loki.", "Tie alerts to severity: P1 to PagerDuty, lower-priority alerts to Slack."],
  ["pdf-ansible-experience", "Ansible", "Junior DevOps", "Describe your experience with Ansible for configuration management.", ["idempotent", "roles", "handlers"], "Ansible", "Discuss idempotent playbooks, role structure, templates, handlers, patching, and using inventory to manage many hosts consistently.", "Use an nginx role example with apt, template, notify, and service tasks."],
  ["pdf-iam-security", "DevOps fundamentals", "Mid-level DevOps", "How do you design IAM and cloud security best practices?", ["least privilege", "audit", "scanning"], "DevOps fundamentals", "Apply least privilege, use service roles or managed identities, enable audit logging, restrict networks, store secrets centrally, and scan IaC in CI.", "A strong answer names guardrails such as CloudTrail, GuardDuty, Azure Policy, tfsec, or checkov."],
  ["pdf-prod-rollout-fail", "Scenario-based questions", "Mid-level DevOps", "Production deployment fails mid-rollout. What do you do?", ["rollback", "communicate", "postmortem"], "Troubleshooting", "Assess blast radius, roll back first, communicate in the incident channel, monitor recovery, then do root cause analysis and a blameless postmortem.", "For Kubernetes, use rollout history, rollout undo, and rollout status."],
  ["pdf-terraform-destroy-prod", "Scenario-based questions", "Mid-level DevOps", "Terraform plan shows resources will be destroyed in production. How do you handle it?", ["destroy", "prevent_destroy", "approval"], "Terraform", "Stop before applying, understand whether the destroy is expected, use state mv/import for renames, protect critical resources with lifecycle rules, and require manual approval.", "A pipeline should flag destructive plans and block automatic apply."],
  ["pdf-k8s-cloud-autoscaling", "Kubernetes", "Mid-level DevOps", "How do you implement autoscaling in Kubernetes and cloud environments?", ["hpa", "keda", "cluster autoscaler"], "Kubernetes", "Use HPA for pod replicas, VPA for requests, KEDA for event-driven workloads, and Cluster Autoscaler or cloud autoscaling groups for node capacity.", "Queue depth or Kafka lag is a better scaling signal than CPU for many async workers."],
  ["pdf-terraform-multi-env", "Terraform", "Mid-level DevOps", "How do you manage dev, staging, and prod infrastructure in Terraform?", ["workspaces", "directories", "tfvars"], "Terraform", "Use directory-based separation or workspaces depending on complexity, keep shared modules reusable, and drive environment differences through tfvars and backend state.", "Production can enforce stricter networking and HA settings while reusing the same module interface."],
  ["pdf-ha-dr", "DevOps fundamentals", "Advanced", "How do you ensure high availability and disaster recovery in cloud infrastructure?", ["multi-az", "rpo", "rto"], "DevOps fundamentals", "Design across availability zones, use managed database failover, replicate critical data, define RPO/RTO, and test failover with game days.", "Mention Route53 or load balancer failover plus tested runbooks."],
  ["pdf-behavioural-migration", "Behavioural questions", "Mid-level DevOps", "Tell me about a time you led a critical infrastructure migration.", ["situation", "action", "result"], "DevOps fundamentals", "Use STAR: explain the migration driver, your ownership, discovery and runbook approach, risk mitigation, execution, and measurable outcome.", "Quantify business impact such as avoided renewal cost, faster provisioning, or reduced compute spend."],
  ["pdf-behavioural-incident", "Behavioural questions", "Mid-level DevOps", "Tell me about a time you resolved a major production incident.", ["impact", "rollback", "lesson"], "Troubleshooting", "Use STAR: describe the user impact, immediate diagnosis, rollback or mitigation, stakeholder updates, and follow-up prevention work.", "A mature answer includes both restoration speed and postmortem improvements."],
  ["pdf-behavioural-disagreement", "Behavioural questions", "Junior DevOps", "How do you handle disagreements with developers about infrastructure decisions?", ["listen", "tradeoffs", "data"], "DevOps fundamentals", "Listen first, clarify requirements, explain security/cost/reliability tradeoffs with evidence, document options, and escalate with context only when needed.", "Offer a compromise that meets delivery goals without ignoring operational risk."],
  ["pdf-stay-current", "Behavioural questions", "Beginner", "How do you stay current with DevOps tools and cloud trends?", ["documentation", "practice", "community"], "DevOps fundamentals", "Follow release notes and newsletters, practice in a lab repo, earn targeted certifications, join community channels, and share learnings with the team.", "Give one recent tool you tested and how it helped a real workflow."],
];

function makeImportedQuestion([id, category, difficulty, question, requiredKeywords, relatedModule, answer, example]) {
  return {
    id,
    category,
    difficulty,
    question,
    shortAnswer: answer.split(".")[0] + ".",
    detailedAnswer: answer,
    example,
    commonMistake: `Answering only with a definition and not mentioning ${requiredKeywords[0]}, ${requiredKeywords[1]}, and a real operational example.`,
    interviewTip: "Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.",
    requiredKeywords,
    relatedModule,
  };
}

function dedupeQuestions(questions) {
  const seen = new Set();
  return questions.filter((item) => {
    const key = item.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const importedInterviewQuestions = importedQuestionSpecs.map(makeImportedQuestion);

function applyReviewedOverride(question) {
  return normalizeReviewedQuestion({
    ...question,
    reviewStatus: question.reviewStatus || "needs-review",
    ...(interviewReviewedOverrides[question.id] || {}),
    id: question.id,
  });
}

export const interviewQuestions = dedupeQuestions([
  ...importedInterviewQuestions,
  ...baseInterviewQuestions,
]).map(applyReviewedOverride);

export const interviewFlashcards = interviewQuestions.map((item) => ({
  id: `flashcard-${item.id}`,
  category: item.category,
  difficulty: item.difficulty,
  reviewStatus: item.reviewStatus,
  front: item.question,
  shortAnswer: item.shortAnswer,
  deeperExplanation: item.detailedAnswer,
  example: item.example,
  interviewTip: item.interviewTip,
}));

export const interviewMultipleChoice = interviewQuestions.map((item, index, questions) => ({
  id: `mcq-${item.id}`,
  category: item.category,
  difficulty: item.difficulty,
  question: item.question,
  options: [
    item.shortAnswer,
    questions[(index + 7) % questions.length].shortAnswer,
    questions[(index + 19) % questions.length].shortAnswer,
    questions[(index + 31) % questions.length].shortAnswer,
  ],
  answer: 0,
  explanation: item.detailedAnswer,
}));
