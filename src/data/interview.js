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

export const interviewQuestions = Object.entries(categoryTopics).flatMap(([category, topics]) => (
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

export const interviewFlashcards = interviewQuestions.map((item) => ({
  id: `flashcard-${item.id}`,
  category: item.category,
  difficulty: item.difficulty,
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
