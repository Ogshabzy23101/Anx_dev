import {
  expectedYamlValue,
  kubernetesRules as k,
  requiredString,
  requiredYamlKey,
} from "../utils/kubernetesValidation.js";

const has = (label, pattern) => ({ label, pattern });
const core = (kind, name) => [k.apiVersion("v1"), k.kind(kind), k.metadataName(name)];
const apps = (kind, name) => [k.apiVersion("apps/v1"), k.kind(kind), k.metadataName(name)];

function task(id, title, filename, instruction, solution, rules, explanation) {
  return { id, title, filename, instruction, starter: "", solution, rules, explanation };
}

export const kubernetesExtraPractice = [
  task(
    "k8s-yaml-replicaset", "Nginx ReplicaSet", "replicaset.yaml",
    "Write a ReplicaSet named nginx with 3 replicas, app: nginx labels, and the nginx image.",
    "apiVersion: apps/v1\nkind: ReplicaSet\nmetadata:\n  name: nginx\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: nginx\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n        - name: nginx\n          image: nginx\n",
    [...apps("ReplicaSet", "nginx"), k.replicas(3), k.key("selector"), k.key("matchLabels"), k.key("template"), k.image("nginx"), k.value("app", "nginx")],
    "A ReplicaSet selector must match labels on its Pod template.",
  ),
  task(
    "k8s-yaml-loadbalancer", "LoadBalancer Service", "loadbalancer.yaml",
    "Write a LoadBalancer Service named web selecting app: web, port 80, and targetPort 8080.",
    "apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  type: LoadBalancer\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 8080\n",
    [...core("Service", "web"), k.value("type", "LoadBalancer"), k.value("app", "web"), k.servicePort(80), k.targetPort(8080)],
    "LoadBalancer Services request external provider integration while retaining normal Service selection.",
  ),
  task(
    "k8s-yaml-clusterrole", "Node Reader ClusterRole", "clusterrole.yaml",
    "Write a ClusterRole named node-reader that can get and list nodes.",
    "apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n  name: node-reader\nrules:\n  - apiGroups: [\"\"]\n    resources: [\"nodes\"]\n    verbs: [\"get\", \"list\"]\n",
    [k.apiVersion("rbac.authorization.k8s.io/v1"), k.kind("ClusterRole"), k.metadataName("node-reader"), requiredString("nodes resource", "nodes"), k.rbacVerb("get"), k.rbacVerb("list")],
    "ClusterRoles can grant permissions for cluster-scoped resources such as Nodes.",
  ),
  task(
    "k8s-yaml-clusterrolebinding", "Node Reader ClusterRoleBinding", "clusterrolebinding.yaml",
    "Bind ClusterRole node-reader to group platform with ClusterRoleBinding node-readers.",
    "apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: node-readers\nsubjects:\n  - kind: Group\n    name: platform\n    apiGroup: rbac.authorization.k8s.io\nroleRef:\n  apiGroup: rbac.authorization.k8s.io\n  kind: ClusterRole\n  name: node-reader\n",
    [k.apiVersion("rbac.authorization.k8s.io/v1"), k.kind("ClusterRoleBinding"), k.metadataName("node-readers"), k.key("subjects"), requiredString("Group subject", "Group"), expectedYamlValue("name", "platform", "subject name: platform"), k.key("roleRef"), has("ClusterRole reference", /roleRef:\s*\n(?:\s+[^\n]+\n)*\s+kind:\s*ClusterRole\s*\n(?:\s+[^\n]+\n)*\s+name:\s*node-reader/im)],
    "A ClusterRoleBinding grants cluster-wide permissions to its subjects.",
  ),
  task(
    "k8s-yaml-pv", "PersistentVolume", "pv.yaml",
    "Write a 5Gi PersistentVolume named app-pv with ReadWriteOnce access, Retain policy, and hostPath /data/app.",
    "apiVersion: v1\nkind: PersistentVolume\nmetadata:\n  name: app-pv\nspec:\n  capacity:\n    storage: 5Gi\n  accessModes:\n    - ReadWriteOnce\n  persistentVolumeReclaimPolicy: Retain\n  hostPath:\n    path: /data/app\n",
    [...core("PersistentVolume", "app-pv"), k.key("capacity"), k.value("storage", "5Gi"), requiredString("ReadWriteOnce access", "ReadWriteOnce"), k.value("persistentVolumeReclaimPolicy", "Retain"), k.key("hostPath"), k.value("path", "/data/app")],
    "A PersistentVolume defines capacity, access, reclaim behavior, and a backing volume source.",
  ),
  task(
    "k8s-yaml-storageclass", "Fast StorageClass", "storageclass.yaml",
    "Write a StorageClass named fast using provisioner kubernetes.io/no-provisioner, Retain policy, and WaitForFirstConsumer binding.",
    "apiVersion: storage.k8s.io/v1\nkind: StorageClass\nmetadata:\n  name: fast\nprovisioner: kubernetes.io/no-provisioner\nreclaimPolicy: Retain\nvolumeBindingMode: WaitForFirstConsumer\n",
    [k.apiVersion("storage.k8s.io/v1"), k.kind("StorageClass"), k.metadataName("fast"), k.value("provisioner", "kubernetes.io/no-provisioner"), k.value("reclaimPolicy", "Retain"), k.value("volumeBindingMode", "WaitForFirstConsumer")],
    "StorageClasses define provisioning and binding policy for matching claims.",
  ),
  task(
    "k8s-yaml-daemonset", "Node Log Agent", "daemonset.yaml",
    "Write a DaemonSet named log-agent with app: log-agent labels using fluent-bit:latest.",
    "apiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: log-agent\nspec:\n  selector:\n    matchLabels:\n      app: log-agent\n  template:\n    metadata:\n      labels:\n        app: log-agent\n    spec:\n      containers:\n        - name: fluent-bit\n          image: fluent-bit:latest\n",
    [...apps("DaemonSet", "log-agent"), k.key("selector"), k.key("matchLabels"), k.key("template"), k.value("app", "log-agent"), k.image("fluent-bit:latest")],
    "A DaemonSet template runs on every eligible Node and must match its selector.",
  ),
  task(
    "k8s-yaml-liveness", "HTTP Liveness Probe", "liveness-pod.yaml",
    "Write Pod api using image api:1.0 with an HTTP liveness probe on /health port 8080.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      livenessProbe:\n        httpGet:\n          path: /health\n          port: 8080\n",
    [...core("Pod", "api"), k.image("api:1.0"), k.key("livenessProbe"), k.key("httpGet"), k.value("path", "/health"), k.value("port", 8080)],
    "A failed liveness probe tells kubelet to restart the container.",
  ),
  task(
    "k8s-yaml-readiness", "HTTP Readiness Probe", "readiness-pod.yaml",
    "Write Pod api using image api:1.0 with an HTTP readiness probe on /ready port 8080.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      readinessProbe:\n        httpGet:\n          path: /ready\n          port: 8080\n",
    [...core("Pod", "api"), k.image("api:1.0"), k.key("readinessProbe"), k.key("httpGet"), k.value("path", "/ready"), k.value("port", 8080)],
    "Readiness controls whether a Pod receives Service traffic.",
  ),
  task(
    "k8s-yaml-resources", "Requests and Limits", "resources-pod.yaml",
    "Write Pod api with cpu request 100m, memory request 128Mi, cpu limit 500m, and memory limit 256Mi.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      resources:\n        requests:\n          cpu: 100m\n          memory: 128Mi\n        limits:\n          cpu: 500m\n          memory: 256Mi\n",
    [...core("Pod", "api"), k.key("resources"), k.key("requests"), k.key("limits"), k.value("cpu", "100m", "cpu request: 100m"), k.value("memory", "128Mi", "memory request: 128Mi"), requiredString("cpu limit: 500m", "500m"), requiredString("memory limit: 256Mi", "256Mi")],
    "Requests guide scheduling while limits bound runtime consumption.",
  ),
  task(
    "k8s-yaml-hpa", "Web HPA", "hpa.yaml",
    "Write an HPA named web targeting Deployment web, scaling from 2 to 10 replicas at 70% CPU utilization.",
    "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: web\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: web\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70\n",
    [k.apiVersion("autoscaling/v2"), k.kind("HorizontalPodAutoscaler"), k.metadataName("web"), k.key("scaleTargetRef"), requiredString("Deployment target", "Deployment"), k.value("minReplicas", 2), k.value("maxReplicas", 10), k.key("metrics"), k.value("averageUtilization", 70)],
    "An HPA links a scalable workload to metric targets and replica bounds.",
  ),
  task(
    "k8s-yaml-init-container", "Database Migration Init Container", "init-container.yaml",
    "Write Pod api with init container migrate using migrate:1.0 and main container api using api:1.0.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  initContainers:\n    - name: migrate\n      image: migrate:1.0\n  containers:\n    - name: api\n      image: api:1.0\n",
    [...core("Pod", "api"), k.key("initContainers"), requiredString("migrate init container", "migrate"), k.image("migrate:1.0"), k.key("containers"), k.image("api:1.0")],
    "Init containers finish in order before application containers start.",
  ),
  task(
    "k8s-yaml-multi-container", "App and Sidecar Pod", "multi-container.yaml",
    "Write Pod web with app image nginx and sidecar image busybox.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: web\nspec:\n  containers:\n    - name: app\n      image: nginx\n    - name: sidecar\n      image: busybox\n      command: [\"sh\", \"-c\", \"sleep 3600\"]\n",
    [...core("Pod", "web"), k.key("containers"), requiredString("app container", "name: app"), k.image("nginx"), requiredString("sidecar container", "name: sidecar"), k.image("busybox")],
    "Containers in one Pod share networking and can coordinate through volumes.",
  ),
  task(
    "k8s-yaml-configmap-env", "Environment from ConfigMap", "configmap-env.yaml",
    "Write Pod api that loads all environment variables from ConfigMap app-config.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      envFrom:\n        - configMapRef:\n            name: app-config\n",
    [...core("Pod", "api"), k.image("api:1.0"), k.key("envFrom"), k.key("configMapRef"), expectedYamlValue("name", "app-config", "ConfigMap name: app-config")],
    "`envFrom.configMapRef` imports each ConfigMap key as an environment variable.",
  ),
  task(
    "k8s-yaml-secret-env", "Environment from Secret", "secret-env.yaml",
    "Write Pod api that loads all environment variables from Secret app-secret.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      envFrom:\n        - secretRef:\n            name: app-secret\n",
    [...core("Pod", "api"), k.image("api:1.0"), k.key("envFrom"), k.key("secretRef"), expectedYamlValue("name", "app-secret", "Secret name: app-secret")],
    "`envFrom.secretRef` exposes Secret keys to the container environment.",
  ),
  task(
    "k8s-yaml-configmap-volume", "ConfigMap Volume", "configmap-volume.yaml",
    "Mount ConfigMap app-config into Pod api at /etc/app.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      volumeMounts:\n        - name: config\n          mountPath: /etc/app\n  volumes:\n    - name: config\n      configMap:\n        name: app-config\n",
    [...core("Pod", "api"), k.key("volumeMounts"), k.value("mountPath", "/etc/app"), k.key("volumes"), k.key("configMap"), expectedYamlValue("name", "app-config", "ConfigMap name: app-config")],
    "A ConfigMap volume projects configuration keys as files.",
  ),
  task(
    "k8s-yaml-secret-volume", "Secret Volume", "secret-volume.yaml",
    "Mount Secret app-secret into Pod api at /etc/secrets as read-only.",
    "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: api\n      image: api:1.0\n      volumeMounts:\n        - name: secrets\n          mountPath: /etc/secrets\n          readOnly: true\n  volumes:\n    - name: secrets\n      secret:\n        secretName: app-secret\n",
    [...core("Pod", "api"), k.key("volumeMounts"), k.value("mountPath", "/etc/secrets"), k.value("readOnly", "true"), k.key("secret"), k.value("secretName", "app-secret")],
    "Secret volumes provide files and should normally be mounted read-only.",
  ),
  task(
    "k8s-yaml-full-app", "Frontend Backend Postgres App", "full-app.yaml",
    "Write a multi-document manifest containing frontend and backend Deployments, a postgres StatefulSet, and Services named frontend, backend, and postgres.",
    "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: frontend\nspec:\n  selector:\n    matchLabels:\n      app: frontend\n  template:\n    metadata:\n      labels:\n        app: frontend\n    spec:\n      containers:\n        - name: frontend\n          image: frontend:1.0\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: backend\nspec:\n  selector:\n    matchLabels:\n      app: backend\n  template:\n    metadata:\n      labels:\n        app: backend\n    spec:\n      containers:\n        - name: backend\n          image: backend:1.0\n---\napiVersion: apps/v1\nkind: StatefulSet\nmetadata:\n  name: postgres\nspec:\n  serviceName: postgres\n  selector:\n    matchLabels:\n      app: postgres\n  template:\n    metadata:\n      labels:\n        app: postgres\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: frontend\nspec:\n  selector:\n    app: frontend\n  ports:\n    - port: 80\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: backend\nspec:\n  selector:\n    app: backend\n  ports:\n    - port: 8080\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: postgres\nspec:\n  selector:\n    app: postgres\n  ports:\n    - port: 5432\n",
    [has("frontend Deployment", /kind:\s*Deployment[\s\S]*?name:\s*frontend/), has("backend Deployment", /kind:\s*Deployment[\s\S]*?name:\s*backend/), has("postgres StatefulSet", /kind:\s*StatefulSet[\s\S]*?name:\s*postgres/), requiredString("frontend image", "frontend:1.0"), requiredString("backend image", "backend:1.0"), requiredString("postgres image", "postgres:16"), has("frontend Service", /kind:\s*Service[\s\S]*?name:\s*frontend/), has("backend Service", /kind:\s*Service[\s\S]*?name:\s*backend/), has("postgres Service", /kind:\s*Service[\s\S]*?name:\s*postgres/)],
    "A three-tier manifest combines workload controllers with stable Service discovery.",
  ),
  task(
    "k8s-yaml-servicemonitor", "Backend ServiceMonitor", "servicemonitor.yaml",
    "Write a ServiceMonitor named backend selecting app: backend and scraping endpoint port metrics every 30s.",
    "apiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  name: backend\nspec:\n  selector:\n    matchLabels:\n      app: backend\n  endpoints:\n    - port: metrics\n      interval: 30s\n",
    [k.apiVersion("monitoring.coreos.com/v1"), k.kind("ServiceMonitor"), k.metadataName("backend"), k.key("selector"), k.key("matchLabels"), k.value("app", "backend"), k.key("endpoints"), k.value("port", "metrics"), k.value("interval", "30s")],
    "A Prometheus Operator ServiceMonitor selects Services and defines scrape endpoints.",
  ),
  task(
    "k8s-yaml-networkpolicy", "Backend NetworkPolicy", "networkpolicy.yaml",
    "Write a NetworkPolicy named backend-ingress selecting app: backend and allowing ingress from Pods labeled app: frontend on TCP port 8080.",
    "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: backend-ingress\nspec:\n  podSelector:\n    matchLabels:\n      app: backend\n  policyTypes:\n    - Ingress\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels:\n              app: frontend\n      ports:\n        - protocol: TCP\n          port: 8080\n",
    [k.apiVersion("networking.k8s.io/v1"), k.kind("NetworkPolicy"), k.metadataName("backend-ingress"), k.key("podSelector"), requiredString("backend selector", "app: backend"), requiredString("Ingress policy type", "Ingress"), k.key("ingress"), requiredString("frontend source selector", "app: frontend"), k.value("protocol", "TCP"), k.value("port", 8080)],
    "NetworkPolicy selects protected Pods and explicitly allows matching sources and ports.",
  ),
];
