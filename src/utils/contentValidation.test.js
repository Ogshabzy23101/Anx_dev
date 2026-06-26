import { describe, expect, it } from "vitest";
import { learningModules } from "../data/learningModuleRegistry";
import { interviewQuestions } from "../data/interview";
import {
  validateInterviewQuestions,
  validateLearningModule,
  validateLearningModules,
} from "./contentValidation";

describe("content validation", () => {
  it("validates every registered learning module", () => {
    const result = validateLearningModules(learningModules);

    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("detects missing module collections and required fields", () => {
    const result = validateLearningModule({
      id: "broken",
      reference: { notes: [{}], commands: [] },
      flashcards: [],
      multipleChoice: [],
      commandQuiz: [],
      practice: { tasks: [] },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("broken missing reference.commands");
    expect(result.errors).toContain("broken.notes[0] missing id");
  });

  it("validates Interview Mode question shape", () => {
    const result = validateInterviewQuestions(interviewQuestions);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
