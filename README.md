# DevOps Learning Lab

A dark, terminal-inspired React learning app for building hands-on DevOps skills. Phase 2 includes a complete Linux learning module, automated tests, and interactive shell script practice.

## Features

- Linux command reference
- Masterable flashcards
- Multiple-choice quiz with saved best score
- Command-writing challenges with alternative accepted answers
- Correction popups with explanations
- Interactive Linux shell script editor with validation
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

Tests use Vitest, React Testing Library, `user-event`, and the jsdom browser environment.

## Practice validation

Practice tasks are defined in `src/data/linuxPractice.js`. Each task provides:

- An instruction, filename, starter content, and reference solution
- A list of validation rules
- A human-readable label and regular expression for each required script element

The validator checks whether every required element appears in the learner's answer. It does not require an exact full-text match, so formatting differences and valid extra commands are accepted. For example, the file-existence exercise checks independently for `if`, `-f app.log`, `then`, and `fi`.

The editor component receives its tasks as data. Future Dockerfile, Compose, Kubernetes YAML, Terraform HCL, Ansible YAML, and Helm values exercises can use the same workflow with tool-specific rules.

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

## Phase 3

Phase 3 should add:

- Docker lessons, quizzes, and Dockerfile practice
- Docker Compose and Kubernetes YAML validation
- Larger randomized question banks
- Per-module completion states, streaks, and achievements
- More semantic validation that understands file structure, not only required patterns
- Accessibility and cross-browser testing
- CI checks for tests, builds, formatting, and deployment
