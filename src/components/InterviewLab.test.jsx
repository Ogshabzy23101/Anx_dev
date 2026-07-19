import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import InterviewLab from "./InterviewLab";
import { interviewQuestions } from "../data/interview";

const progress = {
  interviewPracticedIds: [],
};

function renderInterview(overrides = {}) {
  return render(
    <InterviewLab
      progress={{ ...progress, ...overrides.progress }}
      setProgress={overrides.setProgress || vi.fn()}
    />,
  );
}

describe("Interview Prep", () => {
  it("renders the Interview Prep section defaulting to Practice mode", () => {
    renderInterview();

    expect(screen.getByRole("heading", { name: "DevOps Interview Practice" })).toBeInTheDocument();
    expect(screen.getByText(`${interviewQuestions.length} questions`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Practice" })).toHaveClass("active");
    expect(screen.getByRole("textbox", { name: "Your interview answer" })).toBeInTheDocument();
  });

  it("shows the formula stages for the current question", () => {
    renderInterview();

    expect(screen.getAllByText(/formula$/).length).toBeGreaterThan(0);
  });

  it("filters questions by category and difficulty", () => {
    renderInterview();

    fireEvent.change(screen.getByLabelText("category"), { target: { value: "Docker" } });
    const select = screen.getByLabelText("question");
    expect(select.options.length).toBe(
      interviewQuestions.filter((item) => item.category === "Docker").length,
    );
  });

  it("checks a written answer and shows inline feedback", () => {
    const setProgress = vi.fn();
    renderInterview({ setProgress });

    fireEvent.change(screen.getByLabelText("category"), { target: { value: "Docker" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Your interview answer" }), {
      target: { value: "An image is a read-only template and a container is a running instance of it." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Check my answer" }));

    expect(screen.getByText("Common mistake")).toBeInTheDocument();
    expect(screen.getByText("Show model answer")).toBeInTheDocument();
    expect(setProgress).toHaveBeenCalled();
  });

  it("switches to Reference mode and renders read-only model answers", () => {
    renderInterview();

    fireEvent.click(screen.getByRole("button", { name: "Reference" }));
    expect(screen.getAllByText("Model answer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("A strong answer should").length).toBeGreaterThan(0);
  });

  it("persists Interview practice progress independently", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Interview" }));
    await screen.findByRole("heading", { name: "DevOps Interview Practice" });
    fireEvent.change(screen.getByRole("textbox", { name: "Your interview answer" }), {
      target: { value: "Some practice answer text." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Check my answer" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(stored.interviewPracticedIds.length).toBe(1);
      expect(stored.ansibleMasteredFlashcards).toEqual([]);
    });
  });
});
