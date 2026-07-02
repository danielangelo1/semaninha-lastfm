import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserInput from "../UserInput";
import { UserRequest } from "../../../types/userRequest";

const fetchDataMock = vi.fn();

vi.mock("../../../hooks/useLastFmData", () => ({
  useLastFmData: () => ({
    albumData: null,
    artistData: null,
    trackData: null,
    loading: false,
    error: null,
    fetchData: fetchDataMock,
    clearData: vi.fn(),
  }),
}));

vi.mock("../../Canvas/Canvas", () => ({
  default: () => null,
}));

describe("UserInput", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchDataMock.mockClear();
  });

  it("restores showPlays=true from localStorage", () => {
    localStorage.setItem("showAlbum", "true");
    localStorage.setItem("showPlays", "true");

    render(<UserInput />);

    const showPlays = document.getElementById("showPlays") as HTMLInputElement;
    expect(showPlays.checked).toBe(true);
  });

  it("keeps showPlays unchecked when localStorage has 'false' or nothing", () => {
    localStorage.setItem("showAlbum", "true");
    localStorage.setItem("showPlays", "false");

    render(<UserInput />);

    const showPlays = document.getElementById("showPlays") as HTMLInputElement;
    expect(showPlays.checked).toBe(false);
  });

  it("submits limit as a number", async () => {
    const user = userEvent.setup();
    render(<UserInput />);

    await user.type(document.getElementById("user") as HTMLInputElement, "dandowski");
    await user.selectOptions(document.getElementById("limit") as HTMLSelectElement, "3");
    await user.click(screen.getByRole("button"));

    await waitFor(() => expect(fetchDataMock).toHaveBeenCalledTimes(1));
    const submitted = fetchDataMock.mock.calls[0][0] as UserRequest;
    expect(submitted.limit).toBe(3);
    expect(typeof submitted.limit).toBe("number");
    expect(submitted.user).toBe("dandowski");
  });
});
