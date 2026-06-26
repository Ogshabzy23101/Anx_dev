# Interview Question Review

This file is generated from `src/data/interview.js`.

Use it for human review of Interview Mode answers. Edit this Markdown file freely during review, then copy approved improvements back into `src/data/interview.js` and rerun tests.

Total questions: 101

## pdf-behavioural-intro

- **Category:** Behavioural questions
- **Difficulty:** Junior DevOps
- **Question:** Brief yourself: your background, project, and responsibilities.
- **Current short answer:** Give a concise two-minute summary covering your current role, years of experience, core tools, current project, daily responsibilities, and one measurable achievement.
- **Current detailed answer:** Give a concise two-minute summary covering your current role, years of experience, core tools, current project, daily responsibilities, and one measurable achievement.
- **Example:** For example: mention managing CI/CD pipelines, Terraform infrastructure, Kubernetes workloads, incidents handled, and a quantified improvement such as reducing build time.
- **Common mistake:** Answering only with a definition and not mentioning role, tools, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** role, tools, impact
- **Related module:** DevOps fundamentals

## pdf-aws-lb-unavailable

- **Category:** Troubleshooting
- **Difficulty:** Mid-level DevOps
- **Question:** An EC2 application behind a load balancer is suddenly unavailable. How do you troubleshoot?
- **Current short answer:** Debug layer by layer: load balancer target health, health check path, app process, security groups, recent logs, CPU, memory, disk, and subnet routing.
- **Current detailed answer:** Debug layer by layer: load balancer target health, health check path, app process, security groups, recent logs, CPU, memory, disk, and subnet routing.
- **Example:** Check unhealthy targets, verify /health returns 200, run systemctl status, inspect journal logs, and confirm the instance security group allows traffic from the load balancer.
- **Common mistake:** Answering only with a definition and not mentioning target health, security group, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** target health, security group, logs
- **Related module:** Troubleshooting

## pdf-aws-cost-spike

- **Category:** Troubleshooting
- **Difficulty:** Mid-level DevOps
- **Question:** AWS billing increased suddenly. How do you identify the cost spike?
- **Current short answer:** Start in Cost Explorer grouped by service and region, then inspect untagged resources, instance sizes, NAT gateway data transfer, and recent activity logs.
- **Current detailed answer:** Start in Cost Explorer grouped by service and region, then inspect untagged resources, instance sizes, NAT gateway data transfer, and recent activity logs.
- **Example:** A common case is a large instance, NAT gateway transfer, or untagged test resource left running; add budgets and anomaly alerts afterward.
- **Common mistake:** Answering only with a definition and not mentioning cost explorer, region, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** cost explorer, region, tags
- **Related module:** DevOps fundamentals

## pdf-dev-ec2

- **Category:** Scenario-based questions
- **Difficulty:** Junior DevOps
- **Question:** A developer needs an EC2 instance for local deployment. What instance type and controls would you choose?
- **Current short answer:** Use a small burstable instance such as t3.
- **Current detailed answer:** Use a small burstable instance such as t3.medium in a dev VPC, attach a least-privilege IAM role, restrict access, tag ownership, and prefer SSM Session Manager over open SSH.
- **Example:** Add auto-stop scheduling and owner/env tags so temporary dev instances do not become unmanaged cost or security risk.
- **Common mistake:** Answering only with a definition and not mentioning t3.medium, least privilege, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** t3.medium, least privilege, ssm
- **Related module:** DevOps fundamentals

## pdf-k8s-external-access

- **Category:** Troubleshooting
- **Difficulty:** Junior DevOps
- **Question:** A Kubernetes deployment succeeded but the app is not accessible externally. How do you troubleshoot?
- **Current short answer:** Check pod readiness, Service type, selector labels, endpoints, Ingress controller, security groups, and DNS records.
- **Current detailed answer:** Check pod readiness, Service type, selector labels, endpoints, Ingress controller, security groups, and DNS records.
- **Example:** If endpoints are empty, the Service selector does not match pod labels; test with kubectl get endpoints and curl from inside the cluster.
- **Common mistake:** Answering only with a definition and not mentioning service, selector, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** service, selector, ingress
- **Related module:** Kubernetes

## pdf-k8s-node-fails

- **Category:** Kubernetes
- **Difficulty:** Mid-level DevOps
- **Question:** When a Kubernetes node fails, what happens to the pods?
- **Current short answer:** The node becomes NotReady, pods on it are eventually evicted, and controller-managed pods are recreated on healthy nodes; standalone pods are not automatically replaced.
- **Current detailed answer:** The node becomes NotReady, pods on it are eventually evicted, and controller-managed pods are recreated on healthy nodes; standalone pods are not automatically replaced.
- **Example:** Explain the difference between Deployments and standalone pods, and mention PodDisruptionBudgets for availability.
- **Common mistake:** Answering only with a definition and not mentioning notready, rescheduled, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** notready, rescheduled, deployment
- **Related module:** Kubernetes

## pdf-k8s-prod-podspec

- **Category:** Kubernetes
- **Difficulty:** Mid-level DevOps
- **Question:** What should you configure in a pod spec for production readiness?
- **Current short answer:** Production pods should define resource requests and limits, liveness/readiness probes, pinned image tags, security context, graceful shutdown, ConfigMaps/Secrets, and spreading rules.
- **Current detailed answer:** Production pods should define resource requests and limits, liveness/readiness probes, pinned image tags, security context, graceful shutdown, ConfigMaps/Secrets, and spreading rules.
- **Example:** A good answer includes readiness probes for traffic safety and runAsNonRoot/readOnlyRootFilesystem for security.
- **Common mistake:** Answering only with a definition and not mentioning requests, probes, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** requests, probes, securityContext
- **Related module:** Kubernetes

## pdf-git-mirror

- **Category:** CI/CD
- **Difficulty:** Junior DevOps
- **Question:** How do you migrate a Git repository with full commit history?
- **Current short answer:** Use a bare clone and mirror push so all commits, branches, tags, and refs are preserved.
- **Current detailed answer:** Use a bare clone and mirror push so all commits, branches, tags, and refs are preserved.
- **Example:** Run git clone --bare from the source, then git push --mirror to the destination remote.
- **Common mistake:** Answering only with a definition and not mentioning bare clone, mirror, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** bare clone, mirror, tags
- **Related module:** CI/CD

## pdf-git-branching

- **Category:** CI/CD
- **Difficulty:** Beginner
- **Question:** What is Git, why do we use it, and what is a branching strategy?
- **Current short answer:** Git is distributed version control used for collaboration, history, rollback, and parallel work.
- **Current detailed answer:** Git is distributed version control used for collaboration, history, rollback, and parallel work. Branching strategies define how teams isolate, review, and release changes.
- **Example:** Compare Git Flow, GitHub Flow, and trunk-based development, then name the one you used.
- **Common mistake:** Answering only with a definition and not mentioning distributed, history, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** distributed, history, branching
- **Related module:** CI/CD

## pdf-pipeline-dev-uat

