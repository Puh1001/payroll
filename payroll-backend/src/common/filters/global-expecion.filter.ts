import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        errorResponse = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorResponse = {
        name: exception.name,
        message: exception.message,
        ...(this.configService.get('NODE_ENV') === 'development' && {
          stack: exception.stack,
        }),
      };
    }

    // Log error with more details
    this.logger.error(
      `[${request.method}] ${request.url} - ${statusCode} - ${message}`,
      {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params,
        headers: request.headers,
        error: errorResponse,
      },
    );

    // Send response
    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(Object.keys(errorResponse).length > 0 && { error: errorResponse }),
    });
  }
}
