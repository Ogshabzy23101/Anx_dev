import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import { linuxCommandCatalog, linuxFlashcards } from "../data/linux";
import LinuxFlashcards from "./LinuxFlashcards";
import LinuxReference from "./LinuxReference";

describe("Linux reference library", () => {
  it("renders expandable commands and filters explanation text", () => {
    const { container } = render(<LinuxReference commands={linuxCommandCatalog} />);
    expect(container.querySelectorAll("details")).toHaveLength(108);
    expect(screen.getAllByText("pwd").length).toBeGreaterThan(0);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "search commands and explanations" }),
      { target: { value: "certificates" } },
    );

    expect(screen.getByText("openssl")).toBeInTheDocument();
    expect(screen.queryByText("pwd")).not.toBeInTheDocument();
  });

  it("filters commands by category and difficulty", () => {
    const { container } = render(<LinuxReference commands={linuxCommandCatalog} />);
    fireEvent.change(screen.getByLabelText("category"), {
      target: { value: "Networking" },
    });
    fireEvent.change(screen.getByLabelText("difficulty"), {
      target: { value: "beginner" },
    });

    expect(container.querySelectorAll("details")).toHaveLength(3);
    expect(screen.getByText("curl")).toBeInTheDocument();
    expect(screen.queryByText("dig")).not.toBeInTheDocument();
  });
});

describe("Linux flashcards", () => {
  it("reveals the structured beginner and professional explanation", () => {
    render(
      <LinuxFlashcards
        cards={[linuxFlashcards[0]]}
        mastered={[]}
        onToggleMastered={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Flip Linux flashcard" }));
    expect(screen.getByText("Basic explanation")).toBeInTheDocument();
    expect(screen.getByText("Professional explanation")).toBeInTheDocument();
    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("DevOps use case")).toBeInTheDocument();
    expect(screen.getByText("Related concepts")).toBeInTheDocument();
  });

  it("persists Linux mastery independently", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const progress = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(progress.masteredFlashcards).toEqual(["fc-pwd"]);
      expect(progress.dockerMasteredFlashcards).toEqual([]);
    });
  });
});