- **Category:** CI/CD
- **Difficulty:** Junior DevOps
- **Question:** Write or describe a CI/CD pipeline to test and deploy from Dev to UAT.
- **Current short answer:** A solid pipeline runs tests, builds and pushes an artifact or image, deploys to Dev automatically, then gates UAT with manual approval.
- **Current detailed answer:** A solid pipeline runs tests, builds and pushes an artifact or image, deploys to Dev automatically, then gates UAT with manual approval.
- **Example:** For a container app: npm test, docker build/push, kubectl set image for dev, and manual promotion to UAT.
- **Common mistake:** Answering only with a definition and not mentioning test, build, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** test, build, manual approval
- **Related module:** CI/CD

## pdf-maven-repositories

- **Category:** CI/CD
- **Difficulty:** Beginner
- **Question:** What is Maven and what are Maven repositories?
- **Current short answer:** Maven is a Java build and dependency tool using pom.
- **Current detailed answer:** Maven is a Java build and dependency tool using pom.xml. It resolves dependencies from local, private/remote, and central repositories.
- **Example:** Mention Nexus or Artifactory for controlled internal artifact storage.
- **Common mistake:** Answering only with a definition and not mentioning pom.xml, local, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** pom.xml, local, remote
- **Related module:** CI/CD

## pdf-jenkins-prod-fail

- **Category:** Troubleshooting
- **Difficulty:** Mid-level DevOps
- **Question:** A Jenkins pipeline works in Dev but fails in Production. How do you fix it?
- **Current short answer:** Compare environment versions, configuration, credentials, network access, failing stage, IAM permissions, and add verbose logs to isolate the difference.
- **Current detailed answer:** Compare environment versions, configuration, credentials, network access, failing stage, IAM permissions, and add verbose logs to isolate the difference.
- **Example:** Common real causes include expired prod credentials, missing cross-account permissions, or firewall restrictions.
- **Common mistake:** Answering only with a definition and not mentioning environment parity, credentials, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** environment parity, credentials, permissions
- **Related module:** CI/CD

## pdf-argocd

- **Category:** CI/CD
- **Difficulty:** Junior DevOps
- **Question:** What is ArgoCD and why do teams use it?
- **Current short answer:** ArgoCD is a pull-based GitOps CD tool for Kubernetes that syncs cluster state to manifests stored in Git and detects drift.
- **Current detailed answer:** ArgoCD is a pull-based GitOps CD tool for Kubernetes that syncs cluster state to manifests stored in Git and detects drift.
- **Example:** Explain that rollback can be done by reverting Git and letting ArgoCD reconcile.
- **Common mistake:** Answering only with a definition and not mentioning gitops, sync, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** gitops, sync, drift
- **Related module:** CI/CD

## pdf-gitops

- **Category:** CI/CD
- **Difficulty:** Junior DevOps
- **Question:** What is GitOps?
- **Current short answer:** GitOps uses Git as the source of truth for infrastructure and app deployment, with agents continuously reconciling live state to declared state.
- **Current detailed answer:** GitOps uses Git as the source of truth for infrastructure and app deployment, with agents continuously reconciling live state to declared state.
- **Example:** A Helm values change merged to main can trigger ArgoCD or Flux to deploy without manual kubectl commands.
- **Common mistake:** Answering only with a definition and not mentioning declarative, git, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** declarative, git, reconciliation
- **Related module:** CI/CD

## pdf-ansible-100-servers

- **Category:** Ansible
- **Difficulty:** Mid-level DevOps
- **Question:** How would you deploy an application to 100 servers using Ansible?
- **Current short answer:** Define inventory, write an idempotent playbook, deploy in rolling batches with serial, and stop on failed health checks.
- **Current detailed answer:** Define inventory, write an idempotent playbook, deploy in rolling batches with serial, and stop on failed health checks.
- **Example:** Use serial: 10 to update ten servers at a time instead of all at once.
- **Common mistake:** Answering only with a definition and not mentioning inventory, serial, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** inventory, serial, health check
- **Related module:** Ansible

## pdf-docker-exits

- **Category:** Docker
- **Difficulty:** Junior DevOps
- **Question:** A Docker container stops immediately after starting. How do you troubleshoot?
- **Current short answer:** Check docker ps -a, container logs, exit code, CMD/ENTRYPOINT, required environment variables, permissions, and whether the app stays in the foreground.
- **Current detailed answer:** Check docker ps -a, container logs, exit code, CMD/ENTRYPOINT, required environment variables, permissions, and whether the app stays in the foreground.
- **Example:** Override the entrypoint with /bin/sh to inspect the image interactively.
- **Common mistake:** Answering only with a definition and not mentioning logs, entrypoint, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** logs, entrypoint, exit code
- **Related module:** Docker

## pdf-oomkilled-sequence

- **Category:** Kubernetes
- **Difficulty:** Advanced
- **Question:** Explain the sequence of events when a pod gets OOMKilled in Kubernetes.
- **Current short answer:** When a container exceeds its memory limit, the kernel OOM killer terminates the process, kubelet records exit code 137/OOMKilled, and restartPolicy controls whether the container restarts with backoff.
- **Current detailed answer:** When a container exceeds its memory limit, the kernel OOM killer terminates the process, kubelet records exit code 137/OOMKilled, and restartPolicy controls whether the container restarts with backoff.
- **Example:** Stress that the container restarts on the same pod/node; node memory pressure eviction is a different path.
- **Common mistake:** Answering only with a definition and not mentioning oomkiller, exit 137, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** oomkiller, exit 137, restartPolicy
- **Related module:** Kubernetes

## pdf-prod-permission-denied

- **Category:** Troubleshooting
- **Difficulty:** Advanced
- **Question:** The same Docker image works in staging but fails in production with permission denied. How do you debug it?
- **Current short answer:** Verify identical image digest, compare runtime user, mounted volumes, Kubernetes securityContext, read-only filesystem settings, environment paths, and production admission policies.
- **Current detailed answer:** Verify identical image digest, compare runtime user, mounted volumes, Kubernetes securityContext, read-only filesystem settings, environment paths, and production admission policies.
- **Example:** Most staging-vs-prod permission bugs come from security context or policy differences, not the image.
- **Common mistake:** Answering only with a definition and not mentioning securityContext, uid, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** securityContext, uid, permissions
- **Related module:** Docker

## pdf-k8s-dns-cross-ns

- **Category:** Kubernetes
- **Difficulty:** Advanced
- **Question:** How does Kubernetes DNS resolution work across namespaces, and what failure modes matter?
- **Current short answer:** Pods use CoreDNS and search domains.
- **Current detailed answer:** Pods use CoreDNS and search domains. Cross-namespace calls should use service.namespace.svc.cluster.local; failures include CoreDNS outage, UDP/53 NetworkPolicy blocks, ndots behavior, and empty endpoints.
- **Example:** Debug with nslookup from the pod and kubectl get endpoints in the target namespace.
- **Common mistake:** Answering only with a definition and not mentioning coredns, fqdn, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** coredns, fqdn, networkpolicy
- **Related module:** Kubernetes

## pdf-terraform-lock

- **Category:** Terraform
- **Difficulty:** Advanced
- **Question:** A terraform apply has a state lock that never releases. How do you safely recover?
- **Current short answer:** Confirm no apply is still running, back up the state, inspect the lock, use terraform force-unlock with the lock ID, then run terraform plan before any further apply.
- **Current detailed answer:** Confirm no apply is still running, back up the state, inspect the lock, use terraform force-unlock with the lock ID, then run terraform plan before any further apply.
- **Example:** Never manually delete a DynamoDB lock item without understanding the active operation.
- **Common mistake:** Answering only with a definition and not mentioning force-unlock, backup, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** force-unlock, backup, plan
- **Related module:** Terraform

