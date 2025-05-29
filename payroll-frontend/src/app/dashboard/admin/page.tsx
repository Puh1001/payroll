"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types/auth.types";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["CORPORATE_ADMIN"]}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Corporate Admin Dashboard
            </h1>
            <div className="mt-4">
              <p className="text-gray-600">
                Welcome, {user?.displayName || user?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
