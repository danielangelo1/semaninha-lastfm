import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Support from "../Support";

vi.mock("../../../constants", () => ({
  SUPPORT_CONFIG: { PIX_KEY: "pix@example.com" },
}));

describe("Support", () => {
  it("copies the Pix key and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<Support />);
    expect(screen.getByText("pix@example.com")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "support.copy" }));
    });

    expect(writeText).toHaveBeenCalledWith("pix@example.com");
    expect(screen.getByRole("button", { name: "support.copied" })).toBeInTheDocument();
  });
});
