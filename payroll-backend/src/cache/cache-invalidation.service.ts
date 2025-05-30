import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CACHE_PATTERNS } from './cache.constants';

@Injectable()
export class CacheInvalidationService {
  private readonly logger = new Logger(CacheInvalidationService.name);

  constructor(private readonly cacheService: CacheService) {}

  /**
   * Invalidate employee related caches
   */
  async invalidateEmployeeCache(employeeId?: string) {
    try {
      if (employeeId) {
        // Invalidate specific employee cache
        await this.cacheService.del(CACHE_PATTERNS.EMPLOYEE_BY_ID(employeeId));
      }
      // Invalidate all employees cache
      await this.cacheService.delByPattern('employee:*');
      this.logger.debug('Employee cache invalidated successfully');
    } catch (error) {
      this.logger.error(`Error invalidating employee cache: ${error.message}`);
    }
  }

  /**
   * Invalidate department related caches
   */
  async invalidateDepartmentCache(departmentId?: string) {
    try {
      if (departmentId) {
        // Invalidate specific department cache
        await this.cacheService.del(
          CACHE_PATTERNS.DEPARTMENT_BY_ID(departmentId),
        );
      }
      // Invalidate all departments cache
      await this.cacheService.delByPattern('department:*');
      // Also invalidate employee caches as they might be affected
      await this.invalidateEmployeeCache();
      this.logger.debug('Department cache invalidated successfully');
    } catch (error) {
      this.logger.error(
        `Error invalidating department cache: ${error.message}`,
      );
    }
  }

  /**
   * Invalidate branch related caches
   */
  async invalidateBranchCache(branchId?: string) {
    try {
      if (branchId) {
        // Invalidate specific branch cache
        await this.cacheService.del(CACHE_PATTERNS.BRANCH_BY_ID(branchId));
      }
      // Invalidate all branches cache
      await this.cacheService.delByPattern('branch:*');
      // Also invalidate employee caches as they might be affected
      await this.invalidateEmployeeCache();
      this.logger.debug('Branch cache invalidated successfully');
    } catch (error) {
      this.logger.error(`Error invalidating branch cache: ${error.message}`);
    }
  }

  /**
   * Invalidate payroll related caches
   */
  async invalidatePayrollCache(periodId?: string, employeeId?: string) {
    try {
      if (periodId) {
        await this.cacheService.del(CACHE_PATTERNS.PAYROLL_BY_PERIOD(periodId));
      }
      if (employeeId) {
        await this.cacheService.del(
          CACHE_PATTERNS.PAYROLL_BY_EMPLOYEE(employeeId),
        );
      }
      // Invalidate all payroll cache if no specific IDs provided
      if (!periodId && !employeeId) {
        await this.cacheService.delByPattern('payroll:*');
      }
      this.logger.debug('Payroll cache invalidated successfully');
    } catch (error) {
      this.logger.error(`Error invalidating payroll cache: ${error.message}`);
    }
  }

  /**
   * Invalidate attendance related caches
   */
  async invalidateAttendanceCache(batchId?: string, employeeId?: string) {
    try {
      if (batchId) {
        await this.cacheService.del(
          CACHE_PATTERNS.ATTENDANCE_BY_BATCH(batchId),
        );
      }
      if (employeeId) {
        await this.cacheService.del(
          CACHE_PATTERNS.ATTENDANCE_BY_EMPLOYEE(employeeId),
        );
      }
      // Invalidate all attendance cache if no specific IDs provided
      if (!batchId && !employeeId) {
        await this.cacheService.delByPattern('attendance:*');
      }
      this.logger.debug('Attendance cache invalidated successfully');
    } catch (error) {
      this.logger.error(
        `Error invalidating attendance cache: ${error.message}`,
      );
    }
  }
}