## pdf-observability-stack

- **Category:** Troubleshooting
- **Difficulty:** Advanced
- **Question:** Differentiate metrics, logs, and traces, then design an observability stack for high traffic microservices.
- **Current short answer:** Metrics are numeric time series for dashboards and alerts, logs are event records for context, and traces show request flow across services.
- **Current detailed answer:** Metrics are numeric time series for dashboards and alerts, logs are event records for context, and traces show request flow across services. Use Prometheus/Grafana, Loki or ELK, OpenTelemetry, and trace sampling.
- **Example:** At high request volume, sample traces and alert on SLO burn rates instead of storing everything.
- **Common mistake:** Answering only with a definition and not mentioning metrics, logs, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** metrics, logs, traces
- **Related module:** Troubleshooting

## pdf-secret-committed

- **Category:** Troubleshooting
- **Difficulty:** Advanced
- **Question:** A secret was committed to a public GitHub repository. What is your incident response?
- **Current short answer:** Assume compromise, rotate/revoke the secret first, review audit logs, remove it from history, notify security, enable scanning, and move secrets to a proper manager.
- **Current detailed answer:** Assume compromise, rotate/revoke the secret first, review audit logs, remove it from history, notify security, enable scanning, and move secrets to a proper manager.
- **Example:** History rewriting does not protect an already-exposed secret; rotation is the priority.
- **Common mistake:** Answering only with a definition and not mentioning rotate, audit logs, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** rotate, audit logs, secret scanning
- **Related module:** DevOps fundamentals

## pdf-hpa-internals

- **Category:** Kubernetes
- **Difficulty:** Advanced
- **Question:** How does Horizontal Pod Autoscaler work internally?
- **Current short answer:** HPA periodically reads metrics, calculates desired replicas from current versus target metric values, applies stabilization rules, patches the workload replica count, and lets controllers/scheduler create pods.
- **Current detailed answer:** HPA periodically reads metrics, calculates desired replicas from current versus target metric values, applies stabilization rules, patches the workload replica count, and lets controllers/scheduler create pods.
- **Example:** Mention Cluster Autoscaler separately: HPA scales pods, Cluster Autoscaler scales nodes.
- **Common mistake:** Answering only with a definition and not mentioning metrics api, replicas, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** metrics api, replicas, stabilization
- **Related module:** Kubernetes

## pdf-error-budget

- **Category:** DevOps fundamentals
- **Difficulty:** Advanced
- **Question:** Define error budget, burn rate, and multi-window alerting for a 99.9% SLO.
- **Current short answer:** Error budget is the allowed unreliability.
- **Current detailed answer:** Error budget is the allowed unreliability. Burn rate is how quickly it is consumed. Multi-window alerts combine short and long windows to reduce false positives while catching fast incidents.
- **Example:** A strong answer mentions page-now and ticket-level alerts using different burn-rate windows.
- **Common mistake:** Answering only with a definition and not mentioning slo, burn rate, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** slo, burn rate, alert
- **Related module:** DevOps fundamentals

## pdf-periodic-latency

- **Category:** Troubleshooting
- **Difficulty:** Advanced
- **Question:** A microservice has 500ms latency spikes every 60 seconds. How do you diagnose it?
- **Current short answer:** The fixed period suggests a timer.
- **Current detailed answer:** The fixed period suggests a timer. Correlate metrics, probes, cron jobs, GC, connection pool reaping, DNS TTL, leader election, and traces around spike windows.
- **Example:** Start by matching the 60-second pattern to scheduled behavior before changing code.
- **Common mistake:** Answering only with a definition and not mentioning periodicity, tracing, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** periodicity, tracing, connection pool
- **Related module:** Troubleshooting

## pdf-push-pull-cd

- **Category:** CI/CD
- **Difficulty:** Advanced
- **Question:** What is the difference between push-based and pull-based CD?
- **Current short answer:** Push CD lets CI write to the cluster, while pull CD uses an in-cluster agent such as ArgoCD or Flux to reconcile from Git.
- **Current detailed answer:** Push CD lets CI write to the cluster, while pull CD uses an in-cluster agent such as ArgoCD or Flux to reconcile from Git. Pull-based delivery improves credential safety and drift detection.
- **Example:** Explain sync waves, windows, and hooks as ways to prevent deployment storms.
- **Common mistake:** Answering only with a definition and not mentioning push, pull, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** push, pull, gitops
- **Related module:** CI/CD

## pdf-dockerfile-security-size

- **Category:** Docker
- **Difficulty:** Advanced
- **Question:** Describe Dockerfile practices that improve security and image size.
- **Current short answer:** Use multi-stage builds, non-root users, pinned base image digests, no secrets in ARG/ENV, .
- **Current detailed answer:** Use multi-stage builds, non-root users, pinned base image digests, no secrets in ARG/ENV, .dockerignore, minimal layers, and image scanning in CI.
- **Example:** The final image should contain runtime artifacts, not compilers, package caches, .git, or secrets.
- **Common mistake:** Answering only with a definition and not mentioning multi-stage, non-root, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** multi-stage, non-root, dockerignore
- **Related module:** Docker

## pdf-platform-engineering

- **Category:** DevOps fundamentals
- **Difficulty:** Advanced
- **Question:** What is Platform Engineering and how does it differ from traditional DevOps?
- **Current short answer:** Platform Engineering treats internal infrastructure as a product: an Internal Developer Platform provides self-service golden paths, templates, observability, and paved workflows for engineers.
- **Current detailed answer:** Platform Engineering treats internal infrastructure as a product: an Internal Developer Platform provides self-service golden paths, templates, observability, and paved workflows for engineers.
- **Example:** A good platform reduces tickets by making the safe path the easiest path.
- **Common mistake:** Answering only with a definition and not mentioning idp, self-service, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** idp, self-service, golden path
- **Related module:** DevOps fundamentals

## pdf-terraform-large-scale

- **Category:** Terraform
- **Difficulty:** Mid-level DevOps
- **Question:** How do you structure Terraform code for large-scale cloud infrastructure?
- **Current short answer:** Use reusable modules, environment separation, remote state with locking, tfvars per environment, CI checks, consistent tagging, and no hardcoded secrets.
- **Current detailed answer:** Use reusable modules, environment separation, remote state with locking, tfvars per environment, CI checks, consistent tagging, and no hardcoded secrets.
- **Example:** A practical structure separates live environments from shared modules and runs fmt, validate, and scanning in pull requests.
- **Common mistake:** Answering only with a definition and not mentioning modules, remote state, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** modules, remote state, tfvars
- **Related module:** Terraform

## pdf-github-actions-e2e

- **Category:** CI/CD
- **Difficulty:** Mid-level DevOps
- **Question:** Walk through a GitHub Actions CI/CD pipeline you built end to end.
- **Current short answer:** Describe triggers, checkout, tests, image build, security scan, registry push, environment approvals, and deployment with Helm or kubectl.
- **Current detailed answer:** Describe triggers, checkout, tests, image build, security scan, registry push, environment approvals, and deployment with Helm or kubectl.
- **Example:** A strong answer includes protected environments and measurable deployment improvement.
- **Common mistake:** Answering only with a definition and not mentioning build, scan, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** build, scan, deploy
- **Related module:** CI/CD

