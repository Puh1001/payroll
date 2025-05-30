-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle soft delete
CREATE OR REPLACE FUNCTION handle_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate salary formula
CREATE OR REPLACE FUNCTION validate_salary_formula()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra xem expression có chứa các thành phần hợp lệ không
    IF NEW.expression !~ '^[a-zA-Z0-9\+\-\*\/\(\)\s]+$' THEN
        RAISE EXCEPTION 'Invalid formula expression';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate payroll calculation
CREATE OR REPLACE FUNCTION validate_payroll_calculation()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra tổng thu nhập phải lớn hơn hoặc bằng tổng khấu trừ
    IF NEW.total_earnings < NEW.total_deductions THEN
        RAISE EXCEPTION 'Total earnings cannot be less than total deductions';
    END IF;
    
    -- Kiểm tra lương net phải bằng tổng thu nhập trừ tổng khấu trừ
    IF NEW.net_salary != (NEW.total_earnings - NEW.total_deductions) THEN
        RAISE EXCEPTION 'Net salary must equal total earnings minus total deductions';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to validate attendance record
CREATE OR REPLACE FUNCTION validate_attendance_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra số ngày công hiệu quả không được lớn hơn số ngày công đã kiểm tra
    IF NEW.effective_work_days > NEW.checked_work_days THEN
        RAISE EXCEPTION 'Effective work days cannot be greater than checked work days';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER update_branch_updated_at
    BEFORE UPDATE ON branch
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_updated_at
    BEFORE UPDATE ON department
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_position_updated_at
    BEFORE UPDATE ON position
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_updated_at
    BEFORE UPDATE ON employee
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_record_updated_at
    BEFORE UPDATE ON attendance_record
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_leave_updated_at
    BEFORE UPDATE ON attendance_leave
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_overtime_updated_at
    BEFORE UPDATE ON attendance_overtime
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_workdays_updated_at
    BEFORE UPDATE ON attendance_workdays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salary_component_updated_at
    BEFORE UPDATE ON salary_component
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salary_formula_updated_at
    BEFORE UPDATE ON salary_formula
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pay_period_updated_at
    BEFORE UPDATE ON pay_period
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
    BEFORE UPDATE ON payroll
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_detail_updated_at
    BEFORE UPDATE ON payroll_detail
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply soft delete trigger to all tables with deleted_at
CREATE TRIGGER soft_delete_branch
    BEFORE UPDATE OF deleted_at ON branch
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_department
    BEFORE UPDATE OF deleted_at ON department
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_position
    BEFORE UPDATE OF deleted_at ON position
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_employee
    BEFORE UPDATE OF deleted_at ON employee
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_attendance_record
    BEFORE UPDATE OF deleted_at ON attendance_record
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_attendance_leave
    BEFORE UPDATE OF deleted_at ON attendance_leave
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_attendance_overtime
    BEFORE UPDATE OF deleted_at ON attendance_overtime
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_attendance_workdays
    BEFORE UPDATE OF deleted_at ON attendance_workdays
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_salary_component
    BEFORE UPDATE OF deleted_at ON salary_component
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_salary_formula
    BEFORE UPDATE OF deleted_at ON salary_formula
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_pay_period
    BEFORE UPDATE OF deleted_at ON pay_period
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_payroll
    BEFORE UPDATE OF deleted_at ON payroll
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER soft_delete_payroll_detail
    BEFORE UPDATE OF deleted_at ON payroll_detail
    FOR EACH ROW
    WHEN (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
    EXECUTE FUNCTION handle_soft_delete();

-- Apply validation triggers
CREATE TRIGGER validate_salary_formula_trigger
    BEFORE INSERT OR UPDATE ON salary_formula
    FOR EACH ROW
    EXECUTE FUNCTION validate_salary_formula();

CREATE TRIGGER validate_payroll_calculation_trigger
    BEFORE INSERT OR UPDATE ON payroll
    FOR EACH ROW
    EXECUTE FUNCTION validate_payroll_calculation();

CREATE TRIGGER validate_attendance_record_trigger
    BEFORE INSERT OR UPDATE ON attendance_record
    FOR EACH ROW
    EXECUTE FUNCTION validate_attendance_record();

-- Additional indexes for performance optimization
CREATE INDEX idx_employee_status ON employee(status);
CREATE INDEX idx_employee_join_date ON employee(join_date);
CREATE INDEX idx_employee_termination_date ON employee(termination_date);

CREATE INDEX idx_attendance_batch_status ON attendance_batch(status);
CREATE INDEX idx_attendance_batch_uploaded_at ON attendance_batch(uploaded_at);

CREATE INDEX idx_attendance_record_status ON attendance_record(status);
CREATE INDEX idx_attendance_record_join_date ON attendance_record(join_date);

CREATE INDEX idx_pay_period_status ON pay_period(status);
CREATE INDEX idx_pay_period_dates ON pay_period(start_date, end_date);
CREATE INDEX idx_pay_period_cutoff ON pay_period(cutoff_date);

CREATE INDEX idx_payroll_status ON payroll(status);
CREATE INDEX idx_payroll_calculated_at ON payroll(calculated_at);
CREATE INDEX idx_payroll_approved_at ON payroll(approved_at);

CREATE INDEX idx_complaint_status ON complaint(status);
CREATE INDEX idx_complaint_lodged_at ON complaint(lodged_at);
CREATE INDEX idx_complaint_resolved_at ON complaint(resolved_at);

CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(revoked);

-- Partial indexes for active records
CREATE INDEX idx_active_employee ON employee(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_department ON department(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_position ON position(position_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_salary_component ON salary_component(component_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_salary_formula ON salary_formula(formula_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_pay_period ON pay_period(pay_period_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_active_payroll ON payroll(payroll_id) WHERE deleted_at IS NULL; 