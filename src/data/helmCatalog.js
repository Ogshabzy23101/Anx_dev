const categoryDefinitions = [
  ["Helm basics", "understanding Helm as a package manager for Kubernetes", ["chart", "release", "repository"], ["Kubernetes", "charts"], [["Helm", "beginner", "helm version"], ["Helm client", "beginner", "helm env"], ["release management", "intermediate", "helm list"], ["Kubernetes packaging", "beginner", "helm create webapp"]]],
  ["Charts", "working with versioned Kubernetes application packages", ["Chart.yaml", "values.yaml", "templates"], ["release", "package"], [["chart", "beginner", "helm show chart bitnami/nginx"], ["chart directory", "beginner", "helm create webapp"], ["chart archive", "intermediate", "helm package ./webapp"], ["chart inspection", "intermediate", "helm show all bitnami/nginx"]]],
  ["Releases", "operating named chart installations with revision history", ["name", "namespace", "revision"], ["install", "upgrade"], [["release", "beginner", "helm list"], ["release status", "beginner", "helm status web"], ["release history", "intermediate", "helm history web"], ["release values", "intermediate", "helm get values web"]]],
  ["Repositories", "discovering and downloading packaged charts", ["name", "url", "index.yaml"], ["helm repo", "helm search"], [["helm repo add", "beginner", "helm repo add bitnami https://charts.bitnami.com/bitnami"], ["helm repo update", "beginner", "helm repo update"], ["helm search repo", "beginner", "helm search repo nginx"], ["helm repo list", "beginner", "helm repo list"]]],
  ["Chart.yaml", "declaring chart metadata and dependencies", ["apiVersion", "name", "version"], ["dependencies", "appVersion"], [["Chart.yaml", "beginner", "helm show chart ./webapp"], ["apiVersion v2", "beginner", "helm lint ./webapp"], ["chart metadata", "intermediate", "helm show chart bitnami/nginx"], ["dependencies section", "intermediate", "helm dependency list ./webapp"]]],
  ["values.yaml", "providing default configuration consumed by templates", ["replicaCount", "image", "service"], [".Values", "overrides"], [["values.yaml", "beginner", "helm show values bitnami/nginx"], ["values override", "beginner", "helm install web ./webapp -f values-prod.yaml"], ["computed values", "intermediate", "helm get values web --all"], ["reuse values", "intermediate", "helm upgrade web ./webapp --reuse-values"]]],
  ["templates", "rendering Kubernetes resources with Go templates", ["apiVersion", "kind", "{{ }}"], ["values.yaml", "helpers"], [["templates/", "beginner", "helm template web ./webapp"], ["deployment template", "beginner", "helm template web ./webapp --show-only templates/deployment.yaml"], ["template scope", "intermediate", "helm lint ./webapp"], ["template output", "intermediate", "helm get manifest web"]]],
  ["_helpers.tpl", "storing reusable template definitions", ["define", "include", "template"], ["named templates", "fullname"], [["_helpers.tpl", "beginner", "helm template web ./webapp"], ["fullname helper", "beginner", "helm lint ./webapp"], ["label helper", "intermediate", "helm template web ./webapp --debug"], ["helper naming", "intermediate", "helm template web ./webapp --show-only templates/service.yaml"]]],
  ["named templates", "defining reusable template snippets", ["define", "end", "scope"], ["include", "_helpers.tpl"], [["define", "beginner", "helm lint ./webapp"], ["template name", "beginner", "helm template web ./webapp"], ["helper scope", "intermediate", "helm template web ./webapp --debug"], ["name collision", "advanced", "helm lint ./webapp --strict"]]],
  ["include", "calling named templates and returning text", ["include", "quote", "nindent"], ["define", "pipeline"], [["include function", "beginner", "helm template web ./webapp"], ["include fullname", "beginner", "helm template web ./webapp --show-only templates/service.yaml"], ["include labels", "intermediate", "helm template web ./webapp --debug"], ["include pipeline", "intermediate", "helm lint ./webapp"]]],
  ["template functions", "transforming values in chart templates", ["default", "quote", "toYaml"], ["pipelines", "Sprig"], [["default function", "beginner", "helm template web ./webapp"], ["quote function", "beginner", "helm template web ./webapp"], ["toYaml function", "intermediate", "helm template web ./webapp"], ["nindent function", "intermediate", "helm template web ./webapp"]]],
  ["conditionals", "rendering resources or fields only when values enable them", ["if", "else", "end"], ["values", "ingress"], [["if block", "beginner", "helm template web ./webapp --set ingress.enabled=true"], ["else block", "intermediate", "helm template web ./webapp --debug"], ["conditional resource", "beginner", "helm lint ./webapp"], ["required condition", "advanced", "helm template web ./webapp --set serviceAccount.create=true"]]],
  ["loops", "rendering repeated YAML from lists or maps", ["range", "end", "$"], ["values", "env"], [["range loop", "beginner", "helm template web ./webapp"], ["loop env vars", "intermediate", "helm template web ./webapp --show-only templates/deployment.yaml"], ["loop hosts", "intermediate", "helm template web ./webapp --set ingress.enabled=true"], ["root scope in loop", "advanced", "helm lint ./webapp"]]],
  ["pipelines", "chaining template functions from left to right", ["|", "quote", "nindent"], ["functions", "values"], [["pipeline", "beginner", "helm template web ./webapp"], ["quote pipeline", "beginner", "helm lint ./webapp"], ["toYaml pipeline", "intermediate", "helm template web ./webapp"], ["nindent pipeline", "intermediate", "helm template web ./webapp --debug"]]],
  ["default values", "falling back when a value is unset", ["default", "required", "coalesce"], ["values.yaml", "functions"], [["default value", "beginner", "helm template web ./webapp"], ["required value", "intermediate", "helm template web ./webapp --debug"], ["coalesce", "advanced", "helm lint ./webapp"], ["fallback image tag", "intermediate", "helm template web ./webapp --set image.tag="]]],
  ["dependencies", "composing charts from subcharts", ["dependencies", "charts/", "Chart.lock"], ["repository", "alias"], [["helm dependency update", "beginner", "helm dependency update ./webapp"], ["helm dependency build", "intermediate", "helm dependency build ./webapp"], ["dependency list", "intermediate", "helm dependency list ./webapp"], ["subchart values", "advanced", "helm template web ./webapp --dependency-update"]]],
  ["chart versioning", "versioning chart packages independently of applications", ["version", "SemVer", "Chart.lock"], ["appVersion", "package"], [["chart version", "beginner", "helm show chart ./webapp"], ["helm package version", "beginner", "helm package ./webapp --version 0.2.0"], ["dependency version", "intermediate", "helm dependency update ./webapp"], ["repository index version", "advanced", "helm repo index ./charts"]]],
  ["appVersion", "documenting the packaged application version", ["appVersion", "image.tag", "metadata"], ["Chart.yaml", "version"], [["appVersion", "beginner", "helm show chart ./webapp"], ["image tag alignment", "intermediate", "helm template web ./webapp --set image.tag=1.2.0"], ["app metadata", "beginner", "helm lint ./webapp"], ["version distinction", "intermediate", "helm package ./webapp"]]],
  ["install", "creating a new release from a chart", ["release", "chart", "namespace"], ["upgrade", "values"], [["helm install", "beginner", "helm install web ./webapp"], ["install namespace", "beginner", "helm install web ./webapp -n dev --create-namespace"], ["install values", "beginner", "helm install web ./webapp -f values-prod.yaml"], ["install dry-run", "intermediate", "helm install web ./webapp --dry-run --debug"]]],
  ["upgrade", "changing an existing release and creating a new revision", ["release", "chart", "--install"], ["rollback", "history"], [["helm upgrade", "beginner", "helm upgrade web ./webapp"], ["upgrade install", "beginner", "helm upgrade --install web ./webapp"], ["upgrade values", "intermediate", "helm upgrade web ./webapp --set image.tag=2.0"], ["upgrade namespace", "intermediate", "helm upgrade web ./webapp -n dev"]]],
  ["rollback", "restoring a previous release revision", ["revision", "history", "status"], ["upgrade", "release"], [["helm rollback", "beginner", "helm rollback web 2"], ["rollback namespace", "intermediate", "helm rollback web 2 -n dev"], ["history before rollback", "beginner", "helm history web"], ["rollback wait", "intermediate", "helm rollback web 2 --wait"]]],
  ["uninstall", "removing a release and its managed resources", ["release", "keep-history", "namespace"], ["install", "history"], [["helm uninstall", "beginner", "helm uninstall web"], ["uninstall namespace", "beginner", "helm uninstall web -n dev"], ["keep history", "intermediate", "helm uninstall web --keep-history"], ["uninstall wait", "intermediate", "helm uninstall web --wait"]]],
  ["linting", "catching chart structure and template issues early", ["lint", "strict", "values"], ["template", "CI"], [["helm lint", "beginner", "helm lint ./webapp"], ["lint strict", "intermediate", "helm lint ./webapp --strict"], ["lint values", "intermediate", "helm lint ./webapp -f values-prod.yaml"], ["lint subcharts", "advanced", "helm lint ./webapp --with-subcharts"]]],
  ["rendering templates", "previewing manifests before applying them", ["template", "show-only", "debug"], ["dry-run", "lint"], [["helm template", "beginner", "helm template web ./webapp"], ["render namespace", "beginner", "helm template web ./webapp -n dev"], ["render one template", "intermediate", "helm template web ./webapp --show-only templates/deployment.yaml"], ["render debug", "intermediate", "helm template web ./webapp --debug"]]],
  ["debugging", "diagnosing chart rendering and release state", ["--dry-run", "--debug", "get"], ["status", "manifest"], [["dry-run debug", "beginner", "helm install web ./webapp --dry-run --debug"], ["get manifest", "beginner", "helm get manifest web"], ["get values", "beginner", "helm get values web --all"], ["release status debug", "intermediate", "helm status web --show-resources"]]],
  ["DevOps workflows", "integrating charts into delivery pipelines", ["package", "push", "provenance"], ["CI/CD", "OCI"], [["helm package", "beginner", "helm package ./webapp"], ["chart dependency update", "beginner", "helm dependency update ./webapp"], ["OCI push", "advanced", "helm push webapp-0.1.0.tgz oci://registry.example.com/charts"], ["pipeline render", "intermediate", "helm template web ./webapp --validate"]]],
];

