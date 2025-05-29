"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IAuthState, IUser, UserRole, mapRoleFromBE } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";

interface AuthContextType extends IAuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  currentRole: UserRole | null;
}

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case "HR_OFFICER":
      return "/dashboard/hr";
    case "PAYROLL_SPECIALIST":
      return "/dashboard/payroll";
    case "ACCOUNTING_MANAGER":
      return "/dashboard/accounting";
    case "BRANCH_MANAGER":
      return "/dashboard/branch";
    case "EMPLOYEE":
      return "/dashboard/employee";
    case "CORPORATE_ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<IAuthState>(initialState);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (tokenService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          const mappedRole = mapRoleFromBE(user.mainRole);
          setCurrentRole(mappedRole);
          setState({
            user,
            accessToken: tokenService.getAccessToken(),
            refreshToken: tokenService.getRefreshToken(),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({ ...initialState, isLoading: false });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        tokenService.clearTokens();
        setState({ ...initialState, isLoading: false });
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Set loading state
      setState((prev) => ({ ...prev, isLoading: true }));

      // Login and get tokens
      const response = await authService.login(username, password);

      // Store tokens
      tokenService.setTokens(response);

      // Get user info
      const user = await authService.getCurrentUser();
      const mappedRole = mapRoleFromBE(user.mainRole);

      // Store role
      tokenService.setUserRole(mappedRole);

      // Update state
      setCurrentRole(mappedRole);
      setState({
        user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect to appropriate dashboard
      const redirectPath = getRedirectPath(mappedRole);
      window.location.href = redirectPath;
    } catch (error: any) {
      console.error("Login failed:", error);
      tokenService.clearTokens();
      setState({ ...initialState, isLoading: false });
      setCurrentRole(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      tokenService.clearTokens();
      setState(initialState);
      setCurrentRole(null);
      window.location.href = "/";
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return currentRole === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return currentRole ? roles.includes(currentRole) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        hasRole,
        hasAnyRole,
        currentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
