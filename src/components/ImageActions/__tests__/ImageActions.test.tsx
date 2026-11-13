import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ImageActions from "../ImageActions";

const IMAGE = "data:image/png;base64,iVBORw0KGgo=";

const renderActions = () =>
  render(<ImageActions imageUrl={IMAGE} fileName="rj-wrapped.png" shareText="Meu Wrapped" />);

describe("ImageActions", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("only offers download when the browser can't share files", () => {
    vi.stubGlobal("navigator", { ...navigator, canShare: undefined });
    renderActions();

    expect(screen.queryByText("share.share")).not.toBeInTheDocument();
    expect(screen.getByText("share.download")).toBeInTheDocument();
  });

  it("shares the image file through the native share sheet", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, canShare: () => true, share });
    renderActions();

    await act(async () => {
      fireEvent.click(screen.getByText("share.share"));
    });

    expect(share).toHaveBeenCalledTimes(1);
    const [{ files, text }] = share.mock.calls[0];
    expect(files[0].name).toBe("rj-wrapped.png");
    expect(text).toBe("Meu Wrapped");
  });

  it("downloads the image with the given file name", () => {
    vi.stubGlobal("navigator", { ...navigator, canShare: undefined });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    renderActions();

    fireEvent.click(screen.getByText("share.download"));

    expect(click).toHaveBeenCalledTimes(1);
    const link = click.mock.instances[0] as unknown as HTMLAnchorElement;
    expect(link.download).toBe("rj-wrapped.png");
  });
});
