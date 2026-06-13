import { describe, expect, it } from "vitest";
import { validatePracticeAnswer } from "./answerValidation";
import {
  expectedYamlValue,
  kubernetesRules,
  requiredYamlKey,
} from "./kubernetesValidation";

describe("Kubernetes YAML validation helpers", () => {
  it("checks keys and common semantic values without exact document matching", () => {
    const rules = [
      kubernetesRules.apiVersion("apps/v1"),
      kubernetesRules.kind("Deployment"),
      kubernetesRules.metadataName("web"),
      requiredYamlKey("spec"),
      kubernetesRules.replicas(3),
      kubernetesRules.image("nginx"),
    ];
    const answer = [
      "apiVersion: apps/v1",
      "kind: Deployment",
      "metadata:",
      "  labels:",
      "    team: platform",
      "  name: web",
      "spec:",
      "  replicas: 3",
      "  template:",
      "    spec:",
      "      containers:",
      "        - image: nginx",
    ].join("\n");

    expect(validatePracticeAnswer(answer, rules)).toEqual({
      isCorrect: true,
      missing: [],
    });
  });

  it("does not confuse a container name with metadata.name", () => {
    const rules = [kubernetesRules.metadataName("web")];
    expect(validatePracticeAnswer(
      "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api\nspec:\n  containers:\n    - name: web\n      image: nginx",
      rules,
    ).missing).toEqual(["metadata.name: web"]);
  });

  it("checks service ports, ingress paths, and expected values", () => {
    const rules = [
      kubernetesRules.servicePort(80),
      kubernetesRules.targetPort(8080),
      kubernetesRules.ingressPath("/api"),
      expectedYamlValue("type", "ClusterIP"),
    ];
    const validation = validatePracticeAnswer(
      "type: ClusterIP\nport: 80\ntargetPort: 8080\npath: /wrong",
      rules,
    );

    expect(validation.missing).toEqual(["ingress path: /api"]);
  });

  it("checks RBAC verbs in inline lists", () => {
    const rules = ["get", "list", "watch"].map(kubernetesRules.rbacVerb);
    expect(
      validatePracticeAnswer('verbs: ["get", "list", "watch"]', rules).isCorrect,
    ).toBe(true);
    expect(
      validatePracticeAnswer('verbs: ["get"]', rules).missing,
    ).toEqual(["RBAC verb: list", "RBAC verb: watch"]);
  });
});
