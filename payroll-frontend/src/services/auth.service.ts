import { ILoginForm, ILoginResponse, IUser } from "@/types/auth.types";
import { tokenService } from "./token.service";
import api from "./api";

class AuthService {
  private readonly AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH: "/auth/refresh",
  };

  async login(username: string, password: string): Promise<ILoginResponse> {
    try {
      const response = await api.post<ILoginResponse>(
        this.AUTH_ENDPOINTS.LOGIN,
        {
          username,
          password,
        }
      );

      // Save tokens after successful login
      tokenService.setTokens(response.data);

      // Get user info and save role
      const userInfo = await this.getCurrentUser();
      tokenService.setUserRole(userInfo.mainRole);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Invalid username or password");
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(this.AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      tokenService.clearTokens();
    }
  }

  async getCurrentUser(): Promise<IUser> {
    try {
      const response = await api.get<IUser>(this.AUTH_ENDPOINTS.ME);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user info:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user info"
      );
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.post(this.AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post(this.AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to process forgot password request"
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(this.AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }

  async refreshToken(): Promise<ILoginResponse> {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post<ILoginResponse>(
        this.AUTH_ENDPOINTS.REFRESH,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      tokenService.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      tokenService.clearTokens();
      throw new Error(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
}

export const authService = new AuthService();
