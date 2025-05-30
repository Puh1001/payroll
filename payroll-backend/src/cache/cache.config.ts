import { CACHE_PATTERNS } from './cache.constants';

export const CACHE_CONFIG = {
  // Employee APIs
  EMPLOYEE: {
    LIST: {
      key: CACHE_PATTERNS.EMPLOYEE_ALL,
      ttl: 1800, // 30 minutes
      excludePaths: [
        '/api/employees/create',
        '/api/employees/update',
        '/api/employees/delete',
      ],
    },
    DETAIL: {
      key: (id: string) => CACHE_PATTERNS.EMPLOYEE_BY_ID(id),
      ttl: 3600, // 1 hour
      excludePaths: ['/api/employees/update', '/api/employees/delete'],
    },
    BY_BRANCH: {
      key: (branchId: string) => CACHE_PATTERNS.EMPLOYEE_BY_BRANCH(branchId),
      ttl: 1800,
      excludePaths: ['/api/employees/update', '/api/employees/delete'],
    },
    BY_DEPARTMENT: {
      key: (deptId: string) => CACHE_PATTERNS.EMPLOYEE_BY_DEPARTMENT(deptId),
      ttl: 1800,
      excludePaths: ['/api/employees/update', '/api/employees/delete'],
    },
  },

  // Department APIs
  DEPARTMENT: {
    LIST: {
      key: CACHE_PATTERNS.DEPARTMENT_ALL,
      ttl: 3600,
      excludePaths: [
        '/api/departments/create',
        '/api/departments/update',
        '/api/departments/delete',
      ],
    },
    DETAIL: {
      key: (id: string) => CACHE_PATTERNS.DEPARTMENT_BY_ID(id),
      ttl: 3600,
      excludePaths: ['/api/departments/update', '/api/departments/delete'],
    },
  },

  // Branch APIs
  BRANCH: {
    LIST: {
      key: CACHE_PATTERNS.BRANCH_ALL,
      ttl: 3600,
      excludePaths: [
        '/api/branches/create',
        '/api/branches/update',
        '/api/branches/delete',
      ],
    },
    DETAIL: {
      key: (id: string) => CACHE_PATTERNS.BRANCH_BY_ID(id),
      ttl: 3600,
      excludePaths: ['/api/branches/update', '/api/branches/delete'],
    },
  },

  // Payroll APIs
  PAYROLL: {
    BY_PERIOD: {
      key: (periodId: string) => CACHE_PATTERNS.PAYROLL_BY_PERIOD(periodId),
      ttl: 1800,
      excludePaths: [
        '/api/payroll/calculate',
        '/api/payroll/approve',
        '/api/payroll/reject',
        '/api/payroll/update',
      ],
    },
    BY_EMPLOYEE: {
      key: (employeeId: string) =>
        CACHE_PATTERNS.PAYROLL_BY_EMPLOYEE(employeeId),
      ttl: 1800,
      excludePaths: [
        '/api/payroll/calculate',
        '/api/payroll/approve',
        '/api/payroll/reject',
        '/api/payroll/update',
      ],
    },
  },

  // Attendance APIs
  ATTENDANCE: {
    BY_BATCH: {
      key: (batchId: string) => CACHE_PATTERNS.ATTENDANCE_BY_BATCH(batchId),
      ttl: 900, // 15 minutes
      excludePaths: [
        '/api/attendance/import',
        '/api/attendance/approve',
        '/api/attendance/reject',
        '/api/attendance/update',
      ],
    },
    BY_EMPLOYEE: {
      key: (employeeId: string) =>
        CACHE_PATTERNS.ATTENDANCE_BY_EMPLOYEE(employeeId),
      ttl: 900,
      excludePaths: [
        '/api/attendance/import',
        '/api/attendance/approve',
        '/api/attendance/reject',
        '/api/attendance/update',
      ],
    },
  },
} as const;
