import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CorrectionModal from "./CorrectionModal";

describe("CorrectionModal", () => {
  it("stays hidden when there is no correction", () => {
    render(<CorrectionModal correction={null} onClose={() => {}} />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("shows correction details and closes from its action", () => {
    const onClose = vi.fn();
    render(
      <CorrectionModal
        correction={{ explanation: "Use ls -a.", answer: "ls -a" }}
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Use ls -a.")).toBeInTheDocument();
    expect(screen.getByText("ls -a")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try the next step" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
