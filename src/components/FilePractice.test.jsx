import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FilePractice from "./FilePractice";

const tasks = [
  {
    id: "file-check",
    title: "Check a file",
    filename: "check.sh",
    instruction: "Check whether app.log exists.",
    starter: "#!/bin/bash\n\n",
    solution: "#!/bin/bash\nif [ -f app.log ]; then\n  echo found\nfi\n",
    rules: [
      { label: "if", pattern: /\bif\b/ },
      { label: "-f app.log", pattern: /-f\s+app\.log/ },
      { label: "then", pattern: /\bthen\b/ },
      { label: "fi", pattern: /\bfi\b/ },
    ],
  },
];

describe("FilePractice", () => {
  it("opens a correction modal with a side-by-side comparison for an invalid answer", () => {
    render(<FilePractice tasks={tasks} completedIds={[]} onComplete={() => {}} />);

    fireEvent.change(screen.getByLabelText("Shell script answer"), {
      target: { value: "if [ -f app.log ]" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate script" }));

    expect(screen.getByText("The script needs another pass.")).toBeInTheDocument();
    expect(screen.getByText(/Missing: then, fi/)).toBeInTheDocument();
    expect(screen.getByText("your answer")).toBeInTheDocument();
    expect(screen.getByText("expected answer")).toBeInTheDocument();
    expect(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show solution in editor" })).toBeInTheDocument();
  });

  it("opens a success modal and records a valid answer", () => {
    const onComplete = vi.fn();
    render(<FilePractice tasks={tasks} completedIds={[]} onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText("Shell script answer"), {
      target: { value: "if [ -f app.log ]; then\n echo yes\nfi" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate script" }));

    expect(screen.getByText("Script accepted.")).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledWith("file-check");
  });

  it("can show the solution and reset the editor", () => {
    render(<FilePractice tasks={tasks} completedIds={[]} onComplete={() => {}} />);
    const editor = screen.getByLabelText("Shell script answer");

    fireEvent.change(editor, { target: { value: "temporary answer" } });
    fireEvent.click(screen.getByRole("button", { name: "Show solution" }));
    expect(screen.getByText("reference solution")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(editor).toHaveValue("#!/bin/bash\n\n");
    expect(screen.queryByText("reference solution")).not.toBeInTheDocument();
  });

  it("reveals the solution from the correction modal", () => {
    render(<FilePractice tasks={tasks} completedIds={[]} onComplete={() => {}} />);

    fireEvent.change(screen.getByLabelText("Shell script answer"), {
      target: { value: "incomplete" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Validate script" }));
    fireEvent.click(screen.getByRole("button", { name: "Show solution in editor" }));

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(screen.getByText("reference solution")).toBeInTheDocument();
  });
});
