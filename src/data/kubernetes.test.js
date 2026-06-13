import { describe, expect, it } from "vitest";
import {
  kubernetesCommandQuiz,
  kubernetesFlashcards,
  kubernetesManifestPractice,
  kubernetesMultipleChoice,
  kubernetesReference,
} from "./kubernetes";
import {
  isCommandCorrect,
  validatePracticeAnswer,
} from "../utils/answerValidation";

describe("Kubernetes learning data", () => {
  it("contains the required content volume", () => {
    expect(kubernetesFlashcards).toHaveLength(15);
    expect(kubernetesMultipleChoice.length).toBeGreaterThanOrEqual(25);
    expect(kubernetesCommandQuiz.length).toBeGreaterThanOrEqual(25);
    expect(kubernetesManifestPractice).toHaveLength(15);
  });

  it("covers the required reference topics", () => {
    const text = kubernetesReference
      .flatMap((section) => section.commands)
      .map((item) => `${item.command} ${item.description}`)
      .join(" ")
      .toLowerCase();

    [
      "cluster", "node", "pod", "replicaset", "deployment", "service",
      "clusterip", "nodeport", "loadbalancer", "ingress", "namespace",
      "configmap", "secret", "volume", "persistentvolume",
      "persistentvolumeclaim", "serviceaccount", "role", "rolebinding",
      "statefulset", "daemonset", "job", "cronjob", "hpa", "labels",
      "selectors", "kubectl apply", "kubectl get", "kubectl describe",
      "kubectl logs", "kubectl exec",
    ].forEach((topic) => expect(text).toContain(topic));
  });

  it("accepts primary and alternative kubectl answers", () => {
    kubernetesCommandQuiz.forEach((question) => {
      expect(isCommandCorrect(question.answers[0], question.answers)).toBe(true);
      if (question.answers.length > 1) {
        expect(isCommandCorrect(question.answers[1], question.answers)).toBe(true);
      }
    });
  });

  it("accepts every Kubernetes reference manifest", () => {
    kubernetesManifestPractice.forEach((task) => {
      expect(validatePracticeAnswer(task.solution, task.rules)).toEqual({
        isCorrect: true,
        missing: [],
      });
    });
  });

  it("detects missing Deployment requirements", () => {
    const task = kubernetesManifestPractice.find(
      (item) => item.id === "k8s-yaml-deployment",
    );
    const validation = validatePracticeAnswer(
      "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n",
      task.rules,
    );

    expect(validation.isCorrect).toBe(false);
    expect(validation.missing).toEqual(
      expect.arrayContaining([
        "spec.replicas: 3",
        "selector:",
        "matchLabels:",
        "template:",
        "containers:",
        "container image: nginx",
      ]),
    );
  });
});