## pdf-pipeline-secrets

- **Category:** DevOps fundamentals
- **Difficulty:** Mid-level DevOps
- **Question:** How do you manage secrets and credentials in a cloud DevOps pipeline?
- **Current short answer:** Avoid static credentials.
- **Current detailed answer:** Avoid static credentials. Use OIDC federation, cloud secrets managers, managed identities, encrypted CI secrets, and least-privilege roles.
- **Example:** Mention replacing long-lived access keys with GitHub Actions OIDC role assumption.
- **Common mistake:** Answering only with a definition and not mentioning oidc, secrets manager, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** oidc, secrets manager, least privilege
- **Related module:** DevOps fundamentals

## pdf-python-automation

- **Category:** DevOps fundamentals
- **Difficulty:** Junior DevOps
- **Question:** How do you write Python scripts for DevOps automation?
- **Current short answer:** Use Python with cloud SDKs for repeatable operational tasks such as finding idle resources, reporting drift, or running scheduled cleanup jobs.
- **Current detailed answer:** Use Python with cloud SDKs for repeatable operational tasks such as finding idle resources, reporting drift, or running scheduled cleanup jobs.
- **Example:** A good example is a scheduled Lambda or cron job that identifies idle EC2 instances from CloudWatch metrics.
- **Common mistake:** Answering only with a definition and not mentioning sdk, automation, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** sdk, automation, schedule
- **Related module:** DevOps fundamentals

## pdf-terraform-state-drift

- **Category:** Terraform
- **Difficulty:** Mid-level DevOps
- **Question:** How do you handle Terraform state management and drift in production?
- **Current short answer:** Use remote state with locking and versioning, run plan in CI, detect drift regularly, import or codify manual changes, and avoid direct console edits.
- **Current detailed answer:** Use remote state with locking and versioning, run plan in CI, detect drift regularly, import or codify manual changes, and avoid direct console edits.
- **Example:** If a security group rule was added manually, import or encode it in Terraform instead of ignoring drift.
- **Common mistake:** Answering only with a definition and not mentioning remote state, locking, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** remote state, locking, plan
- **Related module:** Terraform

## pdf-zero-downtime

- **Category:** Kubernetes
- **Difficulty:** Mid-level DevOps
- **Question:** How do you design a Kubernetes deployment strategy for zero-downtime releases?
- **Current short answer:** Use rolling updates with maxUnavailable 0 and readiness probes for normal changes; use blue-green or canary with Argo Rollouts/Istio for riskier releases.
- **Current detailed answer:** Use rolling updates with maxUnavailable 0 and readiness probes for normal changes; use blue-green or canary with Argo Rollouts/Istio for riskier releases.
- **Example:** Monitor error rate during canary and auto-promote only if SLOs stay healthy.
- **Common mistake:** Answering only with a definition and not mentioning rolling update, readiness, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** rolling update, readiness, canary
- **Related module:** Kubernetes

## pdf-monitoring-k8s

- **Category:** Troubleshooting
- **Difficulty:** Mid-level DevOps
- **Question:** How do you set up monitoring and alerting for a production Kubernetes cluster?
- **Current short answer:** Deploy kube-prometheus-stack, scrape app metrics with ServiceMonitors, route alerts through Alertmanager, and ship logs with Fluent Bit to ELK or Loki.
- **Current detailed answer:** Deploy kube-prometheus-stack, scrape app metrics with ServiceMonitors, route alerts through Alertmanager, and ship logs with Fluent Bit to ELK or Loki.
- **Example:** Tie alerts to severity: P1 to PagerDuty, lower-priority alerts to Slack.
- **Common mistake:** Answering only with a definition and not mentioning prometheus, grafana, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** prometheus, grafana, alertmanager
- **Related module:** Troubleshooting

## pdf-ansible-experience

- **Category:** Ansible
- **Difficulty:** Junior DevOps
- **Question:** Describe your experience with Ansible for configuration management.
- **Current short answer:** Discuss idempotent playbooks, role structure, templates, handlers, patching, and using inventory to manage many hosts consistently.
- **Current detailed answer:** Discuss idempotent playbooks, role structure, templates, handlers, patching, and using inventory to manage many hosts consistently.
- **Example:** Use an nginx role example with apt, template, notify, and service tasks.
- **Common mistake:** Answering only with a definition and not mentioning idempotent, roles, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** idempotent, roles, handlers
- **Related module:** Ansible

## pdf-iam-security

- **Category:** DevOps fundamentals
- **Difficulty:** Mid-level DevOps
- **Question:** How do you design IAM and cloud security best practices?
- **Current short answer:** Apply least privilege, use service roles or managed identities, enable audit logging, restrict networks, store secrets centrally, and scan IaC in CI.
- **Current detailed answer:** Apply least privilege, use service roles or managed identities, enable audit logging, restrict networks, store secrets centrally, and scan IaC in CI.
- **Example:** A strong answer names guardrails such as CloudTrail, GuardDuty, Azure Policy, tfsec, or checkov.
- **Common mistake:** Answering only with a definition and not mentioning least privilege, audit, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** least privilege, audit, scanning
- **Related module:** DevOps fundamentals

## pdf-prod-rollout-fail

- **Category:** Scenario-based questions
- **Difficulty:** Mid-level DevOps
- **Question:** Production deployment fails mid-rollout. What do you do?
- **Current short answer:** Assess blast radius, roll back first, communicate in the incident channel, monitor recovery, then do root cause analysis and a blameless postmortem.
- **Current detailed answer:** Assess blast radius, roll back first, communicate in the incident channel, monitor recovery, then do root cause analysis and a blameless postmortem.
- **Example:** For Kubernetes, use rollout history, rollout undo, and rollout status.
- **Common mistake:** Answering only with a definition and not mentioning rollback, communicate, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** rollback, communicate, postmortem
- **Related module:** Troubleshooting

## pdf-terraform-destroy-prod

- **Category:** Scenario-based questions
- **Difficulty:** Mid-level DevOps
- **Question:** Terraform plan shows resources will be destroyed in production. How do you handle it?
- **Current short answer:** Stop before applying, understand whether the destroy is expected, use state mv/import for renames, protect critical resources with lifecycle rules, and require manual approval.
- **Current detailed answer:** Stop before applying, understand whether the destroy is expected, use state mv/import for renames, protect critical resources with lifecycle rules, and require manual approval.
- **Example:** A pipeline should flag destructive plans and block automatic apply.
- **Common mistake:** Answering only with a definition and not mentioning destroy, prevent_destroy, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** destroy, prevent_destroy, approval
- **Related module:** Terraform

## pdf-k8s-cloud-autoscaling

- **Category:** Kubernetes
- **Difficulty:** Mid-level DevOps
- **Question:** How do you implement autoscaling in Kubernetes and cloud environments?
- **Current short answer:** Use HPA for pod replicas, VPA for requests, KEDA for event-driven workloads, and Cluster Autoscaler or cloud autoscaling groups for node capacity.
- **Current detailed answer:** Use HPA for pod replicas, VPA for requests, KEDA for event-driven workloads, and Cluster Autoscaler or cloud autoscaling groups for node capacity.
- **Example:** Queue depth or Kafka lag is a better scaling signal than CPU for many async workers.
- **Common mistake:** Answering only with a definition and not mentioning hpa, keda, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** hpa, keda, cluster autoscaler
- **Related module:** Kubernetes

