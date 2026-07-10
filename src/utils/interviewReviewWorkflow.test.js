import { describe, expect, it } from "vitest";
import { interviewQuestions } from "../data/interview";
import {
  checkInterviewAnswerQuality,
  createReviewedOverrides,
  detectDuplicateQuestionIds,
  interviewReviewStatuses,
  mergeReviewedQuestions,
  parseInterviewReviewMarkdown,
  serializeInterviewReviewMarkdown,
  validateReviewedQuestions,
} from "./interviewReviewWorkflow";

const polishedQuestion = {
  id: "sample-question",
  category: "Docker",
  difficulty: "Junior DevOps",
  question: "How do you debug a failing container?",
  shortAnswer: "Start with logs, exit code, inspect output, and the configured entrypoint.",
  detailedAnswer: "I would check docker ps -a for the exit status, read docker logs for application errors, inspect the container configuration, verify environment variables, and confirm the command stays in the foreground.",
  beginnerExplanation: "A container can stop because the main process exits, crashes, or lacks required configuration.",
  professionalExplanation: "Container debugging should verify process lifecycle, runtime configuration, filesystem permissions, environment values, and observable logs before changing the image.",
  realWorldExample: "For example, a container may exit with code 1 because DATABASE_URL is missing; docker logs and docker inspect make that visible quickly.",
  commands: ["docker ps -a", "docker logs app", "docker inspect app"],
  followUpQuestions: ["What does exit code 137 mean?", "How would you debug a missing environment variable?"],
  commonMistakes: ["Only restarting the container without reading logs."],
  interviewTip: "Explain the order of checks and say what signal each command gives you.",
  requiredKeywords: ["logs", "exit code", "inspect"],
  relatedModule: "Docker",
  reviewStatus: "reviewed",
};

describe("interview review workflow", () => {
  it("exports and parses reviewed Markdown while preserving IDs", () => {
    const markdown = serializeInterviewReviewMarkdown([polishedQuestion]);
    const parsed = parseInterviewReviewMarkdown(markdown);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      id: "sample-question",
      reviewStatus: "reviewed",
      shortAnswer: polishedQuestion.shortAnswer,
    });
    expect(parsed[0].commands).toEqual(["docker ps -a", "docker logs app", "docker inspect app"]);
  });

  it("detects duplicate IDs", () => {
    expect(detectDuplicateQuestionIds([
      polishedQuestion,
      { ...polishedQuestion, question: "Duplicate" },
    ])).toEqual(["sample-question"]);
  });

  it("detects missing required fields", () => {
    const result = validateReviewedQuestions([{ ...polishedQuestion, detailedAnswer: "", commands: [] }]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("sample-question: missing detailedAnswer");
    expect(result.errors).toContain("sample-question: missing commands");
  });

  it("flags weak generated answer patterns", () => {
    const issues = checkInterviewAnswerQuality({
      ...polishedQuestion,
      shortAnswer: "A strong answer should mention logs.",
      detailedAnswer: "Explain the concept clearly.",
      realWorldExample: "",
      commonMistakes: [],
    });

    expect(issues).toContain("shortAnswer is too short");
    expect(issues).toContain("detailedAnswer is too short");
    expect(issues).toContain("missing realWorldExample");
    expect(issues.some((issue) => issue.includes("Explain the concept clearly"))).toBe(true);
  });

  it("creates importable overrides and merges reviewed answers", () => {
    const overrides = createReviewedOverrides([polishedQuestion]);
    const merged = mergeReviewedQuestions([
      {
        ...interviewQuestions[0],
        id: "sample-question",
      },
    ], [polishedQuestion]);

    expect(overrides["sample-question"].reviewStatus).toBe("reviewed");
    expect(merged[0].professionalExplanation).toBe(polishedQuestion.professionalExplanation);
  });

  it("keeps existing interview data backward compatible with review metadata", () => {
    const sample = interviewQuestions[0];

    expect(interviewReviewStatuses).toContain(sample.reviewStatus);
    expect(sample.beginnerExplanation).toBeTruthy();
    expect(sample.professionalExplanation).toBeTruthy();
    expect(Array.isArray(sample.commands)).toBe(true);
    expect(Array.isArray(sample.commonMistakes)).toBe(true);
  });
});
