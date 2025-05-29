"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { mapRoleFromBE } from "@/types/auth.types";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoBack = () => {
    if (!user) {
      router.push("/");
      return;
    }

    const mappedRole = mapRoleFromBE(user.mainRole);

    // Redirect based on mapped role
    switch (mappedRole) {
      case "HR_OFFICER":
        router.push("/dashboard/hr");
        break;
      case "PAYROLL_SPECIALIST":
        router.push("/dashboard/payroll");
        break;
      case "ACCOUNTING_MANAGER":
        router.push("/dashboard/accounting");
        break;
      case "BRANCH_MANAGER":
        router.push("/dashboard/branch");
        break;
      case "EMPLOYEE":
        router.push("/dashboard/employee");
        break;
      case "CORPORATE_ADMIN":
        router.push("/dashboard/admin");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleGoBack}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
