import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  kubernetesCategories,
  kubernetesCommandCatalog,
  kubernetesFlashcards,
} from "../data/kubernetes";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Kubernetes reference library", () => {
  it("renders Kubernetes Notes and Commands as separate module tabs", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Kubernetes" }));
    expect(await screen.findByRole("button", { name: "Notes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Commands" })).toBeInTheDocument();
    expect(screen.getAllByText("Kubernetes API").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Commands" }));
    expect(screen.getByRole("searchbox", { name: "search kubectl commands and explanations" })).toBeInTheDocument();
    expect(screen.getAllByText("kubectl get pods").length).toBeGreaterThan(0);
    expect(screen.queryByText("Kubernetes API")).not.toBeInTheDocument();
  });

  it("renders expandable entries and searches explanation text", () => {
    const { container } = render(
      <LinuxReference
        commands={kubernetesCommandCatalog}
        categories={kubernetesCategories}
        searchLabel="search Kubernetes resources and explanations"
      />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(126);
    fireEvent.change(
      screen.getByRole("searchbox", {
        name: "search Kubernetes resources and explanations",
      }),
      { target: { value: "sensitive workload values" } },
    );

    expect(screen.getAllByText("Secret").length).toBeGreaterThan(0);
    expect(screen.queryByText("Node")).not.toBeInTheDocument();
  });

  it("filters Kubernetes entries by category and difficulty", () => {
    const { container } = render(
      <LinuxReference
        commands={kubernetesCommandCatalog}
        categories={kubernetesCategories}
      />,
    );

    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "Probes" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "intermediate" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getAllByText("livenessProbe").length).toBeGreaterThan(0);
    expect(screen.queryByText("startupProbe")).not.toBeInTheDocument();
  });
});

describe("Kubernetes flashcards", () => {
  it("reveals structured Kubernetes learning details", () => {
    render(
      <LinuxFlashcards
        cards={[kubernetesFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
        categories={kubernetesCategories}
        flipLabel="Flip Kubernetes flashcard"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Kubernetes flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Kubernetes mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Kubernetes" }));
    fireEvent.click(await screen.findByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.kubernetesMasteredFlashcards).toEqual(["k8s-fc-pod"]);
      expect(progress.dockerMasteredFlashcards).toEqual([]);
      expect(progress.masteredFlashcards).toEqual([]);
    });
  });
});
