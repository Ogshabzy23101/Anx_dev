import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CommandQuiz from "./CommandQuiz";
import CorrectionModal from "./CorrectionModal";
import FilePractice from "./FilePractice";

describe("UX-001 enhanced feedback", () => {
  it("shows correct, missing, expected, and user command values", () => {
    const correction = {
      explanation: "Initialize the directory.",
      answer: "terraform init -upgrade",
      feedback: {
        passed: ["terraform", "init"],
        missing: ["-upgrade"],
        expectedValue: "terraform init -upgrade",
        userValue: "terraform init",
      },
    };
    render(<CorrectionModal correction={correction} onClose={() => {}} />);

    expect(screen.getByText("correct sections")).toBeInTheDocument();
    expect(screen.getByText("✓ terraform")).toBeInTheDocument();
    expect(screen.getByText("missing sections")).toBeInTheDocument();
    expect(screen.getByText("✗ -upgrade")).toBeInTheDocument();
    expect(screen.getByText("expected value")).toBeInTheDocument();
    expect(screen.getByText("user value")).toBeInTheDocument();
  });

  it("passes structured feedback from an incorrect command", () => {
    let correction;
    render(
      <CommandQuiz
        questions={[{
          id: "init-upgrade",
          prompt: "Initialize with upgrades.",
          answers: ["terraform init -upgrade"],
          explanation: "Use the upgrade flag.",
        }]}
        completedIds={[]}
        onCorrect={() => {}}
        onWrong={(value) => { correction = value; }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("type your command"), {
      target: { value: "terraform init" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Run command" }));

    expect(correction.feedback.passed).toEqual(["terraform", "init"]);
    expect(correction.feedback.missing).toEqual(["-upgrade"]);
  });

  it("shows requirement-level file feedback and submitted values", () => {
    const task = {
      id: "hcl",
      title: "HCL",
      filename: "main.tf",
      instruction: "Write an EC2 resource.",
      starter: 'resource "aws_instance" "web" {\n}\n',
      solution: 'resource "aws_instance" "web" {\n  ami = "ami-1"\n}\n',
      explanation: "The resource needs an AMI.",
      rules: [
        { label: "resource block present", pattern: /resource "aws_instance"/ },
        { label: "ami", pattern: /^\s*ami\s*=/m },
      ],
    };
    render(<FilePractice tasks={[task]} completedIds={[]} onComplete={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Validate script" }));

    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("✓ resource block present")).toBeInTheDocument();
    expect(within(dialog).getByText("✗ ami")).toBeInTheDocument();
    expect(within(dialog).getByText("expected values")).toBeInTheDocument();
    expect(within(dialog).getByText("user values")).toBeInTheDocument();
  });
});
