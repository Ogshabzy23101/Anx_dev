import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  helmCategories,
  helmCommandCatalog,
  helmFlashcards,
} from "../data/helm";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Helm reference library", () => {
  it("renders expandable Helm entries and searches explanation text", () => {
    const { container } = render(
      <LinuxReference
        commands={helmCommandCatalog}
        categories={helmCategories}
        searchLabel="search Helm topics and explanations"
      />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(104);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "search Helm topics and explanations" }),
      { target: { value: "subcharts" } },
    );

    expect(screen.getAllByText("dependencies").length).toBeGreaterThan(0);
    expect(screen.queryByText("helm rollback")).not.toBeInTheDocument();
  });

  it("filters Helm entries by category and difficulty", () => {
    const { container } = render(
      <LinuxReference commands={helmCommandCatalog} categories={helmCategories} />,
    );

    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "template functions" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "beginner" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getAllByText("default function").length).toBeGreaterThan(0);
    expect(screen.queryByText("toYaml function")).not.toBeInTheDocument();
  });
});

describe("Helm flashcards", () => {
  it("reveals structured Helm learning details", () => {
    render(
      <LinuxFlashcards
        cards={[helmFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
        categories={helmCategories}
        flipLabel="Flip Helm flashcard"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Helm flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Helm mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Helm" }));
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
