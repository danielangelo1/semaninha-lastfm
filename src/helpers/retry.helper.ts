import { isAxiosError } from "axios";

/** Network failures and 5xx are worth another try; a 4xx such as a missing user is not */
export const isRetryable = (error: unknown): boolean =>
  isAxiosError(error) && (!error.response || error.response.status >= 500);

/** Retries a single request, so one flaky call doesn't redo the others */
export const withRetry = async <T>(
  request: () => Promise<T>,
  retries = 2,
  delayMs = 1000,
): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (retries <= 0 || !isRetryable(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(request, retries - 1, delayMs);
  }
};
