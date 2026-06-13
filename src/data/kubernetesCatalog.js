const definitions = {
  "Kubernetes basics": ["operating declarative container platforms", ["apiVersion", "kind", "metadata"], ["Kubernetes API", "desired state"], [["Kubernetes API", "beginner", "kubectl api-resources"], ["declarative state", "beginner", "kubectl apply -f app.yaml"], ["resource manifest", "beginner", "kubectl explain pod"]]],
  "Cluster architecture": ["understanding control-plane and worker responsibilities", ["control plane", "API server", "etcd"], ["nodes", "controllers"], [["control plane", "intermediate", "kubectl cluster-info"], ["kube-apiserver", "intermediate", "kubectl get --raw /readyz"], ["etcd", "advanced", "kubectl get pods -n kube-system"]]],
  Nodes: ["operating worker machines and their health", ["status", "roles", "conditions"], ["kubelet", "scheduling"], [["Node", "beginner", "kubectl get nodes"], ["node conditions", "intermediate", "kubectl describe node worker-1"], ["cordon and drain", "intermediate", "kubectl cordon worker-1"]]],
  Pods: ["running the smallest deployable workload unit", ["containers", "restartPolicy", "status"], ["containers", "probes"], [["Pod", "beginner", "kubectl get pods"], ["Pod lifecycle", "intermediate", "kubectl get pod nginx -o yaml"], ["Pod debugging", "intermediate", "kubectl exec -it nginx -- sh"]]],
  ReplicaSets: ["maintaining a stable number of matching Pods", ["replicas", "selector", "template"], ["Deployment", "labels"], [["ReplicaSet", "beginner", "kubectl get replicasets"], ["desired replicas", "intermediate", "kubectl scale rs web --replicas=3"], ["ReplicaSet selector", "intermediate", "kubectl describe rs web"]]],
  Deployments: ["managing stateless rollouts through ReplicaSets", ["replicas", "strategy", "template"], ["ReplicaSet", "rollout"], [["Deployment", "beginner", "kubectl get deployments"], ["rolling update", "intermediate", "kubectl rollout status deployment/web"], ["deployment scaling", "beginner", "kubectl scale deployment web --replicas=3"]]],
  StatefulSets: ["running ordered workloads with stable identity", ["serviceName", "replicas", "volumeClaimTemplates"], ["headless Service", "PVC"], [["StatefulSet", "intermediate", "kubectl get statefulsets"], ["stable Pod identity", "intermediate", "kubectl get pods -l app=postgres"], ["StatefulSet rollout", "advanced", "kubectl rollout status statefulset/postgres"]]],
  DaemonSets: ["placing one Pod on every eligible Node", ["selector", "template", "updateStrategy"], ["Node", "toleration"], [["DaemonSet", "intermediate", "kubectl get daemonsets"], ["node agent", "intermediate", "kubectl describe daemonset log-agent"], ["DaemonSet rollout", "advanced", "kubectl rollout status daemonset/log-agent"]]],
  Jobs: ["running finite work to successful completion", ["completions", "parallelism", "backoffLimit"], ["CronJob", "Pod"], [["Job", "beginner", "kubectl get jobs"], ["Job completion", "intermediate", "kubectl wait --for=condition=complete job/migrate"], ["Job logs", "intermediate", "kubectl logs job/migrate"]]],
  CronJobs: ["scheduling recurring Jobs", ["schedule", "jobTemplate", "concurrencyPolicy"], ["Job", "cron"], [["CronJob", "beginner", "kubectl get cronjobs"], ["CronJob schedule", "intermediate", "kubectl describe cronjob nightly"], ["manual CronJob run", "advanced", "kubectl create job --from=cronjob/nightly nightly-now"]]],
  Services: ["providing stable discovery for selected Pods", ["selector", "ports", "type"], ["EndpointSlice", "DNS"], [["Service", "beginner", "kubectl get services"], ["Service endpoints", "intermediate", "kubectl get endpointslices"], ["Service debugging", "intermediate", "kubectl describe service backend"]]],
  ClusterIP: ["exposing a Service inside the cluster", ["type", "clusterIP", "ports"], ["Service", "DNS"], [["ClusterIP Service", "beginner", "kubectl expose deployment backend --port=80 --target-port=8080"], ["cluster DNS", "intermediate", "kubectl get svc backend -o wide"], ["headless Service", "advanced", "kubectl get svc postgres -o yaml"]]],
  NodePort: ["publishing a Service on every Node", ["type", "nodePort", "ports"], ["Service", "firewall"], [["NodePort Service", "beginner", "kubectl expose deployment web --type=NodePort --port=80"], ["nodePort range", "intermediate", "kubectl get svc web -o yaml"], ["NodePort troubleshooting", "intermediate", "kubectl describe svc web"]]],
  LoadBalancer: ["requesting provider-managed external access", ["type", "loadBalancerIP", "status"], ["cloud controller", "Service"], [["LoadBalancer Service", "beginner", "kubectl expose deployment web --type=LoadBalancer --port=80"], ["external IP", "intermediate", "kubectl get svc web -w"], ["load balancer status", "intermediate", "kubectl describe svc web"]]],
  Ingress: ["routing HTTP and HTTPS traffic to Services", ["ingressClassName", "rules", "tls"], ["Ingress controller", "Service"], [["Ingress", "beginner", "kubectl get ingress"], ["Ingress rules", "intermediate", "kubectl describe ingress app"], ["Ingress class", "intermediate", "kubectl get ingressclass"]]],
  "Gateway basics": ["using the Gateway API for role-oriented traffic routing", ["gatewayClassName", "listeners", "parentRefs"], ["HTTPRoute", "GatewayClass"], [["Gateway", "intermediate", "kubectl get gateways"], ["HTTPRoute", "intermediate", "kubectl get httproutes"], ["GatewayClass", "advanced", "kubectl get gatewayclasses"]]],
  Namespaces: ["scoping names, policy, quotas, and team resources", ["metadata.name", "labels", "status"], ["RBAC", "ResourceQuota"], [["Namespace", "beginner", "kubectl get namespaces"], ["namespace selection", "beginner", "kubectl get pods -n dev"], ["default namespace", "intermediate", "kubectl config set-context --current --namespace=dev"]]],
  "Labels and selectors": ["organizing Kubernetes objects with labels and selectors", ["metadata.labels", "matchLabels", "matchExpressions"], ["annotations", "Service selector"], [["labels", "beginner", "kubectl get pods --show-labels"], ["label selector", "beginner", "kubectl get pods -l app=api"], ["set label", "intermediate", "kubectl label pod api tier=backend"]]],
  ConfigMaps: ["supplying non-sensitive workload configuration", ["data", "binaryData", "immutable"], ["envFrom", "volume"], [["ConfigMap", "beginner", "kubectl get configmaps"], ["create ConfigMap", "beginner", "kubectl create configmap app-config --from-literal=LOG_LEVEL=info"], ["inspect ConfigMap", "intermediate", "kubectl get configmap app-config -o yaml"]]],
  Secrets: ["supplying sensitive workload values", ["data", "stringData", "type"], ["encryption at rest", "ServiceAccount"], [["Secret", "beginner", "kubectl get secrets"], ["create Secret", "beginner", "kubectl create secret generic app-secret --from-literal=PASSWORD=changeme"], ["inspect Secret metadata", "intermediate", "kubectl describe secret app-secret"]]],
  Volumes: ["sharing storage among containers in a Pod", ["volumes", "volumeMounts", "mountPath"], ["emptyDir", "PVC"], [["Pod volumes", "beginner", "kubectl explain pod.spec.volumes"], ["volume mounts", "intermediate", "kubectl explain pod.spec.containers.volumeMounts"], ["emptyDir", "intermediate", "kubectl explain pod.spec.volumes.emptyDir"]]],
  PersistentVolumes: ["representing cluster storage independently of Pods", ["capacity", "accessModes", "persistentVolumeReclaimPolicy"], ["PVC", "StorageClass"], [["PersistentVolume", "intermediate", "kubectl get persistentvolumes"], ["PV status", "intermediate", "kubectl describe pv app-data"], ["PV reclaim policy", "advanced", "kubectl get pv -o custom-columns=NAME:.metadata.name,RECLAIM:.spec.persistentVolumeReclaimPolicy"]]],
  PersistentVolumeClaims: ["requesting persistent storage for workloads", ["accessModes", "resources.requests", "storageClassName"], ["PV", "StatefulSet"], [["PersistentVolumeClaim", "beginner", "kubectl get pvc"], ["PVC status", "intermediate", "kubectl describe pvc app-data"], ["PVC capacity", "intermediate", "kubectl get pvc app-data -o wide"]]],
  StorageClasses: ["defining dynamic storage provisioning policy", ["provisioner", "reclaimPolicy", "volumeBindingMode"], ["PVC", "CSI"], [["StorageClass", "intermediate", "kubectl get storageclasses"], ["default StorageClass", "intermediate", "kubectl get sc -o yaml"], ["storage provisioner", "advanced", "kubectl describe sc fast"]]],
  RBAC: ["authorizing Kubernetes API actions", ["apiGroups", "resources", "verbs"], ["subjects", "roleRef"], [["RBAC", "beginner", "kubectl auth can-i get pods"], ["authorization check", "intermediate", "kubectl auth can-i create deployments -n dev"], ["permission list", "advanced", "kubectl auth can-i --list"]]],
  ServiceAccounts: ["providing workload identities for API access", ["metadata.name", "automountServiceAccountToken", "imagePullSecrets"], ["RBAC", "token"], [["ServiceAccount", "beginner", "kubectl get serviceaccounts"], ["create ServiceAccount", "beginner", "kubectl create serviceaccount app-sa"], ["ServiceAccount token", "intermediate", "kubectl create token app-sa"]]],
  Roles: ["defining namespaced permissions", ["rules", "resources", "verbs"], ["RoleBinding", "Namespace"], [["Role", "beginner", "kubectl get roles"], ["Role rules", "intermediate", "kubectl describe role pod-reader"], ["create Role", "intermediate", "kubectl create role pod-reader --verb=get,list,watch --resource=pods"]]],
  RoleBindings: ["granting namespaced roles to subjects", ["subjects", "roleRef", "namespace"], ["Role", "ServiceAccount"], [["RoleBinding", "beginner", "kubectl get rolebindings"], ["RoleBinding details", "intermediate", "kubectl describe rolebinding read-pods"], ["create RoleBinding", "intermediate", "kubectl create rolebinding read-pods --role=pod-reader --serviceaccount=dev:app-sa"]]],
  ClusterRoles: ["defining cluster-wide or reusable permissions", ["rules", "nonResourceURLs", "aggregationRule"], ["ClusterRoleBinding", "RoleBinding"], [["ClusterRole", "intermediate", "kubectl get clusterroles"], ["ClusterRole rules", "intermediate", "kubectl describe clusterrole view"], ["create ClusterRole", "advanced", "kubectl create clusterrole node-reader --verb=get,list --resource=nodes"]]],
  ClusterRoleBindings: ["granting ClusterRoles across the cluster", ["subjects", "roleRef", "apiGroup"], ["ClusterRole", "ServiceAccount"], [["ClusterRoleBinding", "intermediate", "kubectl get clusterrolebindings"], ["binding details", "intermediate", "kubectl describe clusterrolebinding node-readers"], ["create cluster binding", "advanced", "kubectl create clusterrolebinding node-readers --clusterrole=node-reader --group=platform"]]],
  Probes: ["checking container startup, readiness, and liveness", ["httpGet", "exec", "initialDelaySeconds"], ["kubelet", "restart"], [["livenessProbe", "intermediate", "kubectl explain pod.spec.containers.livenessProbe"], ["readinessProbe", "intermediate", "kubectl explain pod.spec.containers.readinessProbe"], ["startupProbe", "advanced", "kubectl explain pod.spec.containers.startupProbe"]]],
  "Requests and limits": ["guiding scheduling and enforcing resource boundaries", ["requests", "limits", "cpu"], ["QoS", "HPA"], [["resource requests", "beginner", "kubectl describe pod api"], ["resource limits", "intermediate", "kubectl get pod api -o jsonpath='{.spec.containers[0].resources}'"], ["LimitRange", "advanced", "kubectl get limitranges"]]],
  Scheduling: ["placing Pods on suitable Nodes", ["nodeName", "schedulerName", "priorityClassName"], ["affinity", "taints"], [["scheduler", "intermediate", "kubectl get pods -o wide"], ["pending Pod", "intermediate", "kubectl describe pod pending-api"], ["scheduler events", "advanced", "kubectl get events --field-selector reason=FailedScheduling"]]],
  "Taints and tolerations": ["repelling Pods unless they explicitly tolerate Node taints", ["key", "effect", "tolerationSeconds"], ["Node", "scheduling"], [["Node taint", "intermediate", "kubectl taint nodes worker-1 dedicated=gpu:NoSchedule"], ["toleration", "intermediate", "kubectl explain pod.spec.tolerations"], ["remove taint", "intermediate", "kubectl taint nodes worker-1 dedicated=gpu:NoSchedule-"]]],
  Affinity: ["expressing workload placement preferences and requirements", ["nodeAffinity", "podAffinity", "podAntiAffinity"], ["topologyKey", "selector"], [["node affinity", "intermediate", "kubectl explain pod.spec.affinity.nodeAffinity"], ["pod affinity", "advanced", "kubectl explain pod.spec.affinity.podAffinity"], ["pod anti-affinity", "advanced", "kubectl explain pod.spec.affinity.podAntiAffinity"]]],
  HPA: ["scaling workload replicas from observed metrics", ["scaleTargetRef", "minReplicas", "metrics"], ["metrics-server", "requests"], [["HorizontalPodAutoscaler", "intermediate", "kubectl get hpa"], ["create HPA", "intermediate", "kubectl autoscale deployment web --min=2 --max=10 --cpu-percent=70"], ["HPA status", "advanced", "kubectl describe hpa web"]]],
  Rollouts: ["observing and controlling workload revisions", ["strategy", "revisionHistoryLimit", "progressDeadlineSeconds"], ["Deployment", "ReplicaSet"], [["rollout status", "beginner", "kubectl rollout status deployment/web"], ["rollout history", "intermediate", "kubectl rollout history deployment/web"], ["rollout undo", "intermediate", "kubectl rollout undo deployment/web"]]],
  Events: ["reading chronological evidence emitted by cluster components", ["type", "reason", "message"], ["describe", "audit logs"], [["events", "beginner", "kubectl get events"], ["sorted events", "intermediate", "kubectl get events --sort-by=.metadata.creationTimestamp"], ["warning events", "intermediate", "kubectl get events --field-selector type=Warning"]]],
  Logs: ["reading container stdout and stderr", ["container", "previous", "timestamps"], ["logging", "sidecar"], [["Pod logs", "beginner", "kubectl logs api"], ["follow logs", "beginner", "kubectl logs -f api"], ["previous container logs", "intermediate", "kubectl logs api --previous"]]],
  Troubleshooting: ["combining status, events, logs, and network evidence", ["conditions", "exitCode", "reason"], ["debug", "ephemeral container"], [["describe workload", "beginner", "kubectl describe pod api"], ["debug container", "advanced", "kubectl debug pod/api -it --image=busybox"], ["cluster dump", "advanced", "kubectl cluster-info dump"]]],
  "kubectl workflows": ["using repeatable imperative and declarative client operations", ["-n", "-o", "--context"], ["kubeconfig", "apply"], [["kubectl get", "beginner", "kubectl get all -n dev"], ["kubectl apply", "beginner", "kubectl apply -f manifests/"], ["kubectl diff", "intermediate", "kubectl diff -f manifests/"]]],
  "DevOps workflows": ["integrating manifests with delivery, policy, and observability", ["dry-run", "server-side", "field-manager"], ["GitOps", "CI/CD"], [["server dry run", "intermediate", "kubectl apply --server-side --dry-run=server -f app.yaml"], ["rollout image", "intermediate", "kubectl set image deployment/api api=repo/api:1.2.0"], ["wait for availability", "intermediate", "kubectl wait --for=condition=available deployment/api --timeout=120s"]]],
};

