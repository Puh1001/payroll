import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { CacheOptions } from './cache.interceptor';
import { CacheMetadataKey, DEFAULT_CACHE_TTL } from './cache.constants';

export const Cache = (options: CacheOptions = {}) => {
  const decorators: CustomDecorator<string>[] = [];

  if (options.key) {
    decorators.push(SetMetadata(CacheMetadataKey.KEY, options.key));
  }

  if (options.ttl) {
    decorators.push(SetMetadata(CacheMetadataKey.TTL, options.ttl));
  } else {
    decorators.push(SetMetadata(CacheMetadataKey.TTL, DEFAULT_CACHE_TTL));
  }

  if (options.excludePaths) {
    decorators.push(
      SetMetadata(CacheMetadataKey.EXCLUDE_PATHS, options.excludePaths),
    );
  }

  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    decorators.forEach((decorator) => decorator(target, key, descriptor));
    return descriptor;
  };
};
