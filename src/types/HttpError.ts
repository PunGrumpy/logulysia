/**
 * Custom Error class for HTTP errors.
 */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
