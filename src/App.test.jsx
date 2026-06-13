import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Docker module", () => {
  it("is available from navigation and persists flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Docker" }));
    expect(screen.getByRole("heading", { name: "Docker workflows" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Flashcards/ }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.dockerMasteredFlashcards).toEqual(["docker-fc-image"]);
    });
  });
});

describe("Kubernetes module", () => {
  it("is available and persists independent flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Kubernetes" }));
    expect(
      screen.getByRole("heading", { name: "Kubernetes operations" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.kubernetesMasteredFlashcards).toEqual(["k8s-fc-pod"]);
      expect(progress.dockerMasteredFlashcards).toEqual([]);
      expect(progress.masteredFlashcards).toEqual([]);
    });
  });
});
