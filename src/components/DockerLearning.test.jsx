import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  dockerCategories,
  dockerCommandCatalog,
  dockerFlashcards,
} from "../data/docker";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Docker reference library", () => {
  it("renders expandable Docker entries and searches explanation text", () => {
    const { container } = render(
      <LinuxReference
        commands={dockerCommandCatalog}
        categories={dockerCategories}
        searchLabel="search Docker topics and explanations"
        itemNoun="Docker topics"
      />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(80);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "search Docker topics and explanations" }),
      { target: { value: "cryptographic hash" } },
    );

    expect(screen.getByText("image digest")).toBeInTheDocument();
    expect(screen.queryByText("docker version")).not.toBeInTheDocument();
  });

  it("filters Docker entries by category and difficulty", () => {
    const { container } = render(
      <LinuxReference commands={dockerCommandCatalog} categories={dockerCategories} />,
    );

    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "Security basics" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "intermediate" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getByText("docker run --read-only")).toBeInTheDocument();
    expect(screen.queryByText("USER")).not.toBeInTheDocument();
  });
});

describe("Docker flashcards", () => {
  it("reveals structured Docker learning details", () => {
    render(
      <LinuxFlashcards
        cards={[dockerFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
        categories={dockerCategories}
        flipLabel="Flip Docker flashcard"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Docker flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Docker mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Docker" }));
    fireEvent.click(await screen.findByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.dockerMasteredFlashcards).toEqual(["docker-fc-image"]);
      expect(progress.masteredFlashcards).toEqual([]);
    });
  });
});
