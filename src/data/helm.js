import { helmRules as h } from "../utils/helmValidation.js";
import {
  expectedYamlValue,
  kubernetesRules as k,
  requiredString,
} from "../utils/kubernetesValidation.js";
import { helmExtraPractice } from "./helmExtraPractice.js";

export {
  helmCategories,
  helmCommandCatalog,
  helmCommandQuiz,
  helmFlashcards,
  helmMultipleChoice,
  helmReference,
} from "./helmCatalog.js";

const legacyHelmReference = [
  {
    category: "Core concepts",
    commands: [
      { command: "Helm", description: "The package manager and templating workflow for Kubernetes applications." },
      { command: "Chart", description: "A versioned package containing metadata, defaults, templates, and dependencies." },
      { command: "Release", description: "A named installation of a chart in a Kubernetes cluster." },
      { command: "Repository", description: "An HTTP location that indexes and distributes packaged charts." },
      { command: "Helm + Kubernetes", description: "Helm renders parameterized templates into Kubernetes manifests and manages their release history." },
    ],
  },
  {
    category: "Chart structure",
    commands: [
      { command: "Chart.yaml", description: "Declares chart metadata, chart version, appVersion, and dependencies." },
      { command: "values.yaml", description: "Defines default values consumed by chart templates." },
      { command: "templates/", description: "Contains Kubernetes manifests and text files rendered by Helm." },
      { command: "_helpers.tpl", description: "Stores reusable named templates and helper definitions." },
      { command: "appVersion vs version", description: "appVersion describes the packaged app; version identifies the chart package." },
    ],
  },
  {
    category: "Templating",
    commands: [
      { command: "{{ .Values.image.tag }}", description: "Reads a value from the merged values object." },
      { command: "{{ include \"app.fullname\" . }}", description: "Calls a named template and passes the current scope." },
      { command: "{{ if .Values.ingress.enabled }}", description: "Conditionally renders template content." },
      { command: "{{ range .Values.items }}", description: "Iterates over a collection." },
      { command: "Template functions", description: "Functions such as default, quote, indent, nindent, and toYaml transform template data." },
    ],
  },
  {
    category: "Release lifecycle",
    commands: [
      { command: "helm install web ./chart", description: "Install a chart as a new release." },
      { command: "helm upgrade web ./chart", description: "Upgrade an existing release with a chart." },
      { command: "helm rollback web 2", description: "Restore a previous release revision." },
      { command: "helm uninstall web", description: "Remove a release and its managed resources." },
      { command: "helm list", description: "List releases in a namespace." },
      { command: "helm status web", description: "Show release status, resources, and notes." },
      { command: "helm get values web", description: "Show values used by an installed release." },
    ],
  },
  {
    category: "Repositories & dependencies",
    commands: [
      { command: "helm repo add bitnami https://charts.bitnami.com/bitnami", description: "Register a chart repository locally." },
      { command: "helm repo update", description: "Refresh local repository indexes." },
      { command: "helm dependency update ./chart", description: "Resolve and download chart dependencies." },
    ],
  },
  {
    category: "Render & validate",
    commands: [
      { command: "helm template web ./chart", description: "Render manifests locally without installing a release." },
      { command: "helm lint ./chart", description: "Check chart structure and common errors." },
      { command: "helm install web ./chart --set image.tag=2.0", description: "Override an individual value from the command line." },
      { command: "helm install web ./chart -f values-prod.yaml", description: "Merge overrides from an additional values file." },
    ],
  },
];

