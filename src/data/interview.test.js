import { describe, expect, it } from "vitest";
import {
  interviewCategories,
  interviewFlashcards,
  interviewMultipleChoice,
  interviewQuestions,
} from "./interview";
import { isMultipleChoiceCorrect } from "../utils/answerValidation";
import { scoreMockInterview, validateWrittenAnswer } from "../utils/interviewValidation";

describe("Interview data", () => {
  it("contains the MVP category coverage and structured answers", () => {
    expect(interviewCategories).toHaveLength(11);
    expect(interviewQuestions).toHaveLength(101);
    expect(interviewFlashcards).toHaveLength(101);
    expect(interviewMultipleChoice).toHaveLength(101);

    interviewCategories.forEach((category) => {
      expect(interviewQuestions.filter((item) => item.category === category).length).toBeGreaterThanOrEqual(5);
    });

    interviewQuestions.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        id: expect.any(String),
        category: expect.any(String),
        difficulty: expect.any(String),
        question: expect.any(String),
        shortAnswer: expect.any(String),
        detailedAnswer: expect.any(String),
        example: expect.any(String),
        commonMistake: expect.any(String),
        interviewTip: expect.any(String),
        requiredKeywords: expect.any(Array),
        relatedModule: expect.any(String),
      }));
    });
  });

  it("validates interview MCQ answers", () => {
    expect(isMultipleChoiceCorrect(interviewMultipleChoice[0], 0)).toBe(true);
    expect(isMultipleChoiceCorrect(interviewMultipleChoice[0], 1)).toBe(false);
  });

  it("validates written answer keywords and missing concepts", () => {
    const question = interviewQuestions.find((item) => item.id === "interview-docker-1");
    const validation = validateWrittenAnswer("An image becomes a running container at runtime.", question.requiredKeywords);

    expect(validation.passed).toEqual(expect.arrayContaining(["image", "container", "runtime"]));
    expect(validation.isCorrect).toBe(true);

    const partial = validateWrittenAnswer("It is a packaged image.", question.requiredKeywords);
    expect(partial.missing).toEqual(expect.arrayContaining(["container", "runtime"]));
  });

  it("scores mock interviews and identifies weak categories", () => {
    const questions = [
      interviewQuestions.find((item) => item.category === "Linux"),
      interviewQuestions.find((item) => item.category === "Terraform"),
    ];
    const result = scoreMockInterview({
      [questions[0].id]: questions[0].requiredKeywords.join(" "),
      [questions[1].id]: "state",
    }, questions);

    expect(result.score).toBeLessThan(100);
    expect(result.strongAreas).toContain("Linux");
    expect(result.weakAreas).toContain("Terraform");
    expect(result.suggestedModules).toContain("Terraform");
  });
});
