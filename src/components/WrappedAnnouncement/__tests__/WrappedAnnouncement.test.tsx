import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WrappedAnnouncement, { ANNOUNCEMENT_KEY } from "../WrappedAnnouncement";

const renderAnnouncement = () =>
  render(
    <MemoryRouter>
      <WrappedAnnouncement />
    </MemoryRouter>,
  );

describe("WrappedAnnouncement", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows up after a short delay on the first visit", () => {
    renderAnnouncement();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));

    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/wrapped");
  });

  it("stays hidden once dismissed", () => {
    renderAnnouncement();
    act(() => vi.advanceTimersByTime(1000));

    fireEvent.click(screen.getByText("wrapped.announcement.dismiss"));

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(localStorage.getItem(ANNOUNCEMENT_KEY)).toBe("true");
  });

  it("does not show when already seen this year", () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, "true");
    renderAnnouncement();
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});