function makeEntry(category, purpose, fields, related, item) {
  const [command, difficulty, example] = item;
  return {
    category,
    difficulty,
    command,
    topic: command,
    resource: command,
    fullMeaning: command,
    description: `${command} is used for ${purpose}. Example workflow: ${example}.`,
    basicExplanation: `${command} is used for ${purpose}.`,
    professionalExplanation: `${command} supports declarative Kubernetes operations by making desired state, runtime status, or API intent inspectable and repeatable.`,
    commonSyntax: example,
    syntax: example,
    commonFlags: fields,
    commonFields: fields,
    examples: [example],
    devOpsUseCase: `Useful for ${purpose} in delivery and production operations.`,
    commonMistake: `Using ${command} without checking namespace, selectors, current context, or resulting status.`,
    relatedCommands: related,
    relatedConcepts: related,
    answers: [example],
  };
}

export const kubernetesCategories = Object.keys(definitions);

export const kubernetesCommandCatalog = Object.entries(definitions).flatMap(
  ([category, [purpose, fields, related, items]]) => (
    items.map((item) => makeEntry(category, purpose, fields, related, item))
  ),
);

export const kubernetesReference = kubernetesCategories.map((category) => ({
  category,
  commands: kubernetesCommandCatalog.filter((item) => item.category === category),
}));