## pdf-terraform-multi-env

- **Category:** Terraform
- **Difficulty:** Mid-level DevOps
- **Question:** How do you manage dev, staging, and prod infrastructure in Terraform?
- **Current short answer:** Use directory-based separation or workspaces depending on complexity, keep shared modules reusable, and drive environment differences through tfvars and backend state.
- **Current detailed answer:** Use directory-based separation or workspaces depending on complexity, keep shared modules reusable, and drive environment differences through tfvars and backend state.
- **Example:** Production can enforce stricter networking and HA settings while reusing the same module interface.
- **Common mistake:** Answering only with a definition and not mentioning workspaces, directories, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** workspaces, directories, tfvars
- **Related module:** Terraform

## pdf-ha-dr

- **Category:** DevOps fundamentals
- **Difficulty:** Advanced
- **Question:** How do you ensure high availability and disaster recovery in cloud infrastructure?
- **Current short answer:** Design across availability zones, use managed database failover, replicate critical data, define RPO/RTO, and test failover with game days.
- **Current detailed answer:** Design across availability zones, use managed database failover, replicate critical data, define RPO/RTO, and test failover with game days.
- **Example:** Mention Route53 or load balancer failover plus tested runbooks.
- **Common mistake:** Answering only with a definition and not mentioning multi-az, rpo, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** multi-az, rpo, rto
- **Related module:** DevOps fundamentals

## pdf-behavioural-migration

- **Category:** Behavioural questions
- **Difficulty:** Mid-level DevOps
- **Question:** Tell me about a time you led a critical infrastructure migration.
- **Current short answer:** Use STAR: explain the migration driver, your ownership, discovery and runbook approach, risk mitigation, execution, and measurable outcome.
- **Current detailed answer:** Use STAR: explain the migration driver, your ownership, discovery and runbook approach, risk mitigation, execution, and measurable outcome.
- **Example:** Quantify business impact such as avoided renewal cost, faster provisioning, or reduced compute spend.
- **Common mistake:** Answering only with a definition and not mentioning situation, action, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** situation, action, result
- **Related module:** DevOps fundamentals

## pdf-behavioural-incident

- **Category:** Behavioural questions
- **Difficulty:** Mid-level DevOps
- **Question:** Tell me about a time you resolved a major production incident.
- **Current short answer:** Use STAR: describe the user impact, immediate diagnosis, rollback or mitigation, stakeholder updates, and follow-up prevention work.
- **Current detailed answer:** Use STAR: describe the user impact, immediate diagnosis, rollback or mitigation, stakeholder updates, and follow-up prevention work.
- **Example:** A mature answer includes both restoration speed and postmortem improvements.
- **Common mistake:** Answering only with a definition and not mentioning impact, rollback, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** impact, rollback, lesson
- **Related module:** Troubleshooting

## pdf-behavioural-disagreement

- **Category:** Behavioural questions
- **Difficulty:** Junior DevOps
- **Question:** How do you handle disagreements with developers about infrastructure decisions?
- **Current short answer:** Listen first, clarify requirements, explain security/cost/reliability tradeoffs with evidence, document options, and escalate with context only when needed.
- **Current detailed answer:** Listen first, clarify requirements, explain security/cost/reliability tradeoffs with evidence, document options, and escalate with context only when needed.
- **Example:** Offer a compromise that meets delivery goals without ignoring operational risk.
- **Common mistake:** Answering only with a definition and not mentioning listen, tradeoffs, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** listen, tradeoffs, data
- **Related module:** DevOps fundamentals

## pdf-stay-current

- **Category:** Behavioural questions
- **Difficulty:** Beginner
- **Question:** How do you stay current with DevOps tools and cloud trends?
- **Current short answer:** Follow release notes and newsletters, practice in a lab repo, earn targeted certifications, join community channels, and share learnings with the team.
- **Current detailed answer:** Follow release notes and newsletters, practice in a lab repo, earn targeted certifications, join community channels, and share learnings with the team.
- **Example:** Give one recent tool you tested and how it helped a real workflow.
- **Common mistake:** Answering only with a definition and not mentioning documentation, practice, and a real operational example.
- **Interview tip:** Use a structured answer: state the concept, walk through your troubleshooting or delivery steps, then finish with the practical lesson.
- **Required keywords:** documentation, practice, community
- **Related module:** DevOps fundamentals

## interview-linux-1

- **Category:** Linux
- **Difficulty:** Beginner
- **Question:** Explain Linux file permissions.
- **Current short answer:** A strong answer should mention read, write, execute.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how read, write, execute affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use read as the starting point, verify write, and confirm execute before moving on.
- **Common mistake:** Giving a memorized definition without explaining read in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** read, write, execute
- **Related module:** Linux

## interview-linux-2

- **Category:** Linux
- **Difficulty:** Junior DevOps
- **Question:** How do you troubleshoot high CPU on a Linux server?
- **Current short answer:** A strong answer should mention top, process, logs.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how top, process, logs affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use top as the starting point, verify process, and confirm logs before moving on.
- **Common mistake:** Giving a memorized definition without explaining top in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** top, process, logs
- **Related module:** Linux

## interview-linux-3

- **Category:** Linux
- **Difficulty:** Mid-level DevOps
- **Question:** What does a pipe do in Linux?
- **Current short answer:** A strong answer should mention stdout, stdin, command.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how stdout, stdin, command affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use stdout as the starting point, verify stdin, and confirm command before moving on.
- **Common mistake:** Giving a memorized definition without explaining stdout in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** stdout, stdin, command
- **Related module:** Linux

## interview-linux-4

- **Category:** Linux
- **Difficulty:** Advanced
- **Question:** How do you inspect service logs?
- **Current short answer:** A strong answer should mention journalctl, service, logs.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how journalctl, service, logs affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use journalctl as the starting point, verify service, and confirm logs before moving on.
- **Common mistake:** Giving a memorized definition without explaining journalctl in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** journalctl, service, logs
- **Related module:** Linux

## interview-linux-5

- **Category:** Linux
- **Difficulty:** Beginner
- **Question:** How do you check disk usage?
- **Current short answer:** A strong answer should mention df, du, filesystem.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how df, du, filesystem affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use df as the starting point, verify du, and confirm filesystem before moving on.
- **Common mistake:** Giving a memorized definition without explaining df in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** df, du, filesystem
- **Related module:** Linux

## interview-docker-1

- **Category:** Docker
- **Difficulty:** Beginner
- **Question:** What is the difference between an image and a container?
- **Current short answer:** A strong answer should mention image, container, runtime.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how image, container, runtime affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use image as the starting point, verify container, and confirm runtime before moving on.
- **Common mistake:** Giving a memorized definition without explaining image in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** image, container, runtime
- **Related module:** Docker

## interview-docker-2

- **Category:** Docker
- **Difficulty:** Junior DevOps
- **Question:** How does Docker port mapping work?
- **Current short answer:** A strong answer should mention host, container, port.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how host, container, port affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use host as the starting point, verify container, and confirm port before moving on.
- **Common mistake:** Giving a memorized definition without explaining host in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** host, container, port
- **Related module:** Docker

