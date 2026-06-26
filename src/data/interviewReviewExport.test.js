import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { interviewQuestions } from "./interview";

const reviewPath = join(process.cwd(), "docs", "interview-question-review.md");

describe("interview question review export", () => {
  it("writes a human-readable review file", () => {
    expect(existsSync(reviewPath)).toBe(true);
    const content = readFileSync(reviewPath, "utf8");

    expect(content).toContain("# Interview Question Review");
    expect(content).toContain(`Total questions: ${interviewQuestions.length}`);
  });

  it("includes question ids and current answers", () => {
    const content = readFileSync(reviewPath, "utf8");
    const sample = interviewQuestions[0];

    expect(content).toContain(`## ${sample.id}`);
    expect(content).toContain(`- **Question:** ${sample.question}`);
    expect(content).toContain(`- **Review status:** ${sample.reviewStatus}`);
    expect(content).toContain(`- **Short answer:** ${sample.shortAnswer}`);
    expect(content).toContain(`- **Detailed answer:** ${sample.detailedAnswer}`);
    expect(content).toContain(`- **Beginner explanation:** ${sample.beginnerExplanation}`);
    expect(content).toContain(`- **Professional explanation:** ${sample.professionalExplanation}`);
    expect(content).toContain(`- **Real world example:** ${sample.realWorldExample}`);
    expect(content).toContain(`- **Required keywords:** ${sample.requiredKeywords.join(", ")}`);
  });
});
