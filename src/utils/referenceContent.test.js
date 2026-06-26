import { describe, expect, it } from "vitest";
import { kubernetesCommandCatalog } from "../data/kubernetes";
import { splitReferenceContent } from "./referenceContent";

describe("reference content splitting", () => {
  it("classifies Kubernetes concepts as lecture notes", () => {
    const { notes } = splitReferenceContent(kubernetesCommandCatalog, "Kubernetes");

    expect(notes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          module: "Kubernetes",
          title: "Kubernetes API",
          summary: expect.any(String),
          beginnerExplanation: expect.any(String),
          professionalExplanation: expect.any(String),
          relatedTopics: expect.any(Array),
        }),
      ]),
    );
  });

  it("classifies kubectl examples as command references", () => {
    const { commands } = splitReferenceContent(kubernetesCommandCatalog, "Kubernetes");

    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          module: "Kubernetes",
          command: "kubectl get pods",
          syntax: "kubectl get pods",
          explanation: expect.any(String),
          examples: expect.any(Array),
          relatedCommands: expect.any(Array),
        }),
      ]),
    );
  });
});
