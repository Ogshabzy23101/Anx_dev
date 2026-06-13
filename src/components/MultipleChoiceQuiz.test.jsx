import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";

describe("MultipleChoiceQuiz correction flow", () => {
  it("emits correction details after an incorrect submission", () => {
    const onWrong = vi.fn();
    const question = {
      id: "hidden-files",
      question: "Which command includes hidden files?",
      options: ["ls -h", "ls -a"],
      answer: 1,
      explanation: "The -a flag includes dotfiles.",
    };

    render(
      <MultipleChoiceQuiz
        questions={[question]}
        savedScore={0}
        onComplete={() => {}}
        onWrong={onWrong}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /ls -h/ }));
    fireEvent.click(screen.getByRole("button", { name: "Execute answer" }));

    expect(onWrong).toHaveBeenCalledWith({
      explanation: "The -a flag includes dotfiles.",
      answer: "ls -a",
    });
  });
});
