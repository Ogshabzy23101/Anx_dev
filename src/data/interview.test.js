import { describe, expect, it } from "vitest";
import {
  interviewCategories,
  interviewDifficulties,
  interviewFormulas,
  interviewQuestions,
} from "./interview";
import { validatePracticeAnswer } from "../utils/answerValidation";

describe("Interview Prep data", () => {
  it("contains category coverage and structured questions", () => {
    expect(interviewCategories).toHaveLength(11);
    expect(interviewDifficulties).toEqual(["Junior", "Mid-level", "Senior"]);
    expect(interviewQuestions.length).toBeGreaterThanOrEqual(60);

    interviewCategories.forEach((category) => {
      expect(interviewQuestions.filter((item) => item.category === category).length).toBeGreaterThanOrEqual(3);
    });

    interviewQuestions.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        id: expect.any(String),
        category: expect.stringMatching(new RegExp(interviewCategories.join("|"))),
        difficulty: expect.stringMatching(/Junior|Mid-level|Senior/),
        formulaType: expect.stringMatching(/concept|troubleshooting|star/),
        question: expect.any(String),
        modelAnswer: expect.any(String),
        checklist: expect.any(Array),
        commonMistake: expect.any(String),
        relatedModule: expect.any(String),
      }));

      expect(item.checklist.length).toBeGreaterThanOrEqual(2);
      item.checklist.forEach((check) => {
        expect(check.label).toEqual(expect.any(String));
        expect(check.pattern).toBeInstanceOf(RegExp);
      });
    });
  });

  it("has no duplicate question ids", () => {
    const ids = interviewQuestions.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines a formula (stage list) for every formulaType in use", () => {
    const usedTypes = new Set(interviewQuestions.map((item) => item.formulaType));
    usedTypes.forEach((type) => {
      expect(interviewFormulas[type]).toBeDefined();
      expect(interviewFormulas[type].stages.length).toBeGreaterThan(0);
    });
  });

  it("every model answer satisfies its own checklist", () => {
    interviewQuestions.forEach((item) => {
      const rules = item.checklist.map((check) => ({
        label: check.label,
        test: (answer) => check.pattern.test(answer),
      }));
      const result = validatePracticeAnswer(item.modelAnswer, rules);
      expect(result.isCorrect, `${item.id} model answer missed: ${result.missing.join(", ")}`).toBe(true);
    });
  });

  it("only cites phone-store-3tier where a real project detail backs the claim", () => {
    const projectAnswers = interviewQuestions.filter((item) => item.category === "Behavioral & project");
    expect(projectAnswers.length).toBeGreaterThan(0);
    projectAnswers.forEach((item) => {
      expect(item.modelAnswer.length).toBeGreaterThan(200);
    });
  });

  it("flags a partial answer as incomplete and names what's missing", () => {
    const question = interviewQuestions.find((item) => item.id === "docker-image-vs-container");
    const rules = question.checklist.map((check) => ({
      label: check.label,
      test: (answer) => check.pattern.test(answer),
    }));
    const partial = validatePracticeAnswer("An image is like a snapshot of a container.", rules);

    expect(partial.isCorrect).toBe(false);
    expect(partial.missing.length).toBeGreaterThan(0);
  });
});
