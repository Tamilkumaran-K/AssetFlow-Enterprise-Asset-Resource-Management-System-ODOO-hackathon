-- AssetFlow Database Schema (Supabase / PostgreSQL)

-- ENUMS
CREATE TYPE user_role AS ENUM ('Admin', 'Asset Manager', 'Department Head', 'Employee');
CREATE TYPE entity_status AS ENUM ('Active', 'Inactive');
CREATE TYPE asset_status AS ENUM ('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed');
CREATE TYPE allocation_status AS ENUM ('Active', 'Returned');
CREATE TYPE transfer_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE booking_status AS ENUM ('Upcoming', 'Ongoing', 'Completed', 'Cancelled');
CREATE TYPE maintenance_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE maintenance_status AS ENUM ('Pending', 'Approved', 'Rejected', 'In Progress', 'Resolved');
CREATE TYPE audit_cycle_status AS ENUM ('Open', 'Closed');
CREATE TYPE audit_record_status AS ENUM ('Verified', 'Missing', 'Damaged');

-- TABLES

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    status entity_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (Employee Directory)
-- Assumes auth.users provides the basic identity, but we keep profile info here.
-- In a real setup, id would be `id UUID PRIMARY KEY REFERENCES auth.users(id)`
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'Employee',
    status entity_status NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add head_id to departments after profiles is created
ALTER TABLE departments ADD COLUMN head_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Asset Categories
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    metadata_schema JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES asset_categories(id) ON DELETE RESTRICT,
    asset_tag TEXT NOT NULL UNIQUE,
    serial_number TEXT,
    acquisition_date DATE,
    acquisition_cost NUMERIC(12, 2),
    condition TEXT,
    location TEXT,
    is_shared_bookable BOOLEAN NOT NULL DEFAULT FALSE,
    status asset_status NOT NULL DEFAULT 'Available',
    metadata JSONB,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allocations
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    assigned_to_employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_to_department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    allocated_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    allocation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expected_return_date TIMESTAMPTZ,
    return_date TIMESTAMPTZ,
    status allocation_status NOT NULL DEFAULT 'Active',
    check_in_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT must_have_assignee CHECK (assigned_to_employee_id IS NOT NULL OR assigned_to_department_id IS NOT NULL)
);

-- Transfer Requests
CREATE TABLE transfer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    from_employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    from_department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    to_employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    to_department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    status transfer_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    booked_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status booking_status NOT NULL DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Maintenance Requests
CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    issue_description TEXT NOT NULL,
    priority maintenance_priority NOT NULL DEFAULT 'Medium',
    photo_url TEXT,
    status maintenance_status NOT NULL DEFAULT 'Pending',
    assigned_technician TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Cycles
CREATE TABLE audit_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    scope_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    scope_location TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status audit_cycle_status NOT NULL DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Assignments
CREATE TABLE audit_assignments (
    audit_cycle_id UUID NOT NULL REFERENCES audit_cycles(id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (audit_cycle_id, auditor_id)
);

-- Audit Records
CREATE TABLE audit_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_cycle_id UUID NOT NULL REFERENCES audit_cycles(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status audit_record_status NOT NULL DEFAULT 'Verified',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