const legacyHelmFlashcards = [
  ["chart", "What is a Helm chart?", "A versioned package of Kubernetes templates, default values, metadata, and optional dependencies."],
  ["release", "What is a Helm release?", "A named chart installation with its own configuration and revision history."],
  ["values", "What is `values.yaml`?", "The chart's default configuration, exposed to templates through `.Values`."],
  ["templates", "What lives in `templates/`?", "Kubernetes manifests and text files rendered through Helm's Go templating engine."],
  ["install", "What does `helm install` do?", "It renders a chart and creates a new named release in a cluster."],
  ["upgrade", "What does `helm upgrade` do?", "It updates a release and creates a new revision."],
  ["rollback", "What does `helm rollback` do?", "It restores a release to a previous revision."],
  ["uninstall", "What does `helm uninstall` do?", "It removes a release and its managed Kubernetes resources."],
  ["template", "What does `helm template` do?", "It renders chart manifests locally without installing them."],
  ["lint", "What does `helm lint` do?", "It checks chart structure and reports likely errors."],
  ["repository", "What is a Helm repository?", "A server exposing an index and packaged charts for discovery and download."],
  ["dependencies", "Where are chart dependencies declared?", "In the `dependencies` section of Chart.yaml."],
  ["helpers", "What is `_helpers.tpl` used for?", "Reusable named templates, commonly names and labels."],
  ["set", "What does `--set` do?", "It overrides one or more values from the command line."],
  ["values-file", "What does `-f values-prod.yaml` do?", "It merges values from an additional file over chart defaults."],
].map(([id, front, back]) => ({ id: `helm-fc-${id}`, front, back }));

const legacyHelmMultipleChoice = [
  ["metadata", "Which file contains chart name and version?", ["values.yaml", "Chart.yaml", "templates.yaml", "index.yaml"], 1, "Chart.yaml stores chart metadata."],
  ["defaults", "Where are default chart settings normally defined?", ["values.yaml", "NOTES.txt", "_helpers.tpl", "Chart.lock"], 0, "values.yaml contains defaults."],
  ["release", "What is a Helm release?", ["A repository", "A named chart installation", "A template function", "A packaged cluster"], 1, "A release is a named installed chart."],
  ["templates-dir", "Where do Kubernetes resource templates belong?", ["charts/", "templates/", "crds-only/", "values/"], 1, "templates/ is rendered into manifests."],
  ["helpers", "Which file conventionally contains named templates?", ["Chart.yaml", "_helpers.tpl", "values.schema.json", "NOTES.md"], 1, "_helpers.tpl stores reusable definitions."],
  ["install", "Which command creates a new release?", ["helm create", "helm install", "helm upgrade", "helm package"], 1, "helm install creates a release."],
  ["upgrade", "Which command changes an existing release?", ["helm upgrade", "helm update", "helm apply", "helm patch"], 0, "helm upgrade creates a new release revision."],
  ["install-flag", "Which flag makes upgrade install a missing release?", ["--create", "--new", "--install", "--force-new"], 2, "--install combines upgrade and install behavior."],
  ["rollback", "Which command restores an older revision?", ["helm restore", "helm rollback", "helm history --apply", "helm undo"], 1, "helm rollback selects an earlier revision."],
  ["uninstall", "Which command removes a release?", ["helm delete-chart", "helm uninstall", "helm remove-repo", "helm purge-chart"], 1, "helm uninstall removes the release."],
  ["list", "Which command lists releases?", ["helm search", "helm list", "helm get", "helm status --all"], 1, "helm list displays releases."],
  ["status", "Which command shows one release's status?", ["helm inspect", "helm status", "helm show", "helm verify"], 1, "helm status describes a release."],
  ["template", "Which command renders manifests without installing?", ["helm template", "helm dry", "helm render-chart", "helm output"], 0, "helm template renders locally."],
  ["lint", "Which command checks a chart for likely errors?", ["helm test", "helm verify", "helm lint", "helm validate-release"], 2, "helm lint validates chart conventions."],
  ["repo-add", "Which command registers a repository?", ["helm repo add", "helm add repo", "helm repository install", "helm pull --repo"], 0, "helm repo add stores a repository URL."],
  ["repo-update", "Which command refreshes repository indexes?", ["helm update", "helm repo update", "helm dependency update", "helm search update"], 1, "helm repo update refreshes indexes."],
  ["search", "Which command searches configured repositories?", ["helm find repo", "helm search repo", "helm repo grep", "helm list charts"], 1, "helm search repo searches chart indexes."],
  ["get-values", "Which command shows computed release values?", ["helm show values", "helm get values", "helm status --values", "helm values get"], 1, "helm get values reads release configuration."],
  ["set", "Which option overrides one scalar value?", ["--value", "--set", "--param", "--override-file"], 1, "--set supplies command-line overrides."],
  ["file", "Which option loads an additional values file?", ["-f", "-t", "-r", "-p"], 0, "-f or --values merges a file."],
  ["package", "What does `helm package` create?", ["A release", "A chart archive", "A repository index only", "A rendered manifest"], 1, "It creates a versioned .tgz chart archive."],
  ["dependency", "Where are dependencies declared in Helm 3?", ["values.yaml", "requirements.txt", "Chart.yaml", "Chart.lock only"], 2, "Chart.yaml contains dependencies."],
  ["version", "What does Chart.yaml `version` identify?", ["Kubernetes version", "Chart package version", "Application image tag only", "Release revision"], 1, "version is the chart's SemVer package version."],
  ["app-version", "What does `appVersion` describe?", ["The chart API", "The packaged application's version", "The release revision", "The Helm client"], 1, "appVersion is informational application metadata."],
  ["debug", "Which combination helps inspect an install without applying resources?", ["helm install --delete", "helm install --dry-run --debug", "helm lint --apply", "helm status --render"], 1, "Dry-run and debug render installation output without applying it."],
].map(([id, question, options, answer, explanation]) => ({
  id: `helm-mc-${id}`, question, options, answer, explanation,
}));

