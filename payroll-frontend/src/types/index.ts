// Import types from backend
import type {
  IUser,
  IBranch,
  UserRole,
  IEmployee,
  IAttendance,
  AttendanceStatus,
  IPayroll,
  PayrollStatus,
  IPaginationParams,
  IPaginatedResponse,
  IApiResponse,
} from "../../../payroll-backend/src/common/types";

// Re-export backend types
export type {
  IUser,
  IBranch,
  UserRole,
  IEmployee,
  IAttendance,
  AttendanceStatus,
  IPayroll,
  PayrollStatus,
  IPaginationParams,
  IPaginatedResponse,
  IApiResponse,
};

// Frontend specific types
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface IAppState {
  currentBranch: IBranch | null;
  branches: IBranch[];
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface ILoginForm {
  username: string;
  password: string;
}

export interface IEmployeeForm {
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  branchId: string;
  basicSalary: number;
}

export interface IAttendanceForm {
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut: Date;
  status: AttendanceStatus;
  notes?: string;
}

// API response types
export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

// Component props types
export interface ITableProps<T> {
  data: T[];
  columns: ITableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
}

export interface ITableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

// Chart types
export interface IChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
