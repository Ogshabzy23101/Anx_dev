import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import InterviewLab from "./InterviewLab";

const progress = {
  interviewReviewedQuestions: [],
  interviewMasteredFlashcards: [],
  interviewQuizScore: 0,
  interviewCompletedWritten: [],
  interviewCompletedMocks: 0,
  interviewWeakCategories: [],
};

function renderInterview(overrides = {}) {
  return render(
    <InterviewLab
      progress={{ ...progress, ...overrides.progress }}
      setProgress={overrides.setProgress || vi.fn()}
      onWrong={overrides.onWrong || vi.fn()}
    />,
  );
}

describe("Interview Mode", () => {
  it("renders the Interview section and Q&A bank", () => {
    renderInterview();

    expect(screen.getByRole("heading", { name: "Interview Mode" })).toBeInTheDocument();
    expect(screen.getByText("55 prompts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Q&A Bank" })).toHaveClass("active");
  });

  it("filters questions by category and difficulty", () => {
    const { container } = renderInterview();

    fireEvent.change(screen.getByLabelText("category"), { target: { value: "Docker" } });
    expect(container.querySelectorAll("details")).toHaveLength(5);

    fireEvent.change(screen.getByLabelText("difficulty"), { target: { value: "Beginner" } });
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getByText("What is the difference between an image and a container?")).toBeInTheDocument();
  });

  it("reveals structured Q&A details", () => {
    renderInterview();

    fireEvent.click(screen.getByText("Explain Linux file permissions."));
    expect(screen.getAllByText("Short answer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Detailed answer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Common mistake").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Interview tip").length).toBeGreaterThan(0);
  });

  it("reveals interview flashcard answer structure", () => {
    renderInterview();

    fireEvent.click(screen.getByRole("button", { name: "Interview Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Flip interview flashcard" }));

    expect(screen.getByText("Short answer")).toBeInTheDocument();
    expect(screen.getByText("Deeper explanation")).toBeInTheDocument();
    expect(screen.getByText("Interview tip")).toBeInTheDocument();
  });

  it("opens correction modal for wrong interview MCQ answers", () => {
    const onWrong = vi.fn();
    renderInterview({ onWrong });

    fireEvent.click(screen.getByRole("button", { name: "Interview Quiz" }));
    fireEvent.click(screen.getAllByRole("button", { name: /A strong answer should mention/i })[1]);
    fireEvent.click(screen.getByRole("button", { name: "Submit interview answer" }));

    expect(onWrong).toHaveBeenCalledWith(expect.objectContaining({
      explanation: expect.any(String),
      answer: expect.any(String),
    }));
  });

  it("validates written answers and shows missing points", () => {
    renderInterview();

    fireEvent.click(screen.getByRole("button", { name: "Written Practice" }));
    fireEvent.change(screen.getByLabelText("Written interview answer"), {
      target: { value: "Permissions are about read access." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate answer" }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("covered points")).toBeInTheDocument();
    expect(screen.getByText("missing points")).toBeInTheDocument();
    expect(screen.getByText("expected answer")).toBeInTheDocument();
  });

  it("persists Interview progress independently", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Interview" }));
    fireEvent.click(screen.getByText("Explain Linux file permissions."));
    fireEvent.click(screen.getAllByRole("button", { name: "Mark reviewed" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Interview Flashcards" }));
    fireEvent.click(screen.getByRole("button", { name: "Mark mastered" }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("devops-lab-progress-v1"));
      expect(stored.interviewReviewedQuestions).toEqual(["interview-linux-1"]);
      expect(stored.interviewMasteredFlashcards).toEqual(["flashcard-interview-linux-1"]);
      expect(stored.ansibleMasteredFlashcards).toEqual([]);
    });
  });
});
