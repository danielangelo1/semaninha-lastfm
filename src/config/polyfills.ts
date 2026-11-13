// Array.prototype.at arrived in Chrome 92 / Safari 15.4. Older WebViews (e.g.
// the Twitter in-app browser on Chrome 90) crashed in the web-vitals code that
// Sentry bundles, which calls it.
if (!("at" in Array.prototype)) {
  Object.defineProperty(Array.prototype, "at", {
    value(this: unknown[], index: number) {
      const i = Math.trunc(index) || 0;
      return this[i < 0 ? this.length + i : i];
    },
    writable: true,
    configurable: true,
  });
}

export {};
