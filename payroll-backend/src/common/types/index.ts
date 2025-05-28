// User related types
export interface IUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  branchId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  HR = 'HR',
  ACCOUNTANT = 'ACCOUNTANT',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

// Branch related types
export interface IBranch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Employee related types
export interface IEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  branchId: string;
  basicSalary: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance related types
export interface IAttendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut: Date;
  status: AttendanceStatus;
  workHours: number;
  overtimeHours: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  LEAVE = 'LEAVE',
}

// Payroll related types
export interface IPayroll {
  id: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

// Common response types
export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