## interview-docker-3

- **Category:** Docker
- **Difficulty:** Mid-level DevOps
- **Question:** Why use a .dockerignore file?
- **Current short answer:** A strong answer should mention build context, ignore, image.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how build context, ignore, image affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use build context as the starting point, verify ignore, and confirm image before moving on.
- **Common mistake:** Giving a memorized definition without explaining build context in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** build context, ignore, image
- **Related module:** Docker

## interview-docker-4

- **Category:** Docker
- **Difficulty:** Advanced
- **Question:** What is a multi-stage build?
- **Current short answer:** A strong answer should mention stage, smaller, artifact.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how stage, smaller, artifact affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use stage as the starting point, verify smaller, and confirm artifact before moving on.
- **Common mistake:** Giving a memorized definition without explaining stage in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** stage, smaller, artifact
- **Related module:** Docker

## interview-docker-5

- **Category:** Docker
- **Difficulty:** Beginner
- **Question:** How would you debug a failing container?
- **Current short answer:** A strong answer should mention logs, exec, inspect.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how logs, exec, inspect affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use logs as the starting point, verify exec, and confirm inspect before moving on.
- **Common mistake:** Giving a memorized definition without explaining logs in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** logs, exec, inspect
- **Related module:** Docker

## interview-kubernetes-1

- **Category:** Kubernetes
- **Difficulty:** Beginner
- **Question:** What is a Pod?
- **Current short answer:** A strong answer should mention pod, container, smallest.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how pod, container, smallest affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use pod as the starting point, verify container, and confirm smallest before moving on.
- **Common mistake:** Giving a memorized definition without explaining pod in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** pod, container, smallest
- **Related module:** Kubernetes

## interview-kubernetes-2

- **Category:** Kubernetes
- **Difficulty:** Junior DevOps
- **Question:** What problem does a Deployment solve?
- **Current short answer:** A strong answer should mention replicas, rollout, desired state.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how replicas, rollout, desired state affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use replicas as the starting point, verify rollout, and confirm desired state before moving on.
- **Common mistake:** Giving a memorized definition without explaining replicas in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** replicas, rollout, desired state
- **Related module:** Kubernetes

## interview-kubernetes-3

- **Category:** Kubernetes
- **Difficulty:** Mid-level DevOps
- **Question:** How do Services route traffic?
- **Current short answer:** A strong answer should mention selector, pods, port.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how selector, pods, port affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use selector as the starting point, verify pods, and confirm port before moving on.
- **Common mistake:** Giving a memorized definition without explaining selector in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** selector, pods, port
- **Related module:** Kubernetes

## interview-kubernetes-4

- **Category:** Kubernetes
- **Difficulty:** Advanced
- **Question:** What is the role of ConfigMaps and Secrets?
- **Current short answer:** A strong answer should mention configuration, secret, environment.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how configuration, secret, environment affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use configuration as the starting point, verify secret, and confirm environment before moving on.
- **Common mistake:** Giving a memorized definition without explaining configuration in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** configuration, secret, environment
- **Related module:** Kubernetes

## interview-kubernetes-5

- **Category:** Kubernetes
- **Difficulty:** Beginner
- **Question:** How do you troubleshoot a CrashLoopBackOff?
- **Current short answer:** A strong answer should mention logs, describe, events.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how logs, describe, events affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use logs as the starting point, verify describe, and confirm events before moving on.
- **Common mistake:** Giving a memorized definition without explaining logs in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** logs, describe, events
- **Related module:** Kubernetes

## interview-helm-1

- **Category:** Helm
- **Difficulty:** Beginner
- **Question:** What is a Helm chart?
- **Current short answer:** A strong answer should mention chart, templates, values.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how chart, templates, values affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Helm workflow, use chart as the starting point, verify templates, and confirm values before moving on.
- **Common mistake:** Giving a memorized definition without explaining chart in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** chart, templates, values
- **Related module:** Helm

## interview-helm-2

- **Category:** Helm
- **Difficulty:** Junior DevOps
- **Question:** What is a Helm release?
- **Current short answer:** A strong answer should mention release, install, revision.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how release, install, revision affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Helm workflow, use release as the starting point, verify install, and confirm revision before moving on.
- **Common mistake:** Giving a memorized definition without explaining release in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** release, install, revision
- **Related module:** Helm

## interview-helm-3

- **Category:** Helm
- **Difficulty:** Mid-level DevOps
- **Question:** How do values.yaml files work?
- **Current short answer:** A strong answer should mention values, override, template.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how values, override, template affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Helm workflow, use values as the starting point, verify override, and confirm template before moving on.
- **Common mistake:** Giving a memorized definition without explaining values in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** values, override, template
- **Related module:** Helm

## interview-helm-4

- **Category:** Helm
- **Difficulty:** Advanced
- **Question:** Why run helm template or helm lint?
- **Current short answer:** A strong answer should mention render, lint, debug.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how render, lint, debug affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Helm workflow, use render as the starting point, verify lint, and confirm debug before moving on.
- **Common mistake:** Giving a memorized definition without explaining render in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** render, lint, debug
- **Related module:** Helm

## interview-helm-5

- **Category:** Helm
- **Difficulty:** Beginner
- **Question:** How do you roll back a Helm release?
- **Current short answer:** A strong answer should mention rollback, revision, release.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how rollback, revision, release affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Helm workflow, use rollback as the starting point, verify revision, and confirm release before moving on.
- **Common mistake:** Giving a memorized definition without explaining rollback in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** rollback, revision, release
- **Related module:** Helm

## interview-terraform-1

- **Category:** Terraform
- **Difficulty:** Beginner
- **Question:** What is Terraform state?
- **Current short answer:** A strong answer should mention state, mapping, resources.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how state, mapping, resources affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use state as the starting point, verify mapping, and confirm resources before moving on.
- **Common mistake:** Giving a memorized definition without explaining state in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** state, mapping, resources
- **Related module:** Terraform

## interview-terraform-2

- **Category:** Terraform
- **Difficulty:** Junior DevOps
- **Question:** What is the purpose of terraform plan?
- **Current short answer:** A strong answer should mention plan, preview, changes.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how plan, preview, changes affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use plan as the starting point, verify preview, and confirm changes before moving on.
- **Common mistake:** Giving a memorized definition without explaining plan in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** plan, preview, changes
- **Related module:** Terraform

## interview-terraform-3

- **Category:** Terraform
- **Difficulty:** Mid-level DevOps
- **Question:** How do providers work?
- **Current short answer:** A strong answer should mention provider, api, resource.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how provider, api, resource affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use provider as the starting point, verify api, and confirm resource before moving on.
- **Common mistake:** Giving a memorized definition without explaining provider in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** provider, api, resource
- **Related module:** Terraform

## interview-terraform-4

- **Category:** Terraform
- **Difficulty:** Advanced
- **Question:** When would you use modules?
- **Current short answer:** A strong answer should mention module, reuse, inputs.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how module, reuse, inputs affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use module as the starting point, verify reuse, and confirm inputs before moving on.
- **Common mistake:** Giving a memorized definition without explaining module in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** module, reuse, inputs
- **Related module:** Terraform

