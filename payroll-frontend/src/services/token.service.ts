import { ILoginResponse } from "@/types/auth.types";

interface CookieOptions {
  path?: string;
  expires?: Date;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

class TokenService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_ROLE_KEY = "userRole";
  private static readonly DEFAULT_COOKIE_OPTIONS: CookieOptions = {
    path: "/",
    secure: true,
    sameSite: "strict",
  };

  private setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    const cookieOptions = {
      ...TokenService.DEFAULT_COOKIE_OPTIONS,
      ...options,
    };
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`;
    if (cookieOptions.expires)
      cookieString += `; expires=${cookieOptions.expires.toUTCString()}`;
    if (cookieOptions.secure) cookieString += "; secure";
    if (cookieOptions.sameSite)
      cookieString += `; samesite=${cookieOptions.sameSite}`;

    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
    if (!cookie) return null;

    try {
      return decodeURIComponent(cookie.split("=")[1]);
    } catch {
      return null;
    }
  }

  setTokens(tokens: ILoginResponse): void {
    const { accessToken, refreshToken } = tokens;
    this.setCookie(TokenService.ACCESS_TOKEN_KEY, accessToken);
    this.setCookie(TokenService.REFRESH_TOKEN_KEY, refreshToken);
  }

  setUserRole(role: string): void {
    this.setCookie(TokenService.USER_ROLE_KEY, role);
  }

  getAccessToken(): string | null {
    return this.getCookie(TokenService.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.getCookie(TokenService.REFRESH_TOKEN_KEY);
  }

  getUserRole(): string | null {
    return this.getCookie(TokenService.USER_ROLE_KEY);
  }

  clearTokens(): void {
    const expiredDate = new Date(0);
    const clearOptions: CookieOptions = {
      ...TokenService.DEFAULT_COOKIE_OPTIONS,
      expires: expiredDate,
    };

    this.setCookie(TokenService.ACCESS_TOKEN_KEY, "", clearOptions);
    this.setCookie(TokenService.REFRESH_TOKEN_KEY, "", clearOptions);
    this.setCookie(TokenService.USER_ROLE_KEY, "", clearOptions);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return Boolean(accessToken && refreshToken);
  }

  hasValidAccessToken(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }
}

export const tokenService = new TokenService();
