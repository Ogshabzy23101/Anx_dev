# Anx_dev Content Style Guide

This is the quality bar for every reference entry, flashcard, and interview answer in the app.
Modeled directly on Dami's own Ansible Command Reference and Docker Revision Notes —
the standard those hit is the standard every entry should hit.

## Required shape for a "command / tool" entry

1. **Name + one-line role** — what it does, in under 10 words.
2. **SYNTAX** — the actual command pattern, e.g. `ansible-playbook PLAYBOOK.yml [OPTIONS]`
3. **Plain-English explanation (2-3 sentences)** — what it does and, critically, *when you'd
   reach for it over an alternative* (e.g. `command` vs `shell`, `copy` vs `template`,
   `service` vs `systemd`). Comparative framing beats a flat definition every time.
4. **Common Flags & Options** — a short table, not prose. Flag → what it does.
5. **Examples** — 2-4 real, runnable lines. Not one throwaway toy example.
6. **Real-world tie-in (where genuinely applicable)** — connect it to something in
   phone-store-3tier specifically (a real file, a real decision made), not a generic scenario.

## Required shape for a "concept" entry (e.g. RBAC, Ingress, GitOps)

1. **Core idea in one sentence.**
2. **Key terms table** — term → what it means, kept tight.
3. **A worked example** — real YAML/config, not abstract pseudocode.
4. **One mental model or analogy** — only if the concept is genuinely abstract, and only
   one per entry. (Dockerfile=recipe / Image=meal-prepped dish / Container=served meal /
   Registry=freezer is the bar — vivid, accurate, and doesn't overreach.)
5. **Common Gotchas table** — cause → symptom, or symptom → cause. This is the highest-value
   section and the one most existing entries are missing entirely.

## Hard rules

- **No placeholder phrasing.** Banned: "explain the concept clearly," "understand how X works,"
  or any sentence that could apply to literally any technology if you swapped the noun out.
- **No invented real-world examples.** If it ties to phone-store-3tier, cite the actual file
  or workflow. If it doesn't genuinely tie in, leave the real-world-example field generic
  rather than fabricate a fake anecdote.
- **Comparative over definitional.** "X does A, unlike Y which does B" beats "X is a tool that does A."
  This is the single biggest gap between the reference PDFs and the current app content.
- **Gotchas are not optional for concept entries.** If you can't think of a real gotcha,
  that's a signal the entry needs more research before it's marked reviewed.
- **One analogy max per entry, and only when the concept is genuinely abstract.** Overused
  analogies read as filler, not insight.

## Review status

Every rewritten entry should flip from `needs-review` to `reviewed` only once it satisfies
every required section above — not just once it has text in every field.
