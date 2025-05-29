import { useCallback } from "react";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { ILoginForm } from "@/types/auth.types";

export const useAuth = () => {
  const auth = useAuthContext();

  const login = useCallback(
    async (data: ILoginForm) => {
      try {
        await auth.login(data.username, data.password);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [auth]
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, [auth]);

  return {
    ...auth,
    login,
    logout,
  };
};
