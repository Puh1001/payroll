export enum CacheMetadataKey {
  KEY = 'cache:key',
  TTL = 'cache:ttl',
  EXCLUDE_PATHS = 'cache:exclude_paths',
}

export const DEFAULT_CACHE_TTL = 3600; // 1 hour in seconds

export const CACHE_PREFIX = {
  EMPLOYEE: 'employee',
  DEPARTMENT: 'department',
  BRANCH: 'branch',
  PAYROLL: 'payroll',
  ATTENDANCE: 'attendance',
} as const;

export const CACHE_PATTERNS = {
  EMPLOYEE_ALL: `${CACHE_PREFIX.EMPLOYEE}:all`,
  EMPLOYEE_BY_ID: (id: string) => `${CACHE_PREFIX.EMPLOYEE}:${id}`,
  EMPLOYEE_BY_BRANCH: (branchId: string) =>
    `${CACHE_PREFIX.EMPLOYEE}:branch:${branchId}`,
  EMPLOYEE_BY_DEPARTMENT: (deptId: string) =>
    `${CACHE_PREFIX.EMPLOYEE}:department:${deptId}`,
  DEPARTMENT_ALL: `${CACHE_PREFIX.DEPARTMENT}:all`,
  DEPARTMENT_BY_ID: (id: string) => `${CACHE_PREFIX.DEPARTMENT}:${id}`,
  BRANCH_ALL: `${CACHE_PREFIX.BRANCH}:all`,
  BRANCH_BY_ID: (id: string) => `${CACHE_PREFIX.BRANCH}:${id}`,
  PAYROLL_BY_PERIOD: (periodId: string) =>
    `${CACHE_PREFIX.PAYROLL}:period:${periodId}`,
  PAYROLL_BY_EMPLOYEE: (employeeId: string) =>
    `${CACHE_PREFIX.PAYROLL}:employee:${employeeId}`,
  ATTENDANCE_BY_BATCH: (batchId: string) =>
    `${CACHE_PREFIX.ATTENDANCE}:batch:${batchId}`,
  ATTENDANCE_BY_EMPLOYEE: (employeeId: string) =>
    `${CACHE_PREFIX.ATTENDANCE}:employee:${employeeId}`,
} as const;