function makeEntry([category, purpose, fields, related, items]) {
  return items.map(([command, difficulty, example]) => ({
    category,
    difficulty,
    command,
    topic: command,
    fullMeaning: command,
    description: `${command} is used for ${purpose}. Example workflow: ${example}.`,
    basicExplanation: `${command} is used for ${purpose}.`,
    professionalExplanation: `${command} supports repeatable Helm delivery by making chart configuration, rendering, or release lifecycle behavior explicit.`,
    commonSyntax: example,
    syntax: example,
    commonFlags: fields,
    commonFields: fields,
    examples: [example],
    devOpsUseCase: `Useful for ${purpose} in chart development, release automation, and Kubernetes operations.`,
    commonMistake: `Using ${command} without checking values precedence, namespace, release name, or rendered manifests.`,
    relatedCommands: related,
    relatedConcepts: related,
    answers: [example],
  }));
}

export const helmCategories = categoryDefinitions.map(([category]) => category);
export const helmCommandCatalog = categoryDefinitions.flatMap(makeEntry);
export const helmReference = helmCategories.map((category) => ({
  category,
  commands: helmCommandCatalog.filter((item) => item.category === category),
}));

export const helmFlashcards = helmCommandCatalog.map((item, index) => ({
  id: index === 0 ? "helm-fc-chart" : `helm-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: `What should you know about \`${item.command}\`?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const helmMultipleChoice = helmCommandCatalog.map((item, index, catalog) => ({
  id: `helm-mcq-${index + 1}`,
  category: item.category,
  question: `Which Helm topic or command best matches: ${item.basicExplanation.toLowerCase()}`,
  options: [
    item.command,
    catalog[(index + 7) % catalog.length].command,
    catalog[(index + 31) % catalog.length].command,
    catalog[(index + 59) % catalog.length].command,
  ],
  answer: 0,
  explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
}));

export const helmCommandQuiz = helmCommandCatalog.map((item, index) => ({
  id: `helm-command-${index + 1}`,
  category: item.category,
  prompt: `Write a Helm command that demonstrates or inspects this topic: ${item.command}.`,
  answers: item.answers,
  explanation: `A valid workflow is \`${item.answers[0]}\`.`,
}));
