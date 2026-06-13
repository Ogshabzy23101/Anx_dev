import { describe, expect, it } from "vitest";
import { calculateModuleProgress } from "./progress";

describe("module completion calculation", () => {
  it("averages flashcards, MCQ score, commands, and manifests", () => {
    expect(calculateModuleProgress({
      masteredCount: 15,
      flashcardTotal: 15,
      quizScore: 80,
      completedCommandCount: 20,
      commandTotal: 25,
      completedPracticeCount: 9,
      practiceTotal: 15,
    })).toBeCloseTo(80);
  });

  it("returns 100 for a fully completed module", () => {
    expect(calculateModuleProgress({
      masteredCount: 15,
      flashcardTotal: 15,
      quizScore: 100,
      completedCommandCount: 25,
      commandTotal: 25,
      completedPracticeCount: 15,
      practiceTotal: 15,
    })).toBe(100);
  });

  it("calculates Helm completion from independent chart progress", () => {
    expect(calculateModuleProgress({
      masteredCount: 6,
      flashcardTotal: 15,
      quizScore: 60,
      completedCommandCount: 20,
      commandTotal: 25,
      completedPracticeCount: 12,
      practiceTotal: 15,
    })).toBe(65);
  });
});
