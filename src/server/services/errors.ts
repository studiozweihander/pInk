export type AppErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  statusCode: number;
  code: AppErrorCode;
  details?: unknown;

  constructor(message: string, statusCode: number, code: AppErrorCode, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ApiNotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
    this.name = "ApiNotFoundError";
  }
}

export class NotFoundError extends ApiNotFoundError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 502, "DATABASE_ERROR", details);
    this.name = "DatabaseError";
  }
}

export function toAppError(error: unknown, fallbackMessage: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallbackMessage, 500, "INTERNAL_ERROR");
  }

  return new AppError(fallbackMessage, 500, "INTERNAL_ERROR");
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
