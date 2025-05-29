"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-12 border-b border-[#E6E8EB]">
        <div className="flex justify-between items-center px-10 h-full">
          <div className="flex items-center gap-4">
            <div className="w-4 h-4 bg-[#141414]" />
            <h1 className="text-[18px] font-bold text-[#141414]">
              Payroll System
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center px-40 py-5">
        <div className="w-full max-w-[960px] flex flex-col items-center">
          <h2 className="text-[28px] font-bold text-[#141414] text-center mb-8">
            Welcome to Payroll
          </h2>
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 px-5">
        <div className="max-w-[960px] mx-auto">
          <p className="text-[16px] text-[#757575] text-center">
            © 2025 best Pacific Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