## interview-terraform-5

- **Category:** Terraform
- **Difficulty:** Beginner
- **Question:** How do you handle remote state safely?
- **Current short answer:** A strong answer should mention backend, locking, state.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how backend, locking, state affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use backend as the starting point, verify locking, and confirm state before moving on.
- **Common mistake:** Giving a memorized definition without explaining backend in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** backend, locking, state
- **Related module:** Terraform

## interview-ansible-1

- **Category:** Ansible
- **Difficulty:** Beginner
- **Question:** What makes Ansible agentless?
- **Current short answer:** A strong answer should mention ssh, control node, managed node.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how ssh, control node, managed node affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use ssh as the starting point, verify control node, and confirm managed node before moving on.
- **Common mistake:** Giving a memorized definition without explaining ssh in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** ssh, control node, managed node
- **Related module:** Ansible

## interview-ansible-2

- **Category:** Ansible
- **Difficulty:** Junior DevOps
- **Question:** What is an inventory?
- **Current short answer:** A strong answer should mention inventory, hosts, groups.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how inventory, hosts, groups affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use inventory as the starting point, verify hosts, and confirm groups before moving on.
- **Common mistake:** Giving a memorized definition without explaining inventory in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** inventory, hosts, groups
- **Related module:** Ansible

## interview-ansible-3

- **Category:** Ansible
- **Difficulty:** Mid-level DevOps
- **Question:** Why are handlers useful?
- **Current short answer:** A strong answer should mention notify, handler, restart.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how notify, handler, restart affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use notify as the starting point, verify handler, and confirm restart before moving on.
- **Common mistake:** Giving a memorized definition without explaining notify in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** notify, handler, restart
- **Related module:** Ansible

## interview-ansible-4

- **Category:** Ansible
- **Difficulty:** Advanced
- **Question:** What does idempotency mean in Ansible?
- **Current short answer:** A strong answer should mention idempotent, desired state, repeat.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how idempotent, desired state, repeat affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use idempotent as the starting point, verify desired state, and confirm repeat before moving on.
- **Common mistake:** Giving a memorized definition without explaining idempotent in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** idempotent, desired state, repeat
- **Related module:** Ansible

## interview-ansible-5

- **Category:** Ansible
- **Difficulty:** Beginner
- **Question:** How do roles organize automation?
- **Current short answer:** A strong answer should mention roles, tasks, templates.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how roles, tasks, templates affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use roles as the starting point, verify tasks, and confirm templates before moving on.
- **Common mistake:** Giving a memorized definition without explaining roles in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** roles, tasks, templates
- **Related module:** Ansible

## interview-ci-cd-1

- **Category:** CI/CD
- **Difficulty:** Beginner
- **Question:** What is the purpose of CI?
- **Current short answer:** A strong answer should mention integrate, test, feedback.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how integrate, test, feedback affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use integrate as the starting point, verify test, and confirm feedback before moving on.
- **Common mistake:** Giving a memorized definition without explaining integrate in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** integrate, test, feedback
- **Related module:** CI/CD

## interview-ci-cd-2

- **Category:** CI/CD
- **Difficulty:** Junior DevOps
- **Question:** What is the purpose of CD?
- **Current short answer:** A strong answer should mention deploy, pipeline, release.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how deploy, pipeline, release affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use deploy as the starting point, verify pipeline, and confirm release before moving on.
- **Common mistake:** Giving a memorized definition without explaining deploy in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** deploy, pipeline, release
- **Related module:** CI/CD

## interview-ci-cd-3

- **Category:** CI/CD
- **Difficulty:** Mid-level DevOps
- **Question:** Why should pipelines run tests before deploy?
- **Current short answer:** A strong answer should mention tests, quality, regression.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how tests, quality, regression affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use tests as the starting point, verify quality, and confirm regression before moving on.
- **Common mistake:** Giving a memorized definition without explaining tests in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** tests, quality, regression
- **Related module:** CI/CD

## interview-ci-cd-4

- **Category:** CI/CD
- **Difficulty:** Advanced
- **Question:** How would you protect production deployments?
- **Current short answer:** A strong answer should mention approval, rollback, environment.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how approval, rollback, environment affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use approval as the starting point, verify rollback, and confirm environment before moving on.
- **Common mistake:** Giving a memorized definition without explaining approval in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** approval, rollback, environment
- **Related module:** CI/CD

## interview-ci-cd-5

- **Category:** CI/CD
- **Difficulty:** Beginner
- **Question:** What should a good pipeline artifact provide?
- **Current short answer:** A strong answer should mention artifact, version, repeatable.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how artifact, version, repeatable affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use artifact as the starting point, verify version, and confirm repeatable before moving on.
- **Common mistake:** Giving a memorized definition without explaining artifact in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** artifact, version, repeatable
- **Related module:** CI/CD

## interview-devops-fundamentals-1

- **Category:** DevOps fundamentals
- **Difficulty:** Beginner
- **Question:** What does DevOps mean?
- **Current short answer:** A strong answer should mention collaboration, automation, delivery.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how collaboration, automation, delivery affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a DevOps fundamentals workflow, use collaboration as the starting point, verify automation, and confirm delivery before moving on.
- **Common mistake:** Giving a memorized definition without explaining collaboration in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** collaboration, automation, delivery
- **Related module:** DevOps fundamentals

## interview-devops-fundamentals-2

- **Category:** DevOps fundamentals
- **Difficulty:** Junior DevOps
- **Question:** Why is infrastructure as code useful?
- **Current short answer:** A strong answer should mention version, repeatable, review.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how version, repeatable, review affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use version as the starting point, verify repeatable, and confirm review before moving on.
- **Common mistake:** Giving a memorized definition without explaining version in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** version, repeatable, review
- **Related module:** Terraform

## interview-devops-fundamentals-3

- **Category:** DevOps fundamentals
- **Difficulty:** Mid-level DevOps
- **Question:** What is immutable infrastructure?
- **Current short answer:** A strong answer should mention replace, consistent, image.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how replace, consistent, image affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use replace as the starting point, verify consistent, and confirm image before moving on.
- **Common mistake:** Giving a memorized definition without explaining replace in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** replace, consistent, image
- **Related module:** Docker

## interview-devops-fundamentals-4

- **Category:** DevOps fundamentals
- **Difficulty:** Advanced
- **Question:** How do monitoring and alerting support operations?
- **Current short answer:** A strong answer should mention metrics, alerts, response.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how metrics, alerts, response affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Observability workflow, use metrics as the starting point, verify alerts, and confirm response before moving on.
- **Common mistake:** Giving a memorized definition without explaining metrics in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** metrics, alerts, response
- **Related module:** Observability

## interview-devops-fundamentals-5

- **Category:** DevOps fundamentals
- **Difficulty:** Beginner
- **Question:** What is configuration drift?
- **Current short answer:** A strong answer should mention drift, desired state, change.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how drift, desired state, change affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use drift as the starting point, verify desired state, and confirm change before moving on.
- **Common mistake:** Giving a memorized definition without explaining drift in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** drift, desired state, change
- **Related module:** Ansible

## interview-troubleshooting-1

