export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erro: 400; Validação falhou
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 404);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Erro: 401; Não autorizado
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// Erro: 403; Proibido
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// Erro: 404; Recurso não encontrado
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not fount`, 404);
    Object.setPrototypeOf
  }
}

// Erro: 500; Erro interno
export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
