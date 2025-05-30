import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Lấy giá trị từ cache
   * @param key Khóa cache
   * @returns Giá trị từ cache hoặc null nếu không tồn tại
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}: ${error.message}`);
      return null;
    }
  }

  /**
   * Lưu giá trị vào cache
   * @param key Khóa cache
   * @param value Giá trị cần lưu
   * @param ttl Thời gian sống (giây)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}: ${error.message}`);
    }
  }

  /**
   * Xóa giá trị khỏi cache
   * @param key Khóa cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting cache for key ${key}: ${error.message}`,
      );
    }
  }

  /**
   * Xóa tất cả cache
   */
  async reset(): Promise<void> {
    try {
      // Lấy tất cả keys từ cache
      const keys = await this.getAllKeys();
      // Xóa từng key
      await Promise.all(keys.map((key) => this.del(key)));
    } catch (error) {
      this.logger.error(`Error resetting cache: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả keys trong cache
   * @returns Danh sách keys
   */
  private async getAllKeys(): Promise<string[]> {
    try {
      // Sử dụng Redis client trực tiếp nếu có
      const redisClient = (this.cacheManager as any).store?.getClient?.();
      if (redisClient) {
        return await redisClient.keys('*');
      }
      // Fallback: trả về mảng rỗng nếu không có Redis client
      return [];
    } catch (error) {
      this.logger.error(`Error getting all keys: ${error.message}`);
      return [];
    }
  }

  /**
   * Lấy hoặc tạo cache
   * @param key Khóa cache
   * @param factory Hàm tạo giá trị nếu cache không tồn tại
   * @param ttl Thời gian sống (giây)
   * @returns Giá trị từ cache hoặc giá trị mới
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached) {
        return cached;
      }

      const value = await factory();
      await this.set(key, value, ttl);
      return value;
    } catch (error) {
      this.logger.error(
        `Error in getOrSet for key ${key}: ${error.message}`,
        error.stack,
      );
      return factory();
    }
  }

  /**
   * Xóa cache theo pattern
   * @param pattern Pattern để xóa cache
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      // Sử dụng Redis client trực tiếp nếu có
      const redisClient = (this.cacheManager as any).store?.getClient?.();
      if (redisClient) {
        const keys = await redisClient.keys(pattern);
        await Promise.all(keys.map((key) => this.del(key)));
      }
    } catch (error) {
      this.logger.error(
        `Error deleting cache by pattern ${pattern}: ${error.message}`,
      );
    }
  }
}
