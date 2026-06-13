import { describe, expect, it } from "vitest";
import {
  isCommandCorrect,
  isMultipleChoiceCorrect,
  validatePracticeAnswer,
} from "./answerValidation";

describe("multiple-choice answer checking", () => {
  const question = { answer: 2 };

  it("accepts the configured answer index", () => {
    expect(isMultipleChoiceCorrect(question, 2)).toBe(true);
  });

  it("rejects a different answer index", () => {
    expect(isMultipleChoiceCorrect(question, 1)).toBe(false);
  });
});

describe("command-writing answer checking", () => {
  const acceptedAnswers = ["mkdir -p releases", "mkdir --parents releases"];

  it("accepts a correct command with harmless surrounding whitespace", () => {
    expect(isCommandCorrect("  mkdir   -p   releases  ", acceptedAnswers)).toBe(true);
  });

  it("rejects a command that does not match an accepted form", () => {
    expect(isCommandCorrect("mkdir releases", acceptedAnswers)).toBe(false);
  });

  it("accepts documented alternative commands", () => {
    expect(isCommandCorrect("mkdir --parents releases", acceptedAnswers)).toBe(true);
  });
});

describe("file practice validation", () => {
  const rules = [
    { label: "if", pattern: /\bif\b/ },
    { label: "-f app.log", pattern: /-f\s+app\.log/ },
    { label: "then", pattern: /\bthen\b/ },
    { label: "fi", pattern: /\bfi\b/ },
  ];

  it("checks required script parts instead of exact text", () => {
    const answer = "if [ -f app.log ]; then\n  echo found\nfi";
    expect(validatePracticeAnswer(answer, rules)).toEqual({
      isCorrect: true,
      missing: [],
    });
  });

  it("reports missing requirements", () => {
    expect(validatePracticeAnswer("if [ -f app.log ]", rules)).toEqual({
      isCorrect: false,
      missing: ["then", "fi"],
    });
  });
});
