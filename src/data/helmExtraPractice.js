import { helmRules as h } from "../utils/helmValidation.js";
import {
  expectedYamlValue,
  kubernetesRules as k,
  requiredString,
} from "../utils/kubernetesValidation.js";

const has = (label, pattern) => ({ label, pattern });

function task(id, title, filename, instruction, solution, rules, explanation) {
  return { id, title, filename, instruction, starter: "", solution, rules, explanation };
}

export const helmExtraPractice = [
  task(
    "helm-default-function", "Default image tag", "templates/deployment.yaml",
    "Use the default function so image tag falls back to Chart.AppVersion when .Values.image.tag is empty.",
    'image: "{{ .Values.image.repository }}:{{ default .Chart.AppVersion .Values.image.tag }}"\n',
    [h.values("image.repository"), h.values("image.tag"), requiredString("default function", "default"), requiredString(".Chart.AppVersion", ".Chart.AppVersion")],
    "default makes chart rendering resilient when a value is unset.",
  ),
  task(
    "helm-quote-function", "Quote environment value", "templates/deployment.yaml",
    "Render FEATURE_FLAG from .Values.featureFlag and pipe it through quote.",
    "env:\n  - name: FEATURE_FLAG\n    value: {{ .Values.featureFlag | quote }}\n",
    [h.yamlKey("env"), requiredString("FEATURE_FLAG env name", "FEATURE_FLAG"), h.values("featureFlag"), requiredString("quote function", "quote")],
    "quote keeps scalar values safe when YAML would otherwise coerce them.",
  ),
  task(
    "helm-toyaml-nindent", "toYaml with nindent", "templates/deployment.yaml",
    "Render .Values.podAnnotations under metadata.annotations using toYaml and nindent 8.",
    "metadata:\n  annotations:\n{{ toYaml .Values.podAnnotations | nindent 4 }}\n",
    [h.yamlKey("annotations"), h.values("podAnnotations"), requiredString("toYaml function", "toYaml"), requiredString("nindent function", "nindent")],
    "toYaml plus nindent converts structured values into correctly indented YAML.",
  ),
  task(
    "helm-resources-block", "Resources from values", "templates/deployment.yaml",
    "Render a container resources block from .Values.resources using toYaml and nindent.",
    "resources:\n{{ toYaml .Values.resources | nindent 12 }}\n",
    [h.yamlKey("resources"), h.values("resources"), requiredString("toYaml function", "toYaml"), requiredString("nindent function", "nindent")],
    "Resource requests and limits are commonly delegated to values.yaml.",
  ),
  task(
    "helm-probes-block", "Liveness and readiness probes", "templates/deployment.yaml",
    "Template livenessProbe and readinessProbe from .Values.probes.liveness and .Values.probes.readiness.",
    "livenessProbe:\n{{ toYaml .Values.probes.liveness | nindent 12 }}\nreadinessProbe:\n{{ toYaml .Values.probes.readiness | nindent 12 }}\n",
    [h.yamlKey("livenessProbe"), h.yamlKey("readinessProbe"), h.values("probes.liveness"), h.values("probes.readiness"), requiredString("toYaml function", "toYaml"), requiredString("nindent function", "nindent")],
    "Probe shapes vary, so charts often render probe maps directly from values.",
  ),
  task(
    "helm-env-values", "Environment variables from values", "templates/deployment.yaml",
    "Use range over .Values.env to render env entries with name and quoted value.",
    "env:\n{{- range .Values.env }}\n  - name: {{ .name }}\n    value: {{ .value | quote }}\n{{- end }}\n",
    [h.yamlKey("env"), h.range(".Values.env"), h.template(".name", "{{ .name }}"), h.template(".value | quote", "{{ .value | quote }}"), h.end],
    "range lets a chart render any number of environment variables from values.",
  ),
  task(
    "helm-image-pull-secrets", "Image pull secrets", "templates/deployment.yaml",
    "Render imagePullSecrets from .Values.imagePullSecrets with toYaml and nindent.",
    "imagePullSecrets:\n{{ toYaml .Values.imagePullSecrets | nindent 8 }}\n",
    [h.yamlKey("imagePullSecrets"), h.values("imagePullSecrets"), requiredString("toYaml function", "toYaml"), requiredString("nindent function", "nindent")],
    "imagePullSecrets are often environment-specific and belong in values.",
  ),
  task(
    "helm-serviceaccount-template", "ServiceAccount template", "templates/serviceaccount.yaml",
    "Render a ServiceAccount only when .Values.serviceAccount.create is true and use .Values.serviceAccount.name when provided.",
    '{{- if .Values.serviceAccount.create }}\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: {{ default (include "webapp.fullname" .) .Values.serviceAccount.name }}\n{{- end }}\n',
    [h.if(".Values.serviceAccount.create"), k.apiVersion("v1"), k.kind("ServiceAccount"), requiredString("default function", "default"), requiredString("include fullname helper", "include \"webapp.fullname\""), h.values("serviceAccount.name"), h.end],
    "The template supports either generated names or explicit serviceAccount overrides.",
  ),
  task(
    "helm-full-frontend", "Full frontend chart values", "values-frontend.yaml",
    "Write frontend values with replicaCount 2, nginx image, ClusterIP service port 80, and enabled ingress host frontend.example.com.",
    "replicaCount: 2\nimage:\n  repository: nginx\n  tag: \"1.27\"\nservice:\n  type: ClusterIP\n  port: 80\ningress:\n  enabled: true\n  host: frontend.example.com\n",
    [expectedYamlValue("replicaCount", 2), expectedYamlValue("repository", "nginx"), expectedYamlValue("tag", "1.27"), expectedYamlValue("type", "ClusterIP"), expectedYamlValue("port", 80), expectedYamlValue("enabled", "true"), expectedYamlValue("host", "frontend.example.com")],
    "Frontend charts usually expose HTTP service and optional ingress values.",
  ),
  task(
    "helm-full-backend", "Full backend chart values", "values-backend.yaml",
    "Write backend values with image backend:1.0, service port 8080, DATABASE_URL env, and resources requests.",
    "image:\n  repository: backend\n  tag: \"1.0\"\nservice:\n  port: 8080\nenv:\n  - name: DATABASE_URL\n    value: postgres://postgres:5432/app\nresources:\n  requests:\n    cpu: 100m\n    memory: 128Mi\n",
    [expectedYamlValue("repository", "backend"), expectedYamlValue("tag", "1.0"), expectedYamlValue("port", 8080), requiredString("DATABASE_URL env", "DATABASE_URL"), requiredString("postgres connection", "postgres://postgres:5432/app"), h.valuesField("resources"), expectedYamlValue("cpu", "100m"), expectedYamlValue("memory", "128Mi")],
    "Backend values combine runtime configuration, service ports, and resource requests.",
  ),
  task(
    "helm-full-postgres", "Postgres chart values", "values-postgres.yaml",
    "Write postgres values with image postgres:16, persistence enabled, 8Gi size, and POSTGRES_DB app.",
    "image:\n  repository: postgres\n  tag: \"16\"\npersistence:\n  enabled: true\n  size: 8Gi\nenv:\n  POSTGRES_DB: app\n",
    [expectedYamlValue("repository", "postgres"), expectedYamlValue("tag", "16"), h.valuesField("persistence"), expectedYamlValue("enabled", "true"), expectedYamlValue("size", "8Gi"), expectedYamlValue("POSTGRES_DB", "app")],
    "Stateful chart values commonly include image, persistence, and database initialization settings.",
  ),
  task(
    "helm-parent-values", "Parent chart values", "values.yaml",
    "Write parent chart values enabling frontend, backend, and postgres subcharts with image tags.",
    "frontend:\n  enabled: true\n  image:\n    tag: \"1.0\"\nbackend:\n  enabled: true\n  image:\n    tag: \"1.0\"\npostgres:\n  enabled: true\n  auth:\n    database: app\n",
    [h.valuesField("frontend"), h.valuesField("backend"), h.valuesField("postgres"), requiredString("frontend enabled", "enabled: true"), requiredString("backend image tag", "tag: \"1.0\""), h.valuesField("auth"), expectedYamlValue("database", "app")],
    "Parent values configure subcharts through top-level keys named after each dependency.",
  ),
  task(
    "helm-env-specific-values", "Production values file", "values-prod.yaml",
    "Write production overrides setting replicaCount 3, image tag 2.0.0, LoadBalancer service, and ingress host app.example.com.",
    "replicaCount: 3\nimage:\n  tag: \"2.0.0\"\nservice:\n  type: LoadBalancer\ningress:\n  enabled: true\n  host: app.example.com\n",
    [expectedYamlValue("replicaCount", 3), expectedYamlValue("tag", "2.0.0"), expectedYamlValue("type", "LoadBalancer"), expectedYamlValue("enabled", "true"), expectedYamlValue("host", "app.example.com")],
    "Environment-specific values override safe defaults for a target deployment environment.",
  ),
  task(
    "helm-existing-deployment", "Chart an existing Deployment", "templates/deployment.yaml",
    "Convert an existing Kubernetes Deployment to Helm by templating name, replicas, and image from values.",
    'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ include "webapp.fullname" . }}\nspec:\n  replicas: {{ .Values.replicaCount }}\n  template:\n    spec:\n      containers:\n        - name: app\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n',
    [k.apiVersion("apps/v1"), k.kind("Deployment"), h.include("webapp.fullname"), h.values("replicaCount"), h.values("image.repository"), h.values("image.tag"), h.yamlKey("containers")],
    "Helm conversion keeps the Kubernetes resource but replaces environment-specific fields with values.",
  ),
  task(
    "helm-full-app-chart", "Full frontend/backend/postgres chart", "chart-structure.txt",
    "Write a chart structure for a full frontend/backend/postgres app with templates and values for each tier.",
    "fullstack/\n  Chart.yaml\n  values.yaml\n  templates/\n    frontend-deployment.yaml\n    frontend-service.yaml\n    backend-deployment.yaml\n    backend-service.yaml\n    postgres-statefulset.yaml\n    postgres-service.yaml\n    ingress.yaml\n",
    [requiredString("Chart.yaml", "Chart.yaml"), requiredString("values.yaml", "values.yaml"), requiredString("templates/", "templates/"), requiredString("frontend deployment", "frontend-deployment.yaml"), requiredString("backend deployment", "backend-deployment.yaml"), requiredString("postgres statefulset", "postgres-statefulset.yaml"), requiredString("ingress template", "ingress.yaml")],
    "A full-stack chart organizes separate workload and Service templates under one release.",
  ),
];
