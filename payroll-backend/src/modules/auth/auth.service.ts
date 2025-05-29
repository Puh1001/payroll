import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserInfo, UserPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly userCache: Map<string, UserInfo> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokens(
    payload: UserPayload,
    userInfo: UserInfo,
  ): Promise<TokenDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        }),
        this.jwtService.signAsync(
          { sub: payload.sub },
          {
            secret: this.configService.get<string>('REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
          },
        ),
      ]);

      return {
        accessToken,
        refreshToken,
        user: userInfo,
      };
    } catch (error) {
      this.logger.error(
        `Error generating tokens: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async generateLoginTokens(
    payload: UserPayload,
  ): Promise<LoginResponseDto> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        }),
        this.jwtService.signAsync(
          { sub: payload.sub },
          {
            secret: this.configService.get<string>('REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN'),
          },
        ),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(
        `Error generating login tokens: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async loginViaLdap(user: UserInfo): Promise<LoginResponseDto> {
    try {
      const payload: UserPayload = {
        sub: user.username,
        roles: user.roles,
        branch: user.branch,
        mainRole: user.mainRole,
        displayName: user.displayName,
        email: user.email,
      };

      // Store user info in cache with TTL
      this.userCache.set(user.username, user);
      setTimeout(() => {
        this.userCache.delete(user.username);
      }, this.CACHE_TTL);

      return this.generateLoginTokens(payload);
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserInfo(username: string): Promise<UserInfo> {
    try {
      const userInfo = this.userCache.get(username);
      if (!userInfo) {
        throw new NotFoundException(
          `User information not found for ${username}`,
        );
      }
      return userInfo;
    } catch (error) {
      this.logger.error(
        `Error fetching user info: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async refresh(username: string): Promise<TokenDto> {
    try {
      const userInfo = await this.getUserInfo(username);
      const payload: UserPayload = {
        sub: username,
        roles: userInfo.roles,
        branch: userInfo.branch,
        mainRole: userInfo.mainRole,
        displayName: userInfo.displayName,
        email: userInfo.email,
      };

      return this.generateTokens(payload, userInfo);
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async logout(username: string): Promise<{ success: boolean }> {
    try {
      this.userCache.delete(username);
      return { success: true };
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Helper method to check if user is in cache
  isUserCached(username: string): boolean {
    return this.userCache.has(username);
  }

  // Helper method to get cache size
  getCacheSize(): number {
    return this.userCache.size;
  }
}
