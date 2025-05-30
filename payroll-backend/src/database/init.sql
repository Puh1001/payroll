-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: branch
CREATE TABLE branch (
  branch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: department
CREATE TABLE department (
  department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: position
CREATE TABLE position (
  position_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: employee
CREATE TABLE employee (
  employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branch(branch_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  position_id UUID NOT NULL REFERENCES position(position_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  department_id UUID NOT NULL REFERENCES department(department_id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  card_id VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  base_salary NUMERIC NOT NULL,
  status VARCHAR(255) NOT NULL,
  join_date DATE NOT NULL,
  termination_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_employee_branch ON employee(branch_id);
CREATE INDEX idx_employee_department ON employee(department_id);
CREATE INDEX idx_employee_position ON employee(position_id);

-- Table: attendance_batch
CREATE TABLE attendance_batch (
  attendance_batch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE,
  uploaded_by VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_name TEXT NOT NULL,
  status VARCHAR(255) NOT NULL
);
CREATE INDEX idx_attbatch_branch ON attendance_batch(branch_id);

-- Table: attendance_record
CREATE TABLE attendance_record (
  attendance_record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_batch_id UUID NOT NULL REFERENCES attendance_batch(attendance_batch_id) ON UPDATE CASCADE ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employee(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  join_date DATE NOT NULL,
  checked_work_days NUMERIC NOT NULL,
  effective_work_days NUMERIC NOT NULL,
  status VARCHAR(255) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_attrec_batch ON attendance_record(attendance_batch_id);
CREATE INDEX idx_attrec_employee ON attendance_record(employee_id);

-- Table: attendance_leave
CREATE TABLE attendance_leave (
  attendance_leave_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_record_id UUID NOT NULL REFERENCES attendance_record(attendance_record_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  leave_type VARCHAR(255) NOT NULL,
  day_count NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_attleave_record ON attendance_leave(attendance_record_id);

-- Table: attendance_overtime
CREATE TABLE attendance_overtime (
  attendance_overtime_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_record_id UUID NOT NULL REFERENCES attendance_record(attendance_record_id) ON UPDATE CASCADE ON DELETE CASCADE,
  ot_type VARCHAR(255) NOT NULL,
  hour_count NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_attovertime_record ON attendance_overtime(attendance_record_id);

-- Table: attendance_workdays
CREATE TABLE attendance_workdays (
  attendance_workdays_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_record_id UUID NOT NULL REFERENCES attendance_record(attendance_record_id) ON UPDATE CASCADE ON DELETE CASCADE,
  work_type VARCHAR(255) NOT NULL,
  day_count NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_attwork_record ON attendance_workdays(attendance_record_id);

-- Table: salary_component
CREATE TABLE salary_component (
  component_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branch(branch_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  description TEXT,
  is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_comp_branch ON salary_component(branch_id);

-- Table: salary_component_history
CREATE TABLE salary_component_history (
  history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_id UUID NOT NULL REFERENCES salary_component(component_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  old_value NUMERIC NOT NULL,
  new_value NUMERIC NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT
);
CREATE INDEX idx_comphist_component ON salary_component_history(component_id);

-- Table: salary_formula
CREATE TABLE salary_formula (
  formula_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branch(branch_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  expression TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_formula_branch ON salary_formula(branch_id);
CREATE UNIQUE INDEX uq_formula_branch_name_version ON salary_formula(branch_id, name, version);

-- Table: pay_period
CREATE TABLE pay_period (
  pay_period_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_code VARCHAR(255) NOT NULL,
  period_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cutoff_date DATE NOT NULL,
  status VARCHAR(255) NOT NULL,
  is_locked BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Table: payroll
CREATE TABLE payroll (
  payroll_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pay_period_id UUID NOT NULL REFERENCES pay_period(pay_period_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  employee_id UUID NOT NULL REFERENCES employee(employee_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  formula_id UUID NOT NULL REFERENCES salary_formula(formula_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  total_earnings NUMERIC NOT NULL,
  total_deductions NUMERIC NOT NULL,
  net_salary NUMERIC NOT NULL,
  status VARCHAR(255) NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL,
  approved_by VARCHAR(255) NOT NULL,
  approved_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_payroll_employee_period ON payroll(employee_id, pay_period_id);
CREATE UNIQUE INDEX uq_payroll_emp_period ON payroll(employee_id, pay_period_id);

-- Table: payroll_detail
CREATE TABLE payroll_detail (
  payroll_detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_id UUID NOT NULL REFERENCES payroll(payroll_id) ON UPDATE CASCADE ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES salary_component(component_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  amount NUMERIC NOT NULL,
  source_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_paydetail_payroll ON payroll_detail(payroll_id);

-- Table: complaint
CREATE TABLE complaint (
  complaint_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payroll_id UUID NOT NULL REFERENCES payroll(payroll_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  employee_id UUID NOT NULL REFERENCES employee(employee_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  description TEXT NOT NULL,
  status VARCHAR(255) NOT NULL,
  lodged_at TIMESTAMPTZ NOT NULL,
  resolved_by VARCHAR(255),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_complaint_payroll ON complaint(payroll_id);
CREATE INDEX idx_complaint_employee ON complaint(employee_id);

-- Table: refresh_tokens
CREATE TABLE refresh_tokens (
  refresh_token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES employee(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  token TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_reftoken_user ON refresh_tokens(user_id); 