- **Category:** Troubleshooting
- **Difficulty:** Beginner
- **Question:** A deployment fails after release. What do you check first?
- **Current short answer:** A strong answer should mention logs, events, rollback.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how logs, events, rollback affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use logs as the starting point, verify events, and confirm rollback before moving on.
- **Common mistake:** Giving a memorized definition without explaining logs in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** logs, events, rollback
- **Related module:** Kubernetes

## interview-troubleshooting-2

- **Category:** Troubleshooting
- **Difficulty:** Junior DevOps
- **Question:** A service is unreachable. How do you isolate the issue?
- **Current short answer:** A strong answer should mention network, dns, port.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how network, dns, port affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Linux workflow, use network as the starting point, verify dns, and confirm port before moving on.
- **Common mistake:** Giving a memorized definition without explaining network in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** network, dns, port
- **Related module:** Linux

## interview-troubleshooting-3

- **Category:** Troubleshooting
- **Difficulty:** Mid-level DevOps
- **Question:** A container exits immediately. What do you inspect?
- **Current short answer:** A strong answer should mention logs, command, exit code.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how logs, command, exit code affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use logs as the starting point, verify command, and confirm exit code before moving on.
- **Common mistake:** Giving a memorized definition without explaining logs in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** logs, command, exit code
- **Related module:** Docker

## interview-troubleshooting-4

- **Category:** Troubleshooting
- **Difficulty:** Advanced
- **Question:** Terraform apply fails halfway. What do you do?
- **Current short answer:** A strong answer should mention state, plan, retry.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how state, plan, retry affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use state as the starting point, verify plan, and confirm retry before moving on.
- **Common mistake:** Giving a memorized definition without explaining state in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** state, plan, retry
- **Related module:** Terraform

## interview-troubleshooting-5

- **Category:** Troubleshooting
- **Difficulty:** Beginner
- **Question:** An Ansible play fails on one host. How do you debug it?
- **Current short answer:** A strong answer should mention verbose, limit, module.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how verbose, limit, module affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use verbose as the starting point, verify limit, and confirm module before moving on.
- **Common mistake:** Giving a memorized definition without explaining verbose in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** verbose, limit, module
- **Related module:** Ansible

## interview-scenario-based-questions-1

- **Category:** Scenario-based questions
- **Difficulty:** Beginner
- **Question:** Design a simple deployment flow for a web app.
- **Current short answer:** A strong answer should mention build, test, deploy.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how build, test, deploy affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use build as the starting point, verify test, and confirm deploy before moving on.
- **Common mistake:** Giving a memorized definition without explaining build in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** build, test, deploy
- **Related module:** CI/CD

## interview-scenario-based-questions-2

- **Category:** Scenario-based questions
- **Difficulty:** Junior DevOps
- **Question:** How would you migrate a manual server setup into automation?
- **Current short answer:** A strong answer should mention inventory, playbook, idempotent.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how inventory, playbook, idempotent affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Ansible workflow, use inventory as the starting point, verify playbook, and confirm idempotent before moving on.
- **Common mistake:** Giving a memorized definition without explaining inventory in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** inventory, playbook, idempotent
- **Related module:** Ansible

## interview-scenario-based-questions-3

- **Category:** Scenario-based questions
- **Difficulty:** Mid-level DevOps
- **Question:** How would you expose a Kubernetes backend API?
- **Current short answer:** A strong answer should mention service, ingress, selector.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how service, ingress, selector affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Kubernetes workflow, use service as the starting point, verify ingress, and confirm selector before moving on.
- **Common mistake:** Giving a memorized definition without explaining service in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** service, ingress, selector
- **Related module:** Kubernetes

## interview-scenario-based-questions-4

- **Category:** Scenario-based questions
- **Difficulty:** Advanced
- **Question:** How would you reduce Docker image size?
- **Current short answer:** A strong answer should mention multi-stage, cache, dependencies.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how multi-stage, cache, dependencies affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Docker workflow, use multi-stage as the starting point, verify cache, and confirm dependencies before moving on.
- **Common mistake:** Giving a memorized definition without explaining multi-stage in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** multi-stage, cache, dependencies
- **Related module:** Docker

## interview-scenario-based-questions-5

- **Category:** Scenario-based questions
- **Difficulty:** Beginner
- **Question:** How would you structure Terraform for dev and prod?
- **Current short answer:** A strong answer should mention modules, backend, variables.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how modules, backend, variables affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Terraform workflow, use modules as the starting point, verify backend, and confirm variables before moving on.
- **Common mistake:** Giving a memorized definition without explaining modules in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** modules, backend, variables
- **Related module:** Terraform

## interview-behavioural-questions-1

- **Category:** Behavioural questions
- **Difficulty:** Beginner
- **Question:** Tell me about a time you handled an outage.
- **Current short answer:** A strong answer should mention impact, action, lesson.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how impact, action, lesson affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a DevOps fundamentals workflow, use impact as the starting point, verify action, and confirm lesson before moving on.
- **Common mistake:** Giving a memorized definition without explaining impact in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** impact, action, lesson
- **Related module:** DevOps fundamentals

## interview-behavioural-questions-2

- **Category:** Behavioural questions
- **Difficulty:** Junior DevOps
- **Question:** How do you communicate risk before a deployment?
- **Current short answer:** A strong answer should mention risk, stakeholders, rollback.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how risk, stakeholders, rollback affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a CI/CD workflow, use risk as the starting point, verify stakeholders, and confirm rollback before moving on.
- **Common mistake:** Giving a memorized definition without explaining risk in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** risk, stakeholders, rollback
- **Related module:** CI/CD

## interview-behavioural-questions-3

- **Category:** Behavioural questions
- **Difficulty:** Mid-level DevOps
- **Question:** How do you learn a tool you have not used before?
- **Current short answer:** A strong answer should mention documentation, practice, feedback.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how documentation, practice, feedback affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a DevOps fundamentals workflow, use documentation as the starting point, verify practice, and confirm feedback before moving on.
- **Common mistake:** Giving a memorized definition without explaining documentation in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** documentation, practice, feedback
- **Related module:** DevOps fundamentals

## interview-behavioural-questions-4

- **Category:** Behavioural questions
- **Difficulty:** Advanced
- **Question:** Describe a time you improved a process.
- **Current short answer:** A strong answer should mention problem, automation, result.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how problem, automation, result affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a DevOps fundamentals workflow, use problem as the starting point, verify automation, and confirm result before moving on.
- **Common mistake:** Giving a memorized definition without explaining problem in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** problem, automation, result
- **Related module:** DevOps fundamentals

## interview-behavioural-questions-5

- **Category:** Behavioural questions
- **Difficulty:** Beginner
- **Question:** How do you handle disagreement during incident response?
- **Current short answer:** A strong answer should mention listen, evidence, priority.
- **Current detailed answer:** Explain the concept clearly, connect it to real operational work, and show how listen, evidence, priority affect reliability, repeatability, or delivery speed.
- **Example:** Example: in a Troubleshooting workflow, use listen as the starting point, verify evidence, and confirm priority before moving on.
- **Common mistake:** Giving a memorized definition without explaining listen in a real troubleshooting or delivery context.
- **Interview tip:** Answer in a simple structure: define it, explain why it matters, then give a concrete example.
- **Required keywords:** listen, evidence, priority
- **Related module:** Troubleshooting

