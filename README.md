# DevOps Learning Lab

[![CI](https://github.com/Ogshabzy23101/Anx_dev/actions/workflows/ci.yml/badge.svg)](https://github.com/Ogshabzy23101/Anx_dev/actions/workflows/ci.yml)

A dark, terminal-inspired React learning app for building hands-on DevOps skills. Phase 5 includes complete Linux, Docker, Kubernetes, and Helm modules, interactive file practice, automated tests, and continuous integration.

Live site: [https://ogshabzy23101.github.io/Anx_dev/](https://ogshabzy23101.github.io/Anx_dev/)

## Features

- Linux command reference
- Masterable flashcards
- Multiple-choice quiz with saved best score
- Command-writing challenges with alternative accepted answers
- Correction popups with explanations
- Interactive Linux shell script editor with validation
- Complete Docker reference, flashcards, quizzes, and progress tracking
- Docker command-writing challenges with accepted alternatives
- Dockerfile and `.dockerignore` practice with requirement-based validation
- Complete Kubernetes reference, flashcards, MCQ, and kubectl command practice
- Fifteen Kubernetes manifest exercises with YAML-aware requirement checks
- Complete Helm reference, flashcards, MCQ, and command practice
- Fifteen Helm chart, values, and Go-template writing exercises
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

Tests use Vitest, React Testing Library, `user-event`, and the jsdom browser environment. The current suite contains **46 tests across 14 test files**.

## Practice validation

Practice tasks are defined in `src/data/linuxPractice.js`. Each task provides:

- An instruction, filename, starter content, and reference solution
- A list of validation rules
- A human-readable label and regular expression for each required script element

The validator checks whether every required element appears in the learner's answer. It does not require an exact full-text match, so formatting differences and valid extra commands are accepted. For example, the file-existence exercise checks independently for `if`, `-f app.log`, `then`, and `fi`.

The editor component receives its tasks as data. Linux shell tasks live in `src/data/linuxPractice.js`, Docker content lives in `src/data/docker.js`, Kubernetes content lives in `src/data/kubernetes.js`, and Helm content lives independently in `src/data/helm.js`. Future Compose, Terraform HCL, and Ansible YAML exercises can use the same workflow with tool-specific rules.

## Docker module

The Docker module mirrors the Linux learning flow:

- Reference material for images, containers, Dockerfiles, build context, runtime configuration, networking, registries, and multi-stage builds
- Flashcards and a scored multiple-choice quiz
- Command-writing exercises for common build, run, inspect, networking, tagging, and push workflows
- Dockerfile practice for Node.js, Nginx, React/Vite multi-stage builds, core instructions, and `.dockerignore`
- Independent local progress for mastered cards, best quiz score, solved commands, and completed files

Dockerfile answers are checked by required instructions and patterns rather than exact text, allowing valid formatting and implementation variations.

## Kubernetes module

The Kubernetes module follows the same learning loop as Linux and Docker:

- Reference material for cluster architecture, workloads, networking, storage, configuration, RBAC, and kubectl workflows
- Fifteen flashcards
- Twenty-five multiple-choice questions
- Twenty-five kubectl command-writing challenges with accepted aliases and long-form alternatives
- Fifteen beginner-to-intermediate manifest exercises
- Independent local progress for mastered cards, best MCQ score, kubectl score, completed manifests, and module completion

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

The Helm module builds directly on the Kubernetes concepts already taught:

- Reference material for charts, releases, repositories, values, templates, lifecycle commands, dependencies, and versioning
- Fifteen flashcards
- Twenty-five multiple-choice questions
- Twenty-five Helm command-writing challenges with accepted aliases and flag alternatives
- Fifteen exercises covering Chart.yaml, values.yaml, Kubernetes templates, helpers, conditionals, loops, notes, and dependencies
- Independent local progress for mastered cards, best MCQ score, Helm command score, completed chart files, and module completion

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

## Modules

| Module | Status | Practice format |
| --- | --- | --- |
| Linux | Complete | Bash scripts |
| Docker | Complete | Dockerfile and `.dockerignore` |
| Kubernetes | Complete | Kubernetes YAML manifests |
| Helm | Complete | Charts, values, and Go templates |
| Terraform, Ansible, CI/CD, AWS, Observability | Planned | To be added |

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

## Phase 6

Phase 6 should add:

- A complete Terraform module
- Providers, resources, data sources, variables, outputs, state, modules, and lifecycle concepts
- Terraform CLI command practice for init, plan, apply, destroy, import, fmt, validate, and state
- HCL writing exercises for AWS-style infrastructure and reusable modules
- Lightweight HCL validation for blocks, attributes, references, variables, and outputs
- Larger randomized question banks
- Per-module completion states, streaks, and achievements
- Accessibility and cross-browser testing
- Deployment automation and preview environments