export const kubernetesFlashcards = kubernetesCommandCatalog.map((item, index) => ({
  id: index === 0 ? "k8s-fc-pod" : `k8s-fc-${index + 1}`,
  category: item.category,
  difficulty: item.difficulty,
  front: `What should you know about \`${item.command}\`?`,
  basicExplanation: item.basicExplanation,
  professionalExplanation: item.professionalExplanation,
  example: item.examples[0],
  useCase: item.devOpsUseCase,
  relatedConcepts: item.relatedCommands,
}));

export const kubernetesMultipleChoice = kubernetesCommandCatalog.map((item, index, catalog) => ({
  id: `k8s-mcq-${index + 1}`,
  category: item.category,
  question: `Which Kubernetes resource, concept, or workflow best matches: ${item.basicExplanation.toLowerCase()}`,
  options: [
    item.command,
    catalog[(index + 11) % catalog.length].command,
    catalog[(index + 37) % catalog.length].command,
    catalog[(index + 73) % catalog.length].command,
  ],
  answer: 0,
  explanation: `\`${item.command}\`: ${item.professionalExplanation}`,
}));

export const kubernetesCommandQuiz = kubernetesCommandCatalog.map((item, index) => ({
  id: `k8s-command-${index + 1}`,
  category: item.category,
  prompt: `Write a kubectl command that demonstrates or inspects this Kubernetes topic: ${item.command}.`,
  answers: item.answers,
  explanation: `A valid workflow is \`${item.answers[0]}\`.`,
}));
