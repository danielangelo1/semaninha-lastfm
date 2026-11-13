// After a deploy, a tab still running the previous version asks for hashed
// chunks that no longer exist. Reload once to pick up the new version instead
// of showing the error screen.
const RELOAD_KEY = "semaninha-chunk-reload-at";
const RELOAD_COOLDOWN_MS = 10_000;

let reloading = false;

/** True while the page is reloading for a new version, so its errors can be dropped */
export const isReloadingForNewVersion = (): boolean => reloading;

const reloadedRecently = (): boolean => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY));
    return Date.now() - last < RELOAD_COOLDOWN_MS;
  } catch {
    return false;
  }
};

export const initChunkReload = (): void => {
  window.addEventListener("vite:preloadError", (event) => {
    // Already tried: let the error reach the error boundary instead of looping
    if (reloadedRecently()) return;

    event.preventDefault();
    reloading = true;
    try {
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      // Without storage the cooldown can't be kept, but one reload is still fine
    }
    window.location.reload();
  });
};
