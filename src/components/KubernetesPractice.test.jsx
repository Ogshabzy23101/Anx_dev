import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FilePractice from "./FilePractice";
import { kubernetesManifestPractice } from "../data/kubernetes";

describe("Kubernetes manifest correction flow", () => {
  it("shows missing requirements, explanation, comparison, and recovery actions", () => {
    const deployment = kubernetesManifestPractice.find(
      (task) => task.id === "k8s-yaml-deployment",
    );
    render(
      <FilePractice
        tasks={[deployment]}
        completedIds={[]}
        onComplete={() => {}}
        editorLabel="Kubernetes YAML answer"
        resultNoun="Manifest"
        submitLabel="Validate manifest"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Validate manifest" }));

    expect(screen.getByText("The manifest needs another pass.")).toBeInTheDocument();
    expect(screen.getByText(/Missing:/)).toHaveTextContent("spec.replicas: 3");
    expect(screen.getByText(deployment.explanation)).toBeInTheDocument();
    expect(screen.getByText("your answer")).toBeInTheDocument();
    expect(screen.getByText("expected answer")).toBeInTheDocument();
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Show solution in editor" })).toBeInTheDocument();
  });
});
