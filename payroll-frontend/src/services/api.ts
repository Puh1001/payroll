import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { tokenService } from "./token.service";

interface ApiError {
  message: string;
  status: number;
}

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000, // 10 seconds timeout
  });

  api.interceptors.request.use(
    (config) => {
      const token = tokenService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        try {
          // Try to refresh token
          const authService = (await import("./auth.service")).authService;
          await authService.refreshToken();

          // Retry the original request
          const originalRequest = error.config;
          if (originalRequest) {
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          tokenService.clearTokens();
          window.location.href = "/";
        }
      }

      const errorMessage = error.response?.data?.message || error.message;
      console.error(`API Error: ${errorMessage}`);

      return Promise.reject({
        message: errorMessage,
        status: error.response?.status || 500,
      });
    }
  );

  return api;
};

const api = createApi();

export default api;
