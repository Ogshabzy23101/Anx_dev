import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FilePractice from "./FilePractice";
import { terraformPractice } from "../data/terraform";

describe("Terraform HCL correction flow", () => {
  it("shows precise missing fields and recovery actions", () => {
    const ec2 = terraformPractice.find((task) => task.id === "tf-hcl-ec2");
    render(
      <FilePractice
        tasks={[ec2]}
        completedIds={[]}
        onComplete={() => {}}
        editorLabel="Terraform HCL answer"
        resultNoun="HCL"
        submitLabel="Validate HCL"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Validate HCL" }));

    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("✗ resource \"aws_instance\" \"web\"")).toBeInTheDocument();
    expect(within(dialog).getByText("✗ ami = ami-123456")).toBeInTheDocument();
    expect(within(dialog).getByText("✗ instance_type = t3.micro")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Show solution in editor" })).toBeInTheDocument();
  });
});
