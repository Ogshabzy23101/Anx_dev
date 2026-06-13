import { describe, expect, it } from "vitest";
import {
  helmCommandQuiz,
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
    expect(helmFlashcards.length).toBeGreaterThanOrEqual(15);
    expect(helmMultipleChoice.length).toBeGreaterThanOrEqual(25);
    expect(helmCommandQuiz.length).toBeGreaterThanOrEqual(25);
    expect(helmPractice).toHaveLength(15);
  });

  it("covers the requested reference topics", () => {
    const text = helmReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.command} ${item.description}`)
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
});
