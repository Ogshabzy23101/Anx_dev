import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FilePractice from "./FilePractice";
import { ansiblePractice } from "../data/ansible";

describe("Ansible playbook correction flow", () => {
  it("shows precise missing concepts and enhanced feedback", () => {
    const nginx = ansiblePractice.find((task) => task.id === "ansible-yaml-apt");
    render(
      <FilePractice
        tasks={[nginx]}
        completedIds={[]}
        onComplete={() => {}}
        editorLabel="Ansible YAML answer"
        resultNoun="Playbook"
        submitLabel="Validate playbook"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Validate playbook" }));

    const dialog = screen.getByRole("alertdialog");
    expect(within(dialog).getByText("✓ hosts: web")).toBeInTheDocument();
    expect(within(dialog).getByText("✓ tasks:")).toBeInTheDocument();
    expect(within(dialog).getByText("✗ module: apt")).toBeInTheDocument();
    expect(within(dialog).getByText("✗ package: nginx")).toBeInTheDocument();
    expect(within(dialog).getByText("expected values")).toBeInTheDocument();
    expect(within(dialog).getByText("user values")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});
