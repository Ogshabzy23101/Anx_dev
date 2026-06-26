import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Docker module", () => {
  it("is available from navigation and persists flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Docker" }));
    expect(await screen.findByRole("heading", { name: "Docker workflows" })).toBeInTheDocument();

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
      await screen.findByRole("heading", { name: "Kubernetes operations" }),
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

describe("Helm module", () => {
  it("is available and persists independent flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Helm" }));
    expect(await screen.findByRole("heading", { name: "Helm charts" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.helmMasteredFlashcards).toEqual(["helm-fc-chart"]);
      expect(progress.kubernetesMasteredFlashcards).toEqual([]);
      expect(progress.dockerMasteredFlashcards).toEqual([]);
    });
  });
});

describe("Terraform module", () => {
  it("is available and persists independent flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Terraform" }));
    expect(
      await screen.findByRole("heading", { name: "Terraform workflows" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.terraformMasteredFlashcards).toEqual(["tf-fc-iac"]);
      expect(progress.helmMasteredFlashcards).toEqual([]);
      expect(progress.kubernetesMasteredFlashcards).toEqual([]);
    });
  });
});

describe("Ansible module", () => {
  it("is available and persists independent flashcard progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Ansible" }));
    expect(
      await screen.findByRole("heading", { name: "Ansible automation" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.ansibleMasteredFlashcards).toEqual(["ansible-fc-ansible"]);
      expect(progress.terraformMasteredFlashcards).toEqual([]);
      expect(progress.helmMasteredFlashcards).toEqual([]);
    });
  });
});
