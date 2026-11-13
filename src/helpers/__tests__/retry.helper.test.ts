import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it, vi } from "vitest";
import { withRetry } from "../retry.helper";

const httpError = (status: number) =>
  new AxiosError("Request failed", "ERR_BAD_RESPONSE", undefined, undefined, {
    status,
    statusText: "",
    data: {},
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe("withRetry", () => {
  it("retries a server error and returns the later success", async () => {
    const request = vi.fn().mockRejectedValueOnce(httpError(500)).mockResolvedValueOnce("ok");

    await expect(withRetry(request, 2, 0)).resolves.toBe("ok");
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("gives up after the last retry", async () => {
    const request = vi.fn().mockRejectedValue(httpError(503));

    await expect(withRetry(request, 2, 0)).rejects.toThrow("Request failed");
    expect(request).toHaveBeenCalledTimes(3);
  });

  it("does not retry a client error like a missing user", async () => {
    const request = vi.fn().mockRejectedValue(httpError(404));

    await expect(withRetry(request, 2, 0)).rejects.toThrow();
    expect(request).toHaveBeenCalledTimes(1);
  });
});
