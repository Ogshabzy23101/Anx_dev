import { describe, expect, it } from "vitest";
import {
  linuxCategories,
  linuxCommandCatalog,
  linuxCommandQuiz,
  linuxFlashcards,
  linuxMultipleChoice,
} from "./linux";
import { linuxShellPractice } from "./linuxPractice";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("enriched Linux learning data", () => {
  it("contains the requested content volume and categories", () => {
    expect(linuxCommandCatalog.length).toBeGreaterThanOrEqual(100);
    expect(linuxFlashcards.length).toBeGreaterThanOrEqual(100);
    expect(linuxMultipleChoice.length).toBeGreaterThanOrEqual(75);
    expect(linuxCommandQuiz.length).toBeGreaterThanOrEqual(75);
    expect(linuxShellPractice.length).toBeGreaterThanOrEqual(25);
    expect(linuxCategories).toHaveLength(18);
  });

  it("provides complete reference and flashcard learning fields", () => {
    linuxCommandCatalog.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        command: expect.any(String),
        fullMeaning: expect.any(String),
        basicExplanation: expect.any(String),
        professionalExplanation: expect.any(String),
        commonSyntax: expect.any(String),
        commonFlags: expect.any(Array),
        keyTerms: expect.any(Array),
        examples: expect.any(Array),
        devOpsUseCase: expect.any(String),
        commonMistake: expect.any(String),
        gotchas: expect.any(Array),
        relatedCommands: expect.any(Array),
        answers: expect.any(Array),
        entryKind: expect.stringMatching(/command|concept/),
        difficulty: expect.stringMatching(/beginner|intermediate|advanced/),
      }));

      // Every entry follows the style guide's required shape: command entries
      // carry a flags table, concept entries carry key terms plus gotchas.
      if (item.entryKind === "command") {
        expect(item.commonFlags.length).toBeGreaterThan(0);
      } else {
        expect(item.keyTerms.length).toBeGreaterThan(0);
        expect(item.gotchas.length).toBeGreaterThan(0);
      }
      expect(item.examples.length).toBeGreaterThanOrEqual(1);
      expect(item.examples.length).toBeLessThanOrEqual(4);
    });

    linuxFlashcards.forEach((card) => {
      expect(card).toEqual(expect.objectContaining({
        basicExplanation: expect.any(String),
        professionalExplanation: expect.any(String),
        example: expect.any(String),
        useCase: expect.any(String),
        relatedConcepts: expect.any(Array),
      }));
    });
  });

  it("only cites phone-store-3tier where a real file or workflow backs the claim", () => {
    const tieIns = linuxCommandCatalog
      .map((item) => item.realWorldExample)
      .filter(Boolean);

    expect(tieIns.length).toBeGreaterThan(0);
    tieIns.forEach((example) => {
      expect(example.toLowerCase()).toContain("phone-store");
    });
  });

  it("accepts every primary command challenge answer", () => {
    linuxCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
    });
  });

  it("validates every script solution and reports missing requirements", () => {
    linuxShellPractice.forEach((practice) => {
      expect(validatePracticeAnswer(practice.solution, practice.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });

    const healthCheck = linuxShellPractice.find((item) => item.id === "shell-health-check");
    expect(validatePracticeAnswer("#!/bin/bash\ncurl example.com", healthCheck.rules).missing)
      .toEqual(expect.arrayContaining(["failure-on-error flag", "the health endpoint"]));
  });
});
