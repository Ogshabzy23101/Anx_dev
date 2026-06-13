import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FilePractice from "./FilePractice";
import { helmPractice } from "../data/helm";

describe("Helm chart correction flow", () => {
  it("shows missing requirements, explanation, comparison, and recovery actions", () => {
    const deployment = helmPractice.find((task) => task.id === "helm-deployment");
    render(
      <FilePractice
        tasks={[deployment]}
        completedIds={[]}
        onComplete={() => {}}
        editorLabel="Helm chart answer"
        resultNoun="Chart file"
        submitLabel="Validate chart"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Validate chart" }));

    expect(screen.getByText("The chart file needs another pass.")).toBeInTheDocument();
    expect(screen.getByText(/Missing:/)).toHaveTextContent(".Values.replicaCount");
    expect(screen.getByText(deployment.explanation)).toBeInTheDocument();
    expect(screen.getByText("your answer")).toBeInTheDocument();
    expect(screen.getByText("expected answer")).toBeInTheDocument();
    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Show solution in editor" })).toBeInTheDocument();
  });
});
