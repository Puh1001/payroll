"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login({ username, password });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <form
        className="w-full max-w-[480px] flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 rounded-[20px] border border-[#E6E8EB] focus:outline-none focus:border-[#141414]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-[20px] border border-[#E6E8EB] focus:outline-none focus:border-[#141414]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#141414] text-white py-2 rounded-[20px] font-bold text-[14px] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Sign in"}
        </button>
      </form>
      {error && (
        <div className="text-red-500 text-[14px] text-center">{error}</div>
      )}
      <p className="text-[14px] text-[#757575] text-center">
        Need help? Contact your IT Administrator
      </p>
    </div>
  );
};
