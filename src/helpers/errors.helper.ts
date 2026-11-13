/** Keys under "errors" in the locale files */
export type ErrorKey =
  | "userNotFound"
  | "insufficientData"
  | "apiError"
  | "userRequired"
  | "periodRequired";

/**
 * An error the UI can explain to the user. The key picks the translated
 * message; `message` keeps the original text for logs and Sentry.
 */
export class AppError extends Error {
  readonly key: ErrorKey;

  constructor(key: ErrorKey, message: string = key) {
    super(message);
    this.name = "AppError";
    this.key = key;
  }
}

export const getErrorKey = (error: unknown): ErrorKey =>
  error instanceof AppError ? error.key : "apiError";

// Last.fm error codes: https://www.last.fm/api/errorcodes
const LASTFM_INVALID_PARAMETERS = 6;

/** Last.fm reports a missing user as error 6 ("User not found") */
export const lastFmErrorKey = (code: unknown): ErrorKey =>
  code === LASTFM_INVALID_PARAMETERS ? "userNotFound" : "apiError";
