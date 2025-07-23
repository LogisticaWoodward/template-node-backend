import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.handleException(exception, request);
    
    // Log del error
    this.logger.error(
      `${request.method} ${request.url} - ${errorResponse.error || errorResponse.statusCode}: ${errorResponse.message}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(this.getStatusCode(exception)).json(errorResponse);
  }

  private handleException(exception: unknown, request: Request): any {
    const timestamp = new Date().toISOString();
    const path = request.url;

    // Manejar HttpException (incluye nuestras excepciones personalizadas)
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const status = exception.getStatus();
      
      // Si es una de nuestras excepciones personalizadas
      if (typeof exceptionResponse === 'object' && 'success' in exceptionResponse) {
        // Para mantener backward compatibility, devolver el formato original
        const customResponse = exceptionResponse as any;
        return {
          message: customResponse.error?.message || exception.message,
          error: this.getErrorNameFromStatus(status),
          statusCode: status,
          // Agregar información adicional para debugging (opcional)
          ...(process.env.NODE_ENV === 'development' && {
            errorCode: customResponse.error?.code,
            field: customResponse.error?.field,
            details: customResponse.error?.details,
          })
        };
      }

      // HttpException estándar - mantener formato original
      return {
        message: typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : (exceptionResponse as any).message || exception.message,
        error: this.getErrorNameFromStatus(status),
        statusCode: status,
      };
    }

    // Manejar errores de Prisma
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handlePrismaError(exception, timestamp, path);
    }

    // Error genérico
    const errorMessage = exception instanceof Error 
      ? exception.message 
      : 'Internal server error';
    
    return {
      message: errorMessage,
      error: 'Internal Server Error',
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && {
        details: exception instanceof Error ? {
          stack: exception.stack,
          name: exception.name,
        } : exception,
      })
    };
  }

  private handlePrismaError(
    exception: PrismaClientKnownRequestError,
    timestamp: string,
    path: string,
  ): any {
    let message: string;
    let statusCode: number;
    let errorName: string;

    switch (exception.code) {
      case 'P2002':
        // Violación de restricción única
        const target = exception.meta?.target as string[];
        const field = target?.[0];
        message = `El ${field} ya existe en el sistema.`;
        statusCode = 409;
        errorName = 'Conflict';
        break;

      case 'P2025':
        // Registro no encontrado
        message = 'El recurso solicitado no existe.';
        statusCode = 404;
        errorName = 'Not Found';
        break;

      case 'P2003':
        // Violación de clave foránea
        message = 'Error de referencia: el recurso relacionado no existe.';
        statusCode = 400;
        errorName = 'Bad Request';
        break;

      case 'P2014':
        // Violación de relación requerida
        message = 'Error de restricción: faltan datos relacionados requeridos.';
        statusCode = 400;
        errorName = 'Bad Request';
        break;

      default:
        message = 'Error en la operación de base de datos.';
        statusCode = 500;
        errorName = 'Internal Server Error';
    }

    return {
      message,
      error: errorName,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        prismaCode: exception.code,
        meta: exception.meta,
      })
    };
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return HttpStatus.CONFLICT;
        case 'P2025':
          return HttpStatus.NOT_FOUND;
        case 'P2003':
        case 'P2014':
          return HttpStatus.BAD_REQUEST;
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getErrorNameFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity';
      default:
        return 'Internal Server Error';
    }
  }
}