const legacyHelmCommandQuiz = [
  ["create", "Create a new chart named `webapp`.", ["helm create webapp"]],
  ["install", "Install chart `./webapp` as release `web`.", ["helm install web ./webapp"]],
  ["custom-release", "Install repository chart `bitnami/nginx` as release `frontend`.", ["helm install frontend bitnami/nginx"]],
  ["upgrade", "Upgrade release `web` using chart `./webapp`.", ["helm upgrade web ./webapp"]],
  ["upgrade-install", "Upgrade release `web` from `./webapp`, installing it if absent.", ["helm upgrade --install web ./webapp", "helm upgrade web ./webapp --install"]],
  ["uninstall", "Uninstall release `web`.", ["helm uninstall web", "helm delete web"]],
  ["list", "List releases in the current namespace.", ["helm list", "helm ls"]],
  ["list-all", "List releases across all namespaces.", ["helm list -A", "helm list --all-namespaces", "helm ls -A"]],
  ["status", "Show status for release `web`.", ["helm status web"]],
  ["rollback", "Roll release `web` back to revision 2.", ["helm rollback web 2"]],
  ["history", "Show release history for `web`.", ["helm history web"]],
  ["template", "Render release `web` from `./webapp` locally.", ["helm template web ./webapp"]],
  ["lint", "Lint chart `./webapp`.", ["helm lint ./webapp"]],
  ["repo-add", "Add repository `bitnami` at `https://charts.bitnami.com/bitnami`.", ["helm repo add bitnami https://charts.bitnami.com/bitnami"]],
  ["repo-update", "Refresh configured repository indexes.", ["helm repo update", "helm repo up"]],
  ["search", "Search repositories for nginx charts.", ["helm search repo nginx"]],
  ["get-values", "Show values used by release `web`.", ["helm get values web"]],
  ["get-all-values", "Show all computed values for release `web`.", ["helm get values web --all", "helm get values web -a"]],
  ["set", "Install `./webapp` as `web` with replicaCount set to 3.", ["helm install web ./webapp --set replicaCount=3", "helm install web ./webapp --set=replicaCount=3"]],
  ["values-file", "Install `./webapp` as `web` using `values-prod.yaml`.", ["helm install web ./webapp -f values-prod.yaml", "helm install web ./webapp --values values-prod.yaml"]],
  ["package", "Package chart `./webapp`.", ["helm package ./webapp"]],
  ["pull", "Download chart `bitnami/nginx`.", ["helm pull bitnami/nginx", "helm fetch bitnami/nginx"]],
  ["show-values", "Show default values for `bitnami/nginx`.", ["helm show values bitnami/nginx", "helm inspect values bitnami/nginx"]],
  ["show-chart", "Show metadata for `bitnami/nginx`.", ["helm show chart bitnami/nginx", "helm inspect chart bitnami/nginx"]],
  ["dependency", "Download or update dependencies for `./webapp`.", ["helm dependency update ./webapp", "helm dep update ./webapp"]],
].map(([id, prompt, answers]) => ({
  id: `helm-cmd-${id}`,
  prompt,
  answers,
  explanation: `A valid answer is \`${answers[0]}\`. Supported Helm aliases and equivalent flag placement are accepted where appropriate.`,
}));

