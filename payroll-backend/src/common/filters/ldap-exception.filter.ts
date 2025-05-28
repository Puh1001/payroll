import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class LdapExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LdapExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.UNAUTHORIZED;
    let message = 'Authentication failed';
    let errorCode = 'AUTH_ERROR';

    // Handle LDAP connection errors
    if (
      exception.code === 'ECONNABORTED' ||
      exception.code === 'ECONNREFUSED'
    ) {
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'LDAP server is not available';
      errorCode = 'LDAP_CONNECTION_ERROR';
    }
    // Handle LDAP authentication errors
    else if (exception.message?.includes('InvalidCredentialsError')) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = 'Invalid username or password';
      errorCode = 'INVALID_CREDENTIALS';
    }
    // Handle LDAP search errors
    else if (exception.message?.includes('No such object')) {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'User not found';
      errorCode = 'USER_NOT_FOUND';
    }

    // Log the error with details
    this.logger.error(
      `[LDAP Error] ${request.method} ${request.url} - ${errorCode}`,
      {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error: {
          code: errorCode,
          message: exception.message,
          stack: exception.stack,
        },
      },
    );

    // Send response
    response.status(statusCode).json({
      statusCode,
      message,
      error: errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
