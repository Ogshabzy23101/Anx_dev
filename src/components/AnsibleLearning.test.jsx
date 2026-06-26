import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  ansibleCategories,
  ansibleCommandCatalog,
  ansibleFlashcards,
} from "../data/ansible";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Ansible reference library", () => {
  it("renders expandable Ansible entries and searches explanation text", () => {
    const { container } = render(
      <LinuxReference
        commands={ansibleCommandCatalog}
        categories={ansibleCategories}
        searchLabel="search Ansible topics and explanations"
        itemNoun="Ansible topics"
      />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(124);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "search Ansible topics and explanations" }),
      { target: { value: "sensitive Ansible data" } },
    );

    expect(screen.getAllByText("vault create").length).toBeGreaterThan(0);
    expect(screen.queryByText("ansible.cfg")).not.toBeInTheDocument();
  });

  it("filters Ansible entries by category and difficulty", () => {
    const { container } = render(
      <LinuxReference commands={ansibleCommandCatalog} categories={ansibleCategories} />,
    );

    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "Vault" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "beginner" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(3);
    expect(screen.getAllByText("vault create").length).toBeGreaterThan(0);
    expect(screen.queryByText("vault id")).not.toBeInTheDocument();
  });
});

describe("Ansible flashcards", () => {
  it("reveals structured Ansible learning details", () => {
    render(
      <LinuxFlashcards
        cards={[ansibleFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
        categories={ansibleCategories}
        flipLabel="Flip Ansible flashcard"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Ansible flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Ansible mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Ansible" }));
    fireEvent.click(await screen.findByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.ansibleMasteredFlashcards).toEqual(["ansible-fc-ansible"]);
      expect(progress.terraformMasteredFlashcards).toEqual([]);
      expect(progress.helmMasteredFlashcards).toEqual([]);
    });
  });
});
