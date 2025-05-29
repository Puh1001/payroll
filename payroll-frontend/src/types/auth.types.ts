export type UserRole =
  | "HR_OFFICER"
  | "PAYROLL_SPECIALIST"
  | "ACCOUNTING_MANAGER"
  | "BRANCH_MANAGER"
  | "EMPLOYEE"
  | "CORPORATE_ADMIN";

export interface IUser {
  username: string;
  email: string;
  displayName: string;
  givenName: string;
  commonName: string;
  distinguishedName: string;
  mainRole: string;
  department: string;
  location: string;
  roles: string[];
  branch: string;
}

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginForm {
  username: string;
  password: string;
}

// Role-based route configuration
export interface IRouteConfig {
  path: string;
  roles: UserRole[];
  children?: IRouteConfig[];
}

export const ROUTE_CONFIG: IRouteConfig[] = [
  {
    path: "/dashboard/hr",
    roles: ["HR_OFFICER"],
    children: [
      { path: "/sync", roles: ["HR_OFFICER"] },
      { path: "/attendance", roles: ["HR_OFFICER"] },
      { path: "/salary-components", roles: ["HR_OFFICER"] },
      { path: "/salary-formulas", roles: ["HR_OFFICER"] },
    ],
  },
  {
    path: "/dashboard/payroll",
    roles: ["PAYROLL_SPECIALIST"],
    children: [
      { path: "/payslips", roles: ["PAYROLL_SPECIALIST"] },
      { path: "/formulas", roles: ["PAYROLL_SPECIALIST"] },
      { path: "/processing", roles: ["PAYROLL_SPECIALIST"] },
      { path: "/components", roles: ["PAYROLL_SPECIALIST"] },
    ],
  },
  {
    path: "/dashboard/accounting",
    roles: ["ACCOUNTING_MANAGER"],
    children: [
      { path: "/approvals", roles: ["ACCOUNTING_MANAGER"] },
      { path: "/reports", roles: ["ACCOUNTING_MANAGER"] },
    ],
  },
  {
    path: "/dashboard/branch",
    roles: ["BRANCH_MANAGER"],
    children: [
      { path: "/history", roles: ["BRANCH_MANAGER"] },
      { path: "/complaints", roles: ["BRANCH_MANAGER"] },
    ],
  },
  {
    path: "/dashboard/employee",
    roles: ["EMPLOYEE"],
    children: [
      { path: "/payslips", roles: ["EMPLOYEE"] },
      { path: "/details", roles: ["EMPLOYEE"] },
    ],
  },
  {
    path: "/dashboard/admin",
    roles: ["CORPORATE_ADMIN"],
    children: [
      { path: "/settings", roles: ["CORPORATE_ADMIN"] },
      { path: "/branches", roles: ["CORPORATE_ADMIN"] },
    ],
  },
];

// Thêm mapping function để chuyển đổi role từ BE sang FE
export const mapRoleFromBE = (mainRole: string): UserRole => {
  console.log("Mapping role from BE:", mainRole); // Add logging

  // Mapping logic dựa trên mainRole từ BE
  const roleMapping: { [key: string]: UserRole } = {
    "VN-IT资讯科技部": "CORPORATE_ADMIN",
    "VN-HR": "HR_OFFICER",
    "VN-Payroll": "PAYROLL_SPECIALIST",
    "VN-Accounting": "ACCOUNTING_MANAGER",
    "VN-Branch": "BRANCH_MANAGER",
    "VN-All Users": "EMPLOYEE",
    "VN-HR Department": "HR_OFFICER",
    "VN-Payroll Department": "PAYROLL_SPECIALIST",
    "VN-Accounting Department": "ACCOUNTING_MANAGER",
    "VN-Branch Management": "BRANCH_MANAGER",
  };

  const mappedRole = roleMapping[mainRole] || "EMPLOYEE";
  console.log("Mapped to role:", mappedRole); // Add logging
  return mappedRole;
};
