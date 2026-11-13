import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dispatchPreloadError = () => {
  const event = new Event("vite:preloadError", { cancelable: true });
  window.dispatchEvent(event);
  return event;
};

describe("chunk reload", () => {
  const reload = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    sessionStorage.clear();
    reload.mockClear();
    vi.stubGlobal("location", { ...window.location, reload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reloads once when a chunk from a previous deploy fails to load", async () => {
    const { initChunkReload, isReloadingForNewVersion } = await import("../chunkReload");
    initChunkReload();

    const event = dispatchPreloadError();

    expect(event.defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(isReloadingForNewVersion()).toBe(true);
  });

  it("lets the error through if it already reloaded moments ago", async () => {
    sessionStorage.setItem("semaninha-chunk-reload-at", String(Date.now()));
    const { initChunkReload } = await import("../chunkReload");
    initChunkReload();

    const event = dispatchPreloadError();

    expect(event.defaultPrevented).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});
