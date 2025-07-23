import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error-codes';

export class CustomException extends HttpException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const message = customMessage || ERROR_MESSAGES[errorCode];
    
    super(
      {
        success: false,
        error: {
          code: errorCode,
          message,
          field,
          details,
        },
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

// Excepciones específicas para diferentes tipos de errores
export class AuthException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.UNAUTHORIZED);
  }
}

export class ValidationException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.BAD_REQUEST);
  }
}

export class NotFoundException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.CONFLICT);
  }
}

export class ForbiddenException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.FORBIDDEN);
  }
}

export class InternalServerException extends CustomException {
  constructor(
    errorCode: keyof typeof ERROR_CODES,
    customMessage?: string,
    field?: string,
    details?: any,
  ) {
    super(errorCode, customMessage, field, details, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
