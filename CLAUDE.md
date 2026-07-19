# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A dark, terminal-themed React SPA (Vite) for self-study DevOps drilling: Linux, Docker, Kubernetes, Helm, Terraform, and Ansible learning modules, plus Interview Prep and Practice Labs. Deployed to GitHub Pages at `/Anx_dev/`. No backend — all progress persists to `localStorage`.

## Commands

```bash
npm run dev              # start Vite dev server
npm run build             # production build to dist/
npm run preview           # preview the production build
npm test                  # run the full Vitest suite once
npm run test:watch        # Vitest watch mode
npx vitest run src/data/linux.test.js   # run a single test file
npx vitest run -t "test name"           # run tests matching a name
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

### Interview Prep is a formula-driven answer builder, not a quiz

`src/data/interview.js` holds ~60 hand-authored questions, each tagged with a `formulaType` (`concept`, `troubleshooting`, or `star`) that maps to a fixed stage list in `interviewFormulas` (e.g. concept → What it is / Why it matters / Example / Gotcha). The UI (`InterviewLab.jsx`) has two modes: **Practice** — pick a question, see its formula stages as a hint, write your own answer, and check it against a `checklist` of regex-based rules (via the same `validatePracticeAnswer` used by module practice tasks) that surface what you hit and missed inline, plus a collapsed "show model answer" — and **Reference** — a read-only browse of every question's model answer, checklist, and common mistake. There is deliberately no MCQ or flashcard mode here; the previous version's Q&A Bank/Flashcards/Quiz/Written/Mock split was replaced because multiple-choice and rote flashcards don't build the actual skill of producing a spoken answer. The `Behavioral & project` category's model answers are grounded in the real `phone-store-3tier` project (its actual stack, CI/CD chain, Kubernetes/Terraform/Ansible setup, and real bugs it hit) rather than invented scenarios — see `CONTENT_STYLE_GUIDE.md` for the no-fabrication rule that also governs this content. Progress tracks only `interviewPracticedIds` (an array of question ids checked at least once) — see `moduleStats.interview` and the `interview`-specific branches in `App.jsx`'s `getProgressSummary`/`calculateInterviewProgress`, which are special-cased outside the generic mastered/quiz/practice module-stats shape the six learning modules share.

### Practice Labs are separate from per-module practice tasks

`PracticeLabs.jsx` (routed outside `learningModuleRegistry`, alongside `interview`) covers guided Linux/Docker labs (`src/data/practiceLabs.js`, `dockerPracticeLabs.js`) backed by static file trees checked into `public/practice-repos/{linux,docker}-practice-lab/`. `practiceRepository`/`dockerPracticeRepository` map lab categories to actual files in those trees (asserted by test files), distinct from the per-module `FilePractice` exercises embedded in each learning module's own practice tab.
