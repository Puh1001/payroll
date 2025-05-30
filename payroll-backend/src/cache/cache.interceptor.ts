import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { Request } from 'express';

export interface CacheOptions {
  ttl?: number;
  key?: string;
  excludePaths?: string[];
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly options: CacheOptions = {},
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { path } = request;

    // Kiểm tra xem path có bị loại trừ không
    if (this.options.excludePaths?.some((p) => path.includes(p))) {
      return next.handle();
    }

    // Tạo cache key
    const cacheKey = this.generateCacheKey(request);

    // Thử lấy từ cache
    const cachedResponse = await this.cacheService.get(cacheKey);
    if (cachedResponse) {
      this.logger.debug(`Cache hit for key: ${cacheKey}`);
      return of(cachedResponse);
    }

    // Nếu không có trong cache, xử lý request và lưu vào cache
    return next.handle().pipe(
      tap(async (response) => {
        try {
          await this.cacheService.set(
            cacheKey,
            response,
            this.options.ttl || 300, // Default TTL: 5 minutes
          );
          this.logger.debug(`Cache set for key: ${cacheKey}`);
        } catch (error) {
          this.logger.error(
            `Error caching response for key ${cacheKey}: ${error.message}`,
          );
        }
      }),
    );
  }

  private generateCacheKey(request: Request): string {
    if (this.options.key) {
      return this.options.key;
    }

    const { method, path, query, body } = request;
    const queryString = Object.keys(query).length
      ? `?${JSON.stringify(query)}`
      : '';
    const bodyString = Object.keys(body).length
      ? `:${JSON.stringify(body)}`
      : '';

    return `${method}:${path}${queryString}${bodyString}`;
  }
}
