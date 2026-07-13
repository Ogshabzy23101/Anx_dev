import { describe, expect, it } from "vitest";
import {
  kubernetesCommandQuiz,
  kubernetesCommandCatalog,
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
    expect(kubernetesCommandCatalog).toHaveLength(126);
    expect(kubernetesFlashcards).toHaveLength(126);
    expect(kubernetesMultipleChoice).toHaveLength(126);
    expect(kubernetesCommandQuiz).toHaveLength(126);
    expect(kubernetesManifestPractice).toHaveLength(35);

    kubernetesCommandCatalog.forEach((item) => {
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

    kubernetesFlashcards.forEach((card) => {
      expect(card).toEqual(expect.objectContaining({
        basicExplanation: expect.any(String),
        professionalExplanation: expect.any(String),
        example: expect.any(String),
        useCase: expect.any(String),
        relatedConcepts: expect.any(Array),
      }));
    });
  });

  it("covers the required reference topics", () => {
    const text = kubernetesReference
      .flatMap((section) => section.commands)
      .map((item) => [
        item.category,
        item.command,
        item.description,
        item.professionalExplanation,
        ...item.examples,
      ].join(" "))
      .join(" ")
      .toLowerCase();

    [
      "cluster", "node", "pod", "replicaset", "deployment", "service",
      "clusterip", "nodeport", "loadbalancer", "ingress", "namespace",
      "configmap", "secret", "volume", "persistentvolume",
      "persistentvolumeclaim", "serviceaccount", "role", "rolebinding",
      "statefulset", "daemonset", "job", "cronjob", "hpa", "labels",
      "selector", "kubectl apply", "kubectl get", "kubectl describe",
      "kubectl logs", "kubectl exec",
    ].forEach((topic) => expect(text).toContain(topic));
  });

  it("only cites phone-store-3tier where a real file or workflow backs the claim", () => {
    const tieIns = kubernetesCommandCatalog
      .map((item) => item.realWorldExample)
      .filter(Boolean);

    expect(tieIns.length).toBeGreaterThan(0);
    tieIns.forEach((example) => {
      expect(example.toLowerCase()).toContain("phone-store");
    });
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

  it("detects missing RBAC binding requirements", () => {
    const task = kubernetesManifestPractice.find(
      (item) => item.id === "k8s-yaml-clusterrolebinding",
    );
    const validation = validatePracticeAnswer(
      "apiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n  name: node-readers\n",
      task.rules,
    );

    expect(validation.missing).toEqual(expect.arrayContaining([
      "subjects:",
      "Group subject",
      "subject name: platform",
      "roleRef:",
      "ClusterRole reference",
    ]));
  });

  it("validates Service and Ingress semantics independently", () => {
    const service = kubernetesManifestPractice.find(
      (item) => item.id === "k8s-yaml-loadbalancer",
    );
    const ingress = kubernetesManifestPractice.find(
      (item) => item.id === "k8s-yaml-ingress",
    );

    expect(validatePracticeAnswer(service.solution, service.rules).isCorrect).toBe(true);
    expect(validatePracticeAnswer(
      ingress.solution.replace("path: /api", "path: /wrong"),
      ingress.rules,
    ).missing).toContain("ingress path: /api");
  });
});
