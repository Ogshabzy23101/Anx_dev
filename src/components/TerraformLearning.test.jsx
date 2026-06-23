import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  terraformCategories,
  terraformCommandCatalog,
  terraformFlashcards,
} from "../data/terraform";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Terraform reference library", () => {
  it("renders expandable Terraform entries and searches explanation text", () => {
    const { container } = render(
      <LinuxReference
        commands={terraformCommandCatalog}
        categories={terraformCategories}
        searchLabel="search Terraform topics and explanations"
      />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(124);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "search Terraform topics and explanations" }),
      { target: { value: "state writes" } },
    );

    expect(screen.getAllByText("DynamoDB locking").length).toBeGreaterThan(0);
    expect(screen.queryByText("terraform fmt")).not.toBeInTheDocument();
  });

  it("filters Terraform entries by category and difficulty", () => {
    const { container } = render(
      <LinuxReference commands={terraformCommandCatalog} categories={terraformCategories} />,
    );

    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "Backends" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "intermediate" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getAllByText("backend reconfigure").length).toBeGreaterThan(0);
    expect(screen.queryByText("backend block")).not.toBeInTheDocument();
  });
});

describe("Terraform flashcards", () => {
  it("reveals structured Terraform learning details", () => {
    render(
      <LinuxFlashcards
        cards={[terraformFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
        categories={terraformCategories}
        flipLabel="Flip Terraform flashcard"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Terraform flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Terraform mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Terraform" }));
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
