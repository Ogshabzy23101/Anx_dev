import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import PracticeLabs from "./PracticeLabs";

const progress = {
  practiceLabStartedIds: [],
  practiceLabCompletedIds: [],
  practiceLabFailures: {},
};

function renderPracticeLabs(overrides = {}) {
  return render(
    <PracticeLabs
      progress={{ ...progress, ...overrides.progress }}
      setProgress={overrides.setProgress || vi.fn()}
    />,
  );
}

describe("Practice Labs", () => {
  it("renders Linux Practice Labs and repository metadata", () => {
    renderPracticeLabs();

    expect(screen.getByRole("heading", { name: "Practice Labs" })).toBeInTheDocument();
    expect(screen.getByText("75 tasks")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Download Linux Practice Repo" })).toBeInTheDocument();
    expect(screen.getByText("linux-practice-lab/")).toBeInTheDocument();
  });

  it("filters labs by search, category, and difficulty", () => {
    const { container } = renderPracticeLabs();

    fireEvent.change(screen.getByRole("searchbox", { name: "search labs" }), {
      target: { value: "ERROR" },
    });
    expect(screen.getAllByText("Find Error Messages in Application Logs").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText("category"), { target: { value: "Grep" } });
    expect(container.querySelectorAll("details")).toHaveLength(2);

    fireEvent.change(screen.getByLabelText("difficulty"), { target: { value: "Beginner" } });
    expect(container.querySelectorAll("details")).toHaveLength(1);
  });

  it("reveals hints and solutions", () => {
    renderPracticeLabs();

    fireEvent.click(screen.getByRole("button", { name: "Reveal hint" }));
    expect(screen.getByText(/Level 1:/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reveal Solution" }));
    expect(screen.getByText("Solution")).toBeInTheDocument();
    expect(screen.getByText(/\$ pwd/)).toBeInTheDocument();
  });

  it("navigates between labs", () => {
    renderPracticeLabs();

    expect(screen.getByRole("heading", { name: "Confirm Your Working Directory" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next Lab" }));
    expect(screen.getByRole("heading", { name: "Inspect a Config File" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous Lab" }));
    expect(screen.getByRole("heading", { name: "Confirm Your Working Directory" })).toBeInTheDocument();
  });

  it("persists completion independently through App localStorage", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Practice Labs" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark Complete" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(stored.practiceLabStartedIds).toEqual(["linux-lab-beginner-1"]);
      expect(stored.practiceLabCompletedIds).toEqual(["linux-lab-beginner-1"]);
      expect(stored.interviewMasteredFlashcards).toEqual([]);
    });
  });

  it("logs blockers and surfaces recommended practice areas", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Practice Labs" }));
    fireEvent.click(screen.getByRole("button", { name: "Log blocker" }));
    fireEvent.click(screen.getByRole("button", { name: "Log blocker" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(stored.practiceLabFailures.Navigation).toBe(2);
    });
    expect(screen.getAllByText(/Navigation/).length).toBeGreaterThan(0);
  });

  it("resets Practice Lab progress", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Practice Labs" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark Complete" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset Progress" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(stored.practiceLabStartedIds).toEqual([]);
      expect(stored.practiceLabCompletedIds).toEqual([]);
      expect(stored.practiceLabFailures).toEqual({});
    });
  });
});