const chartBase = [
  h.chartField("apiVersion", "v2"),
  h.chartField("name", "webapp"),
  h.chartField("version", "0.1.0"),
];

const baseHelmPractice = [
  {
    id: "helm-chart-basic", title: "Basic Chart.yaml", filename: "Chart.yaml",
    instruction: "Write Chart.yaml for an application chart named `webapp`, version `0.1.0`, and appVersion `1.0.0`.",
    starter: "apiVersion: v2\nname: webapp\n", solution: "apiVersion: v2\nname: webapp\ndescription: A web application chart\ntype: application\nversion: 0.1.0\nappVersion: \"1.0.0\"\n",
    explanation: "Helm 3 application charts use apiVersion v2 and distinguish chart version from appVersion.",
    rules: [...chartBase, h.chartField("appVersion", "1.0.0"), h.chartField("type", "application")],
  },
  {
    id: "helm-values-nginx", title: "Nginx values", filename: "values.yaml",
    instruction: "Write values for nginx image repository, tag 1.27, and replicaCount 2.",
    starter: "replicaCount: 2\nimage:\n", solution: "replicaCount: 2\nimage:\n  repository: nginx\n  tag: \"1.27\"\n",
    explanation: "values.yaml supplies structured defaults that templates read through .Values.",
    rules: [expectedYamlValue("replicaCount", 2), expectedYamlValue("repository", "nginx"), expectedYamlValue("tag", "1.27")],
  },
  {
    id: "helm-deployment", title: "Deployment template", filename: "templates/deployment.yaml",
    instruction: "Write a Deployment template using replicaCount and image repository/tag from .Values.",
    starter: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n", solution: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include "webapp.fullname" . }}\nspec:\n  replicas: {{ .Values.replicaCount }}\n  selector:\n    matchLabels:\n      app: {{ include "webapp.name" . }}\n  template:\n    metadata:\n      labels:\n        app: {{ include "webapp.name" . }}\n    spec:\n      containers:\n        - name: webapp\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n',
    explanation: "A chart template keeps Kubernetes structure while replacing configurable fields with Helm expressions.",
    rules: [k.apiVersion("apps/v1"), k.kind("Deployment"), h.yamlKey("metadata"), h.yamlKey("spec"), h.values("replicaCount"), h.yamlKey("selector"), h.yamlKey("template"), h.yamlKey("containers"), h.values("image.repository"), h.values("image.tag")],
  },
  {
    id: "helm-service", title: "Service template", filename: "templates/service.yaml",
    instruction: "Write a Service template using .Values.service.type and .Values.service.port.",
    starter: "apiVersion: v1\nkind: Service\nmetadata:\n", solution: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: {{ include "webapp.fullname" . }}\nspec:\n  type: {{ .Values.service.type }}\n  ports:\n    - port: {{ .Values.service.port }}\n      targetPort: http\n  selector:\n    app: {{ include "webapp.name" . }}\n',
    explanation: "The Service type and port should remain configurable through values.",
    rules: [k.apiVersion("v1"), k.kind("Service"), h.yamlKey("metadata"), h.yamlKey("spec"), h.values("service.type"), h.values("service.port"), h.yamlKey("selector")],
  },
  {
    id: "helm-ingress", title: "Conditional Ingress", filename: "templates/ingress.yaml",
    instruction: "Write an Ingress template rendered only when .Values.ingress.enabled is true.",
    starter: "{{- if .Values.ingress.enabled }}\n", solution: '{{- if .Values.ingress.enabled }}\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: {{ include "webapp.fullname" . }}\nspec:\n  rules:\n    - host: {{ .Values.ingress.host }}\n{{- end }}\n',
    explanation: "Wrapping the resource in an if block makes Ingress creation optional.",
    rules: [h.if(".Values.ingress.enabled"), k.apiVersion("networking.k8s.io/v1"), k.kind("Ingress"), h.values("ingress.host"), h.end],
  },
  {
    id: "helm-configmap", title: "ConfigMap from values", filename: "templates/configmap.yaml",
    instruction: "Write a ConfigMap template named with the chart fullname and render .Values.config under data using toYaml.",
    starter: "apiVersion: v1\nkind: ConfigMap\n", solution: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: {{ include "webapp.fullname" . }}\ndata:\n{{ toYaml .Values.config | nindent 2 }}\n',
    explanation: "toYaml and nindent render a values map as correctly indented YAML.",
    rules: [k.apiVersion("v1"), k.kind("ConfigMap"), h.include("webapp.fullname"), h.yamlKey("data"), h.values("config"), requiredString("toYaml function", "toYaml"), requiredString("nindent function", "nindent")],
  },
  {
    id: "helm-secret", title: "Secret from values", filename: "templates/secret.yaml",
    instruction: "Write an Opaque Secret template using .Values.secret.password with b64enc.",
    starter: "apiVersion: v1\nkind: Secret\n", solution: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: {{ include "webapp.fullname" . }}\ntype: Opaque\ndata:\n  password: {{ .Values.secret.password | b64enc | quote }}\n',
    explanation: "Secret data is base64 encoded; Helm functions can encode and quote the supplied value.",
    rules: [k.apiVersion("v1"), k.kind("Secret"), expectedYamlValue("type", "Opaque"), h.yamlKey("data"), h.values("secret.password"), requiredString("b64enc function", "b64enc")],
  },
  {
    id: "helm-helper", title: "Fullname helper", filename: "templates/_helpers.tpl",
    instruction: "Define named template `webapp.fullname` that defaults to .Release.Name.",
    starter: '{{- define "webapp.fullname" -}}\n', solution: '{{- define "webapp.fullname" -}}\n{{- default .Release.Name .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}\n{{- end }}\n',
    explanation: "Named templates centralize naming logic and are called with include.",
    rules: [h.define("webapp.fullname"), requiredString(".Release.Name", ".Release.Name"), h.values("fullnameOverride"), h.end],
  },
  {
    id: "helm-include", title: "Use a named template", filename: "templates/serviceaccount.yaml",
    instruction: "Write metadata.name using include for `webapp.fullname`.",
    starter: "apiVersion: v1\nkind: ServiceAccount\nmetadata:\n", solution: 'apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: {{ include "webapp.fullname" . }}\n',
    explanation: "include invokes a named template and returns text that can be placed in YAML.",
    rules: [k.apiVersion("v1"), k.kind("ServiceAccount"), h.yamlKey("metadata"), h.include("webapp.fullname")],
  },
  {
    id: "helm-if", title: "Conditional ServiceAccount", filename: "templates/serviceaccount.yaml",
    instruction: "Render a ServiceAccount only if .Values.serviceAccount.create is true.",
    starter: "{{- if .Values.serviceAccount.create }}\n", solution: '{{- if .Values.serviceAccount.create }}\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: {{ include "webapp.fullname" . }}\n{{- end }}\n',
    explanation: "Helm if blocks conditionally include whole Kubernetes resources.",
    rules: [h.if(".Values.serviceAccount.create"), k.kind("ServiceAccount"), h.include("webapp.fullname"), h.end],
  },
  {
    id: "helm-range", title: "Range over environment values", filename: "templates/deployment.yaml",
    instruction: "Use range over .Values.env to render environment variable name and value entries.",
    starter: "env:\n", solution: 'env:\n{{- range .Values.env }}\n  - name: {{ .name }}\n    value: {{ .value | quote }}\n{{- end }}\n',
    explanation: "range iterates through a values collection while changing the current dot scope.",
    rules: [h.yamlKey("env"), h.range(".Values.env"), h.template(".name", "{{ .name }}"), h.template(".value | quote", "{{ .value | quote }}"), h.end],
  },
  {
    id: "helm-values-complete", title: "Application values", filename: "values.yaml",
    instruction: "Write values for replicaCount, image repository/tag, Service type/port, and enabled Ingress.",
    starter: "replicaCount: 2\n", solution: 'replicaCount: 2\nimage:\n  repository: nginx\n  tag: "1.27"\nservice:\n  type: ClusterIP\n  port: 80\ningress:\n  enabled: true\n  host: app.example.com\n',
    explanation: "A structured values file groups configuration by template concern.",
    rules: [expectedYamlValue("replicaCount", 2), h.valuesField("image"), expectedYamlValue("repository", "nginx"), expectedYamlValue("tag", "1.27"), h.valuesField("service"), expectedYamlValue("type", "ClusterIP"), expectedYamlValue("port", 80), h.valuesField("ingress"), expectedYamlValue("enabled", "true"), expectedYamlValue("host", "app.example.com")],
  },
  {
    id: "helm-structure", title: "Frontend/backend chart structure", filename: "chart-structure.txt",
    instruction: "Write a chart file tree containing Chart.yaml, values.yaml, and frontend/backend Deployment templates.",
    starter: "webapp/\n", solution: "webapp/\n  Chart.yaml\n  values.yaml\n  templates/\n    frontend-deployment.yaml\n    backend-deployment.yaml\n",
    explanation: "A single chart can contain multiple related Kubernetes workload templates.",
    rules: [requiredString("Chart.yaml", "Chart.yaml"), requiredString("values.yaml", "values.yaml"), requiredString("templates/", "templates/"), requiredString("frontend Deployment template", "frontend-deployment.yaml"), requiredString("backend Deployment template", "backend-deployment.yaml")],
  },
  {
    id: "helm-notes", title: "Release NOTES", filename: "templates/NOTES.txt",
    instruction: "Write NOTES.txt that includes .Release.Name and a kubectl command using .Release.Namespace.",
    starter: "Release: {{ .Release.Name }}\n", solution: 'Release: {{ .Release.Name }}\nRun:\n  kubectl get pods -n {{ .Release.Namespace }}\n',
    explanation: "NOTES.txt is rendered after install/upgrade to give release-specific usage guidance.",
    rules: [h.template(".Release.Name", "{{ .Release.Name }}"), h.template(".Release.Namespace", "{{ .Release.Namespace }}"), requiredString("kubectl guidance", "kubectl")],
  },
  {
    id: "helm-dependency", title: "Chart dependency", filename: "Chart.yaml",
    instruction: "Add a dependency on Bitnami PostgreSQL version 15.5.0 from its repository.",
    starter: "apiVersion: v2\nname: webapp\nversion: 0.1.0\n", solution: 'apiVersion: v2\nname: webapp\nversion: 0.1.0\ndependencies:\n  - name: postgresql\n    version: 15.5.0\n    repository: "https://charts.bitnami.com/bitnami"\n',
    explanation: "Chart dependencies declare a chart name, version constraint, and repository URL.",
    rules: [...chartBase, h.yamlKey("dependencies"), expectedYamlValue("name", "postgresql"), expectedYamlValue("version", "15.5.0"), expectedYamlValue("repository", "https://charts.bitnami.com/bitnami")],
  },
];

export const helmPractice = [
  ...baseHelmPractice,
  ...helmExtraPractice,
];
