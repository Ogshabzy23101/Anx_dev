# DevOps Learning Lab

[![CI](https://github.com/Ogshabzy23101/Anx_dev/actions/workflows/ci.yml/badge.svg)](https://github.com/Ogshabzy23101/Anx_dev/actions/workflows/ci.yml)

A dark, terminal-inspired React learning app for building hands-on DevOps skills. Phase 13 includes enriched Linux, Docker, Kubernetes, Helm, Terraform, and Ansible curricula, enhanced correction feedback, automated tests, and continuous integration.

Live site: [https://ogshabzy23101.github.io/Anx_dev/](https://ogshabzy23101.github.io/Anx_dev/)

## Features

- Searchable Linux reference with 108 commands across 18 categories
- 108 structured Linux flashcards with difficulty and category filters
- 108-question Linux multiple-choice bank with saved best score
- 108 Linux command-writing challenges with accepted alternatives
- Correction popups with explanations
- 25 interactive Linux shell script exercises with requirement-based validation
- Searchable Docker reference with 80 entries across 20 categories
- 80 structured Docker flashcards, MCQs, and command/configuration challenges
- 25 Dockerfile, `.dockerignore`, and Compose exercises with requirement-based validation
- Searchable Kubernetes reference with 126 entries across 42 categories
- 126 structured Kubernetes flashcards, MCQs, and kubectl challenges
- 35 Kubernetes manifest exercises with YAML-aware requirement checks
- Searchable Helm reference with 104 entries across 26 categories
- 104 structured Helm flashcards, MCQs, and command-writing challenges
- 30 Helm chart, values, and Go-template writing exercises
- Searchable Terraform reference with 124 entries across 31 categories
- 124 structured Terraform flashcards, MCQs, and CLI command challenges
- 31 Terraform HCL exercises with block, attribute, state, backend, module, and AWS validation
- Searchable Ansible reference with 124 entries across 31 categories
- 124 structured Ansible flashcards, MCQs, and command-writing challenges
- 31 Ansible playbook, inventory, role, Vault, and YAML exercises
- UX-001 feedback showing correct sections, missing sections, expected values, and user values
- Retry, solution reveal, and side-by-side answer comparison
- Success and correction modals
- Local progress persistence via `localStorage`
- Responsive navigation for Linux, Docker, Kubernetes, Terraform, Ansible, Helm, CI/CD, AWS, and Observability
- Vitest and React Testing Library coverage for answer checking, persistence, and feedback

## Setup

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Tests

Run the full test suite once:

```bash
npm test
```

Run tests in watch mode while developing:

```bash
npm run test:watch
```

Tests use Vitest, React Testing Library, `user-event`, and the jsdom browser environment. The current suite contains **108 tests across 28 test files**.

## Linux enrichment

Phase 8 makes Linux the deepest learning module in the app:

- **108 reference commands** spanning navigation, files, text processing, search, permissions, identities, processes, monitoring, storage, networking, packages, services, archives, SSH, shell environments, Bash, and troubleshooting
- **108 flashcards** with beginner and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **108 multiple-choice questions** and **108 command-writing challenges**
- **25 script exercises** covering variables, conditions, loops, logs, disk and service checks, HTTP health checks, permissions, archives, user creation, ports, deployment, environment variables, functions, and cleanup traps

Reference commands are presented as expandable cards so detailed explanations remain easy to scan. Linux reference and flashcard views support full-text search plus category and difficulty filtering. Existing module progress remains stored in `localStorage`.

## Practice validation

Practice tasks are defined in `src/data/linuxPractice.js`. Each task provides:

- An instruction, filename, starter content, and reference solution
- A list of validation rules
- A human-readable label and regular expression for each required script element

The validator checks whether every required element appears in the learner's answer. It does not require an exact full-text match, so formatting differences and valid extra commands are accepted. For example, the file-existence exercise checks independently for `if`, `-f app.log`, `then`, and `fi`.

The editor component receives its tasks as data. Linux shell tasks live in `src/data/linuxPractice.js`; Docker, Kubernetes, Helm, Terraform, and Ansible content each live in their own data modules. Future formats can use the same workflow with tool-specific rules.

## Docker module

Phase 9 applies the enriched Linux learning pattern to Docker:

- **80 reference entries** across Docker basics, images, containers, Dockerfiles, build context, registries, storage, networking, ports, environment configuration, debugging, lifecycle, Compose, multi-stage builds, optimization, security, troubleshooting, and DevOps workflows
- **80 flashcards** with basic and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **80 multiple-choice questions** and **80 command/configuration writing challenges**
- **25 file exercises** covering Node, Nginx, Python, Express, Vite multi-stage builds, optimized and non-root images, `.dockerignore`, and Docker Compose stacks
- Independent local progress for mastered cards, best quiz score, solved commands, and completed files

Docker reference and flashcard views support full-text search, category filters, difficulty filters, expandable entries, examples, common mistakes, and DevOps use cases. Dockerfile and Compose answers are checked by required instructions and patterns rather than exact text, allowing valid formatting and implementation variations.

## Kubernetes module

Phase 10 applies the enriched Linux and Docker learning pattern to Kubernetes:

- **126 reference entries** across 42 categories covering architecture, workloads, networking, storage, RBAC, probes, scheduling, scaling, rollouts, troubleshooting, kubectl, and DevOps workflows
- **126 flashcards** with basic and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **126 multiple-choice questions** and **126 kubectl command-writing challenges**
- **35 manifest exercises** covering core workloads, every major Service type, Ingress, storage, RBAC, probes, resources, HPA, init and sidecar containers, configuration injection, ServiceMonitor, NetworkPolicy, and a three-tier application
- Independent local progress for mastered cards, best MCQ score, kubectl score, completed manifests, and module completion

Kubernetes reference and flashcard views support full-text search, category and difficulty filters, expandable resource cards, manifest or kubectl examples, common mistakes, and DevOps use cases.

### Kubernetes YAML validation

Kubernetes tasks use reusable helpers from `src/utils/kubernetesValidation.js`. The validator remains intentionally lightweight: it does not parse a complete Kubernetes object model, but it understands common manifest requirements such as:

- Required YAML keys and strings
- `apiVersion` and `kind`
- `metadata.name`
- `spec.replicas`
- Container images
- Service `port` and `targetPort`
- Ingress paths
- RBAC verbs

Rules can use regular expressions or custom test functions, leaving a clear path to a full YAML parser and schema validation later. Formatting differences, comments, and valid additional fields are accepted as long as the required semantics are present.

Example Deployment exercise:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
```

An incorrect answer opens a correction modal with missing requirements, a short explanation, the expected solution, side-by-side comparison, Retry, and Show solution actions.

## Helm module

Phase 11 applies the enriched Linux, Docker, and Kubernetes learning pattern to Helm:

- **104 reference entries** across Helm basics, charts, releases, repositories, metadata, values, templates, helpers, functions, control flow, dependencies, versioning, lifecycle commands, linting, rendering, debugging, and DevOps workflows
- **104 flashcards** with basic and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **104 multiple-choice questions** and **104 Helm command-writing challenges**
- **30 chart/YAML exercises** covering Chart.yaml, values.yaml, Deployment, Service, Ingress, ConfigMap, Secret, helpers, include, if, range, default, quote, toYaml, nindent, resources, probes, env, imagePullSecrets, ServiceAccount, NOTES, dependencies, frontend/backend/postgres chart values, parent values, environment overrides, and full app chart structure
- Independent local progress for mastered cards, best MCQ score, Helm command score, completed chart files, and module completion

Helm reference and flashcard views support full-text search, category and difficulty filters, expandable chart cards, chart or command examples, common mistakes, and DevOps use cases.

### Helm validation

Helm exercises reuse the requirement-based practice engine and add helpers from `src/utils/helmValidation.js`. Validation can check:

- Required strings and YAML keys
- Chart.yaml and values.yaml fields
- Helm template delimiters and expressions
- `.Values` paths
- Named-template definitions and `include` calls
- `if` and `range` blocks
- Kubernetes `apiVersion`, `kind`, and resource structure

The validator does not execute Helm or fully parse Go templates. It intentionally checks required semantics while allowing whitespace differences, comments, extra fields, pipelines, and reasonable chart variations.

Example Deployment template exercise:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "webapp.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ include "webapp.name" . }}
  template:
    metadata:
      labels:
        app: {{ include "webapp.name" . }}
    spec:
      containers:
        - name: webapp
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

Incorrect chart answers receive missing requirements, a short explanation, the expected solution, side-by-side comparison, Retry, and Show solution controls.

## Terraform module

Phase 12 applies the enriched Linux, Docker, Kubernetes, and Helm learning pattern to Terraform:

- **124 reference entries** across Terraform basics, providers, resources, data sources, variables, outputs, locals, state, remote state, backends, workspaces, modules, count, `for_each`, dynamic blocks, lifecycle, dependencies, provisioners, import, plan/apply, destroy, validation, security, secrets, AWS, VPC, EC2, S3 backend, DynamoDB locking, troubleshooting, and DevOps workflows
- **124 flashcards** with basic and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **124 multiple-choice questions** and **124 Terraform CLI challenges**
- **31 HCL exercises** covering AWS providers, EC2, security groups, variables, outputs, locals, data sources, modules, S3 backend, DynamoDB locking, count, `for_each`, lifecycle, `depends_on`, VPC, subnets, internet gateways, route tables, security group rules, IAM, EKS module usage, remote state, tfvars, sensitive variables, complete EC2 projects, complete backend configuration, workspace naming, and reusable module interfaces
- Independent local progress for mastered cards, best MCQ score, Terraform command score, completed HCL files, and module completion

Terraform reference and flashcard views support full-text search, category and difficulty filters, expandable HCL/CLI cards, examples, common mistakes, and DevOps use cases.

### HCL validation

Terraform exercises use helpers from `src/utils/terraformValidation.js`. The lightweight validator checks:

- Provider, resource, data, variable, output, module, and backend blocks
- Required HCL attributes and expected values
- References such as `aws_instance.web.public_ip`
- Nested blocks such as `lifecycle`, `route`, and backend `config`
- Collection and iteration expressions such as `count.index`, `each.value`, and `toset`
- State and backend requirements such as S3 bucket/key/region, encryption, and DynamoDB locking
- AWS infrastructure composition such as VPCs, subnets, gateways, IAM roles, policy attachments, and module outputs

Validation is requirement-based rather than exact-text matching. It accepts formatting differences and additional valid configuration while reporting precise missing blocks and attributes.

Example EC2 exercise:

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-123456"
  instance_type = "t3.micro"
}
```

## UX-001 feedback

Correction dialogs now provide structured feedback across Linux, Docker, Kubernetes, Helm, Terraform, and Ansible:

- `✓ Correct sections` lists requirements already satisfied
- `✗ Missing sections` lists exact requirements still needed
- `Expected values` shows the accepted command or reference file
- `User values` shows the submitted command or file
- Side-by-side comparison, explanation, Retry, and Show solution remain available

Command feedback compares expected and submitted command tokens. File feedback uses each exercise's declarative validation rules, so every module receives the same diagnostics without duplicating modal logic.

## Ansible module

Phase 13 applies the enriched Linux, Docker, Kubernetes, Helm, and Terraform learning pattern to Ansible:

- **124 reference entries** across Ansible basics, inventory, hosts, groups, variables, facts, tasks, plays, playbooks, modules, package management, services, files, templates, Jinja2, loops, conditions, handlers, notify, register, debug, tags, roles, collections, Galaxy, Vault, become, SSH, configuration, troubleshooting, and DevOps workflows
- **124 flashcards** with basic and professional explanations, examples, DevOps use cases, related concepts, categories, and difficulty levels
- **124 multiple-choice questions** and **124 Ansible command-writing challenges**
- **31 playbook/YAML exercises** covering package and service management, copying files, templates, variables, handlers, notify, loops, conditions, register, debug, become, inventory groups, `group_vars`, `host_vars`, roles, Galaxy, Vault, tags, collections, dynamic inventory, secure secrets, and complete production playbooks
- Independent local progress for mastered cards, best MCQ score, command score, completed playbooks, and module completion

Ansible reference and flashcard views support full-text search, category and difficulty filters, expandable YAML/command cards, examples, common mistakes, and DevOps use cases.

### Ansible validation

Ansible exercises use helpers from `src/utils/ansibleValidation.js`. Validation checks required YAML and automation concepts without requiring an exact full-text match:

- Play targets through `hosts`
- Privilege escalation through `become`
- Task and handler sections
- Short and `ansible.builtin` module names
- Package names and service states
- `notify`, variables, loops, conditions, registration, and debug output
- Role structure, inventory groups, `group_vars`, `host_vars`, Galaxy role requirements, Vault files, collections, dynamic inventory, and production playbook patterns

Example nginx playbook:

```yaml
---
- hosts: web
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Start nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true
```

Invalid playbooks receive UX-001 requirement diagnostics, expected and submitted values, an explanation, side-by-side comparison, Retry, and Show solution controls.

## Modules

| Module | Status | Practice format |
| --- | --- | --- |
| Linux | Complete | Bash scripts |
| Docker | Complete | Dockerfile and `.dockerignore` |
| Kubernetes | Complete | Kubernetes YAML manifests |
| Helm | Complete | Charts, values, and Go templates |
| Terraform | Complete | Terraform HCL |
| Ansible | Complete | Playbooks, roles, and YAML |
| CI/CD, AWS, Observability | Planned | To be added |

## Continuous integration

The GitHub Actions workflow in `.github/workflows/ci.yml` runs checks for every pull request and every push to `main`. It:

1. Checks out the repository
2. Sets up Node.js 22 with npm caching
3. Installs locked dependencies with `npm ci`
4. Runs the Vitest suite
5. Builds the production bundle
6. Fails on high-severity npm audit findings
7. Uploads `dist` and deploys it to GitHub Pages after successful pushes to `main`

The same checks can be run locally:

```bash
npm ci
npm test
npm run build
npm audit --audit-level=high
```

## GitHub Pages deployment

The app is deployed as a Vite project site under the repository path `/Anx_dev/`. The matching `base` value is configured in `vite.config.js`, so generated JavaScript and CSS URLs resolve below the repository path instead of the domain root.

To enable the workflow:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` or manually rerun the **CI and Pages** workflow.

The workflow builds the app, uploads only the generated `dist` directory, and deploys it with the official GitHub Pages actions. Pull requests run tests and build checks but do not deploy.

After a successful deployment, open:

```text
https://ogshabzy23101.github.io/Anx_dev/
```

This project does not currently use React Router. If client-side routes are introduced later, use hash-based routing for Pages or add an explicit SPA fallback strategy.

## Project structure

```text
src/
  components/       Reusable learning activities and UI
  data/             Tool registry, learning content, and practice tasks
  hooks/            Shared React hooks, including localStorage persistence
  test/             Shared test environment setup
  utils/            Pure answer and practice validation functions
  App.jsx           App shell, navigation, and overall progress
  styles.css        Terminal visual system and responsive styles
```

To add another tool, create a new data module under `src/data`, build its lab component, and connect it to the tool registry and app shell.

## Next direction

All current active learning modules are enriched. A sensible next phase is to plan CI/CD, AWS, or Observability as the next complete module while preserving the same data-driven content, validation, and progress patterns.
