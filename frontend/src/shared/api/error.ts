export interface IError {
  status: number;
  description?: string;
}

export class CustomError extends Error {
  public status: number;
  public parentError: unknown;

  constructor({
    message,
    status,
    parentError,
  }: {
    message: string;
    status: number;
    parentError?: unknown;
  }) {
    super(message);
    this.status = status;
    this.parentError = parentError;
  }
}
