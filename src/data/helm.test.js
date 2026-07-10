import { describe, expect, it } from "vitest";
import {
  helmCommandQuiz,
  helmCommandCatalog,
  helmFlashcards,
  helmMultipleChoice,
  helmPractice,
  helmReference,
} from "./helm";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Helm learning data", () => {
  it("contains the required content volume", () => {
    expect(helmCommandCatalog).toHaveLength(104);
    expect(helmFlashcards).toHaveLength(104);
    expect(helmMultipleChoice).toHaveLength(104);
    expect(helmCommandQuiz).toHaveLength(104);
    expect(helmPractice).toHaveLength(30);

    helmCommandCatalog.forEach((item) => {
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
  });

  it("covers the requested reference topics", () => {
    const text = helmReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.category} ${item.command} ${item.description} ${item.professionalExplanation} ${item.examples.join(" ")}`)
      .join(" ")
      .toLowerCase();

    [
      "helm", "chart", "release", "repository", "values.yaml", "chart.yaml",
      "templates/", "_helpers.tpl", "template functions", "named template",
      "helm install", "helm upgrade", "helm rollback", "helm uninstall",
      "helm repo add", "helm repo update", "helm list", "helm status",
      "helm get values", "helm template", "helm lint", "helm dependency",
      "appversion", "version", "--set", "-f", "kubernetes",
    ].forEach((topic) => expect(text).toContain(topic));
  });

  it("only cites phone-store-3tier where a real file or workflow backs the claim", () => {
    const tieIns = helmCommandCatalog
      .map((item) => item.realWorldExample)
      .filter(Boolean);

    expect(tieIns.length).toBeGreaterThan(0);
    tieIns.forEach((example) => {
      expect(example.toLowerCase()).toContain("phone-store");
    });
  });

  it("accepts primary and alternative Helm commands", () => {
    helmCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
      if (question.answers.length > 1) {
        expect(isCommandCorrect(question.answers[1], question.answers)).toBe(true);
      }
    });
  });

  it("accepts every Helm chart reference solution", () => {
    helmPractice.forEach((task) => {
      expect(validatePracticeAnswer(task.solution, task.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });
  });

  it("detects missing Deployment template requirements", () => {
    const task = helmPractice.find((item) => item.id === "helm-deployment");
    const validation = validatePracticeAnswer(
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n",
      task.rules,
    );

    expect(validation.isCorrect).toBe(false);
    expect(validation.missing).toEqual(expect.arrayContaining([
      "spec:",
      ".Values.replicaCount",
      "selector:",
      "template:",
      "containers:",
      ".Values.image.repository",
      ".Values.image.tag",
    ]));
  });

  it("validates .Values, include, if, and range chart exercises", () => {
    [
      "helm-existing-deployment",
      "helm-include",
      "helm-if",
      "helm-range",
    ].forEach((id) => {
      const task = helmPractice.find((item) => item.id === id);
      expect(validatePracticeAnswer(task.solution, task.rules).isCorrect).toBe(true);
    });
  });

  it("detects missing template function requirements", () => {
    const task = helmPractice.find((item) => item.id === "helm-default-function");
    const validation = validatePracticeAnswer(
      'image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"',
      task.rules,
    );

    expect(validation.missing).toEqual(expect.arrayContaining([
      "default function",
      ".Chart.AppVersion",
    ]));
  });
});
