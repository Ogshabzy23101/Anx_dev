# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A dark, terminal-themed React SPA (Vite) for self-study DevOps drilling: Linux, Docker, Kubernetes, Helm, Terraform, and Ansible learning modules, plus an Interview Mode and Practice Labs. Deployed to GitHub Pages at `/Anx_dev/`. No backend — all progress persists to `localStorage`.

## Commands

```bash
npm run dev              # start Vite dev server
npm run build             # production build to dist/
npm run preview           # preview the production build
npm test                  # run the full Vitest suite once
npm run test:watch        # Vitest watch mode
npx vitest run src/data/linux.test.js   # run a single test file
npx vitest run -t "test name"           # run tests matching a name
npm run export:interview-review         # dump src/data/interview.js to docs/interview-question-review.md for human review
npm run import:interview-review -- docs/interview-question-review.md   # re-import reviewed answers back into interview.js
```

CI (`.github/workflows/ci.yml`) runs on every push/PR to `main`: `npm test`, `npm run build`, `npm audit --audit-level=high`, then deploys `dist/` to GitHub Pages (push only, not PRs).

Tests use Vitest + React Testing Library + `user-event` in jsdom (`vite.config.js` sets `pool: "threads"`, `maxWorkers: 2`). Every data/util module has a co-located `*.test.js(x)` file — when adding entries to a module's data file, check whether its test file asserts a total count and update both together.

## Architecture

### One generic engine drives six learning modules

`src/data/learningModuleRegistry.js` is the composition root. Each of `linux`, `docker`, `kubernetes`, `helm`, `terraform`, `ansible` is built by `makeModule()`, which wires together that module's raw data (command catalog, categories, flashcards, MCQs, command quiz, practice tasks) and derives its reference content via `splitReferenceContent` (in `src/utils/referenceContent.js`). There is no per-module React component — `LazyLearningModule` → `ModuleLab` (`src/components/module/ModuleLab.jsx`) renders whichever mode is active (`notes`, `command-reference`, `flashcards`, `quiz`, `commands`, and a practice mode) generically off the module object. Adding a new module means adding a data file + registry entry, not new components.

### Notes vs. Commands split

Each module's raw catalog entries are conceptual write-ups. `splitReferenceContent` classifies each entry's `command`/`syntax`/`examples` against a whitelist of known executable prefixes (`isExecutableReference` in `referenceContent.js`) to split it into `reference.notes` (conceptual, e.g. RBAC, etcd, Docker images) and `reference.commands` (runnable CLI reference, e.g. `kubectl get pods`). This is why raw data files look monolithic but the UI presents two distinct tabs.

### Per-module data files follow a fixed shape

For each tool there is typically `{tool}.js` (categories, flashcards, MCQs, command quiz, re-exports), `{tool}Catalog.js` (the raw reference entries), and `{tool}ExtraPractice.js` or `{tool}Practice.js`/`{tool}PracticeLabs.js` (hands-on exercises). Practice tasks are plain data (instruction, starter content, reference solution, validation rules) consumed generically by `FilePractice`/`answerValidation.js` — the validator checks that required regex/label rules appear in the learner's answer rather than requiring an exact match, so extra valid commands or formatting differences pass.

### Progress state

All progress lives in one `localStorage` blob under key `devops-lab-progress-v1` (`useLocalStorage` hook + `initialProgress`/`migrateProgress` in `src/utils/progressMigration.js`). `src/data/moduleStats.js` defines per-module keys/totals (mastered flashcards, quiz score, completed commands, completed practices) that `App.jsx` and `ModuleLab.jsx` read/write generically — a new module needs an entry here too. `contentValidation.js` provides `validateLearningModule(s)` to sanity-check that a module's registry object actually has all required collections/fields populated.

### Interview Mode has its own review workflow

Interview questions (`src/data/interview.js`) are the only content with a `reviewStatus` field (`needs-review` / `reviewed`) instead of implicit completeness. `src/utils/interviewReviewWorkflow.js` serializes/parses questions to/from the Markdown format in `docs/interview-question-review.md`, driven by `scripts/exportInterviewReview.mjs` and `scripts/importInterviewReview.mjs` — the intended loop is export → hand-edit the Markdown → import back into `interview.js`. `CONTENT_STYLE_GUIDE.md` defines the required shape and quality bar for both "command/tool" and "concept" entries reviewed this way (comparative framing, gotchas tables, no invented real-world examples, no placeholder phrasing) — follow it when writing or reviewing any reference/flashcard/interview content, not just interview questions.

### Practice Labs are separate from per-module practice tasks

`PracticeLabs.jsx` (routed outside `learningModuleRegistry`, alongside `interview`) covers guided Linux/Docker labs (`src/data/practiceLabs.js`, `dockerPracticeLabs.js`) backed by static file trees checked into `public/practice-repos/{linux,docker}-practice-lab/`. `practiceRepository`/`dockerPracticeRepository` map lab categories to actual files in those trees (asserted by test files), distinct from the per-module `FilePractice` exercises embedded in each learning module's own practice tab.
