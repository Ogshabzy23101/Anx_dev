import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { interviewQuestions } from "./interview";

describe("interview review import script", () => {
  it("imports reviewed JSON into an overrides file", () => {
    const dir = mkdtempSync(join(tmpdir(), "interview-review-"));
    const inputPath = join(dir, "review.json");
    const outputPath = join(dir, "interviewReviewedOverrides.js");
    const sample = interviewQuestions[0];

    writeFileSync(inputPath, JSON.stringify([
      {
        id: sample.id,
        category: sample.category,
        difficulty: sample.difficulty,
        question: sample.question,
        shortAnswer: "Use a concise answer that names the role, tools, and measurable impact.",
        detailedAnswer: "I would explain the role, the tools used, the project context, the operational responsibility, and a measurable impact so the interviewer hears both scope and outcome.",
        beginnerExplanation: "A good intro tells the interviewer who you are, what tools you use, and what value you delivered.",
        professionalExplanation: "A professional answer connects role scope, DevOps tooling, ownership, collaboration, and measurable impact without drifting into a long biography.",
        realWorldExample: "For example, mention owning CI/CD pipelines, improving deployment time, and supporting Kubernetes workloads during releases.",
        commands: ["git status", "kubectl get pods"],
        followUpQuestions: ["What was the measurable impact?", "Which tools did you use most?"],
        commonMistakes: ["Listing tools without explaining impact."],
        interviewTip: "Keep it under two minutes and finish with a quantified result.",
        requiredKeywords: ["role", "tools", "impact"],
        relatedModule: sample.relatedModule,
        reviewStatus: "approved",
      },
    ], null, 2));

    execFileSync("node", ["scripts/importInterviewReview.mjs", inputPath, outputPath], {
      cwd: process.cwd(),
      stdio: "pipe",
    });

    const output = readFileSync(outputPath, "utf8");
    expect(output).toContain("interviewReviewedOverrides");
    expect(output).toContain(sample.id);
    expect(output).toContain('"reviewStatus": "approved"');
  });
});
