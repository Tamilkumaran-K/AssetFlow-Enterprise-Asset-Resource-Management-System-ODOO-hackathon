/**
 * AssetFlow Supabase Seed Script
 * Run with: node scripts/seed-supabase.js
 * 
 * Seeds all mock data into Supabase using valid UUID formats.
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ─── UUID Identifiers ──────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { id: 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', name: 'Engineering' },
  { id: 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', name: 'Design' },
  { id: 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', name: 'Marketing' },
  { id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', name: 'IT Ops' },
  { id: 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d5d5', name: 'Finance' },
  { id: 'd6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d6d6', name: 'HR' },
]

const CATEGORIES = [
  { id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Laptop' },
  { id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Projector' },
  { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Vehicle' },
  { id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'Meeting Room' },
  { id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Camera' },
  { id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Monitor' },
  { id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Tablet' },
]

const PROFILES = [
  { id: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', name: 'Priya Shah',    email: 'priya@assetflow.io',   role: 'Admin',    department_id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', status: 'Active' },
  { id: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2-e2e2e2e2', name: 'Rahul Iyer',   email: 'rahul@assetflow.io',   role: 'Manager',  department_id: 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', status: 'Active' },
  { id: 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3-e3e3e3e3', name: 'Ananya Patel', email: 'ananya@assetflow.io',  role: 'Manager',  department_id: 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', status: 'Active' },
  { id: 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4-e4e4e4e4', name: 'Vikram Singh', email: 'vikram@assetflow.io',  role: 'Employee', department_id: 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', status: 'Active' },
  { id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5-e5e5e5e5', name: 'Karthik Rao',  email: 'karthik@assetflow.io', role: 'Employee', department_id: 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d5d5', status: 'Active' },
  { id: 'e6e6e6e6-e6e6-e6e6-e6e6-e6e6-e6e6e6e6', name: 'Meera Nair',   email: 'meera@assetflow.io',   role: 'Employee', department_id: 'd6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d6d6', status: 'Active' },
  { id: 'e7e7e7e7-e7e7-e7e7-e7e7-e7e7-e7e7e7e7', name: 'Arjun Mehta',  email: 'arjun@assetflow.io',   role: 'Employee', department_id: 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', status: 'Active' },
  { id: 'e8e8e8e8-e8e8-e8e8-e8e8-e8e8-e8e8e8e8', name: 'Sneha Kapoor', email: 'sneha@assetflow.io',   role: 'Employee', department_id: 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', status: 'Active' },
]

const ASSETS = [
  { id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',  asset_tag: 'AF-0114', name: 'MacBook Pro 16"',        category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', status: 'Allocated',    location: 'HQ - Floor 3',   serial_number: 'C02XF1YZLVDL',  condition: 'Good', acquisition_date: '2023-01-15', acquisition_cost: 3499.00 },
  { id: 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2-a2a2a2a2',  asset_tag: 'AF-0062', name: 'Epson EB-U05 Projector', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2-c2c2c2c2', status: 'Under Maintenance', location: 'HQ - Room B2', serial_number: 'PROJ-2451',  condition: 'Fair', acquisition_date: '2022-06-10', acquisition_cost: 799.00  },
  { id: 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3',  asset_tag: 'AF-0031', name: 'Dell XPS 15',            category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', status: 'Available',    location: 'HQ - IT Store',  serial_number: 'DXP-99120',     condition: 'Good', acquisition_date: '2023-03-20', acquisition_cost: 1999.00 },
  { id: 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4',  asset_tag: 'AF-0301', name: 'Sony A7 IV',             category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5-c5c5c5c5', status: 'Available',    location: 'HQ - Studio',    serial_number: 'SONY-A7IV-771', condition: 'New',  acquisition_date: '2024-01-05', acquisition_cost: 2799.00 },
  { id: 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5-a5a5-a5a5',  asset_tag: 'AF-0088', name: 'Toyota Innova',          category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3-c3c3c3c3', status: 'Allocated',    location: 'HQ - Parking',   serial_number: 'MH12-XY-1288',  condition: 'Good', acquisition_date: '2021-09-01', acquisition_cost: 22000.00},
  { id: 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6-a6a6a6a6',  asset_tag: 'AF-0202', name: 'Room B2 - Boardroom',    category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4-c4c4c4c4', status: 'Available',    location: 'HQ - Floor 2',   serial_number: 'ROOM-B2',       condition: 'Good', acquisition_date: '2020-01-01', acquisition_cost: 0,      is_shared_bookable: true },
  { id: 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7-a7a7a7a7',  asset_tag: 'AF-0115', name: 'MacBook Air M3',         category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1-c1c1c1c1', status: 'Allocated',    location: 'HQ - Floor 3',   serial_number: 'C02AIR-M3-991', condition: 'New',  acquisition_date: '2024-02-10', acquisition_cost: 1499.00 },
  { id: 'a8a8a8a8-a8a8-a8a8-a8a8-a8a8-a8a8a8a8',  asset_tag: 'AF-0044', name: 'LG UltraFine 4K',        category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6-c6c6c6c6', status: 'Available',    location: 'HQ - IT Store',  serial_number: 'LG-UF4K-2210',  condition: 'Good', acquisition_date: '2022-11-15', acquisition_cost: 999.00  },
  { id: 'a9a9a9a9-a9a9-a9a9-a9a9-a9a9-a9a9-a9a9',  asset_tag: 'AF-0210', name: 'iPad Pro 12.9"',         category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7-c7c7c7c7', status: 'Allocated',    location: 'HQ - Floor 4',   serial_number: 'IPAD-129-5522', condition: 'Good', acquisition_date: '2023-07-20', acquisition_cost: 1099.00 },
  { id: 'a10a10a1-a10a-10a1-10a1-10a10a10a10a', asset_tag: 'AF-0055', name: 'BenQ 4K Projector',      category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2-c2c2c2c2', status: 'Available',    location: 'HQ - Storage',   serial_number: 'BENQ-4K-2019',  condition: 'Fair', acquisition_date: '2019-05-05', acquisition_cost: 649.00  },
  { id: 'a11a11a1-a11a-11a1-11a1-11a11a11a11a', asset_tag: 'AF-0400', name: 'Room A1 - Focus Pod',    category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4-c4c4c4c4', status: 'Available',    location: 'HQ - Floor 1',   serial_number: 'ROOM-A1',       condition: 'Good', acquisition_date: '2020-01-01', acquisition_cost: 0,      is_shared_bookable: true },
  { id: 'a12a12a1-a12a-12a1-12a1-12a12a12a12a', asset_tag: 'AF-0032', name: 'ThinkPad X1 Carbon',     category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1-c1c1c1c1', status: 'Allocated',    location: 'Remote',         serial_number: 'TP-X1C-7712',   condition: 'Good', acquisition_date: '2022-08-01', acquisition_cost: 1799.00 },
  { id: 'a13a13a1-a13a-13a1-13a1-13a13a13a13a', asset_tag: 'AF-0501', name: 'Honda City',             category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3-c3c3c3c3', status: 'Available',    location: 'HQ - Parking',   serial_number: 'MH12-CI-4001',  condition: 'Good', acquisition_date: '2022-03-10', acquisition_cost: 14000.00},
  { id: 'a14a14a1-a14a-14a1-14a1-14a14a14a14a', asset_tag: 'AF-0121', name: 'MacBook Pro 14"',        category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1-c1c1c1c1', status: 'Available',    location: 'HQ - IT Store',  serial_number: 'C02MBP14-889',  condition: 'Good', acquisition_date: '2023-11-05', acquisition_cost: 1999.00 },
  { id: 'a15a15a1-a15a-15a1-15a1-15a15a15a15a', asset_tag: 'AF-0089', name: 'DJI Ronin 4D',           category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5-c5c5c5c5', status: 'Allocated',    location: 'HQ - Studio',    serial_number: 'DJI-R4D-101',   condition: 'Good', acquisition_date: '2024-03-15', acquisition_cost: 3499.00 },
  { id: 'a16a16a1-a16a-16a1-16a1-16a16a16a16a', asset_tag: 'AF-0203', name: 'Room B3 - War Room',     category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4-c4c4c4c4', status: 'Under Maintenance', location: 'HQ - Floor 2', serial_number: 'ROOM-B3', condition: 'Fair', acquisition_date: '2020-01-01', acquisition_cost: 0,      is_shared_bookable: true },
]

const ALLOCATIONS = [
  { id: 'b0a10ca0-de10-410a-ba10-000000000001', asset_id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',  assigned_to_employee_id: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', allocation_date: '2025-02-11', status: 'Active' },
  { id: 'b0a10ca0-de10-410a-ba10-000000000002', asset_id: 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5-a5a5-a5a5',  assigned_to_employee_id: 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', allocation_date: '2025-05-04', status: 'Active' },
  { id: 'b0a10ca0-de10-410a-ba10-000000000003', asset_id: 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7-a7a7-a7a7',  assigned_to_employee_id: 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3-e3e3e3e3', allocation_date: '2025-01-20', status: 'Active' },
  { id: 'b0a10ca0-de10-410a-ba10-000000000004', asset_id: 'a9a9a9a9-a9a9-a9a9-a9a9-a9a9-a9a9-a9a9',  assigned_to_employee_id: 'e7e7e7e7-e7e7-e7e7-e7e7-e7e7-e7e7-e7e7', allocation_date: '2024-11-11', status: 'Active' },
  { id: 'b0a10ca0-de10-410a-ba10-000000000005', asset_id: 'a12a12a1-a12a-12a1-12a1-12a12a12a12a', assigned_to_employee_id: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2-e2e2e2e2', allocation_date: '2024-08-01', status: 'Active' },
  { id: 'b0a10ca0-de10-410a-ba10-000000000006', asset_id: 'a15a15a1-a15a-15a1-15a1-15a15a15a15a', assigned_to_employee_id: 'e8e8e8e8-e8e8-e8e8-e8e8-e8e8-e8e8e8e8', allocation_date: '2025-03-15', status: 'Active' },
]

const MAINTENANCE_REQUESTS = [
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0001', asset_id: 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2-a2a2-a2a2',  raised_by: 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', issue_description: 'Lamp flickering during use',       priority: 'High',   status: 'Pending',               created_at: '2025-06-02T09:00:00Z' },
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0002', asset_id: 'a16a16a1-a16a-16a1-16a1-16a16a16a16a', raised_by: 'e6e6e6e6-e6e6-e6e6-e6e6-e6e6-e6e6-e6e6', issue_description: 'AC not cooling below 26°C',        priority: 'Medium', status: 'Approved',              created_at: '2025-06-04T11:00:00Z' },
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0003', asset_id: 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5-a5a5-a5a5',  raised_by: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', issue_description: 'Service due — 30,000 km',          priority: 'Low',    status: 'Technician Assigned',   assigned_technician: 'MotorHub Garage', created_at: '2025-06-05T08:00:00Z' },
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0004', asset_id: 'a14a14a1-a14a-14a1-14a1-14a14a14a14a', raised_by: 'e8e8e8e8-e8e8-e8e8-e8e8-e8e8-e8e8-e8e8', issue_description: 'Battery drains rapidly',           priority: 'Medium', status: 'In Progress',           assigned_technician: 'Apple Care',      created_at: '2025-06-01T14:00:00Z' },
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0005', asset_id: 'a12a12a1-a12a-12a1-12a1-12a12a12a12a', raised_by: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2-e2e2-e2e2', issue_description: 'Keyboard keys stuck',              priority: 'Low',    status: 'In Progress',           assigned_technician: 'Lenovo Service',  created_at: '2025-05-30T10:00:00Z' },
  { id: 'fa1ca0fa-a1ca-fa1c-a1ca-fa1ca1ca0006', asset_id: 'a8a8a8a8-a8a8-a8a8-a8a8-a8a8-a8a8-a8a8',  raised_by: 'e7e7e7e7-e7e7-e7e7-e7e7-e7e7-e7e7-e7e7', issue_description: 'HDMI port replaced',               priority: 'Medium', status: 'Resolved',              created_at: '2025-05-24T09:00:00Z' },
]

function getDate(daysFromNow, hour) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

const BOOKINGS = [
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000001', asset_id: 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6-a6a6a6a6',  booked_by: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', start_time: getDate(0, 10), end_time: getDate(0, 11), status: 'Upcoming' },
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000002', asset_id: 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6-a6a6a6a6',  booked_by: 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2-e2e2-e2e2', start_time: getDate(0, 14), end_time: getDate(0, 15), status: 'Upcoming' },
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000003', asset_id: 'a11a11a1-a11a-11a1-11a1-11a11a11a11a', booked_by: 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3-e3e3-e3e3', start_time: getDate(1, 9),  end_time: getDate(1, 10), status: 'Upcoming' },
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000004', asset_id: 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6-a6a6a6a6',  booked_by: 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4-e4e4-e4e4', start_time: getDate(2, 13), end_time: getDate(2, 15), status: 'Upcoming' },
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000005', asset_id: 'a11a11a1-a11a-11a1-11a1-11a11a11a11a', booked_by: 'e7e7e7e7-e7e7-e7e7-e7e7-e7e7-e7e7-e7e7', start_time: getDate(3, 11), end_time: getDate(3, 12), status: 'Upcoming' },
  { id: 'ba0ca0ba-a0ba-0000-0000-000000000006', asset_id: 'a10a10a1-a10a-10a1-10a1-10a10a10a10a', booked_by: 'e6e6e6e6-e6e6-e6e6-e6e6-e6e6-e6e6-e6e6', start_time: getDate(1, 15), end_time: getDate(1, 17), status: 'Upcoming' },
]

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedTable(tableName, data, label) {
  console.log(`\n📦 Seeding ${label}...`)
  
  const { error: delErr } = await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delErr) {
    console.log(`   ⚠  Could not clear ${tableName}: ${delErr.message}`)
  }

  const { error } = await supabase.from(tableName).insert(data)
  if (error) {
    console.error(`   ❌ Failed to seed ${label}: ${error.message}`)
    return false
  }
  console.log(`   ✅ Seeded ${data.length} ${label}`)
  return true
}

async function main() {
  console.log('🌱 AssetFlow Supabase Seeder')
  console.log('━'.repeat(50))
  console.log(`📡 URL: ${supabaseUrl}`)
  console.log('━'.repeat(50))

  await seedTable('departments', DEPARTMENTS, 'Departments')
  await seedTable('asset_categories', CATEGORIES, 'Asset Categories')
  await seedTable('profiles', PROFILES, 'Profiles (Employees)')

  const assetData = ASSETS.map(a => ({
    id: a.id,
    asset_tag: a.asset_tag,
    name: a.name,
    category_id: a.category_id,
    status: a.status,
    location: a.location,
    serial_number: a.serial_number,
    condition: a.condition,
    acquisition_date: a.acquisition_date,
    acquisition_cost: a.acquisition_cost || null,
    is_shared_bookable: a.is_shared_bookable || false,
  }))
  await seedTable('assets', assetData, 'Assets')

  const allocData = ALLOCATIONS.map(al => ({
    id: al.id,
    asset_id: al.asset_id,
    assigned_to_employee_id: al.assigned_to_employee_id,
    allocation_date: al.allocation_date,
    status: al.status,
    allocated_by: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1', // Admin ID
  }))
  await seedTable('allocations', allocData, 'Allocations')

  const maintData = MAINTENANCE_REQUESTS.map(m => ({
    id: m.id,
    asset_id: m.asset_id,
    raised_by: m.raised_by,
    issue_description: m.issue_description,
    priority: m.priority,
    status: m.status,
    assigned_technician: m.assigned_technician || null,
    created_at: m.created_at,
  }))
  await seedTable('maintenance_requests', maintData, 'Maintenance Requests')
  await seedTable('bookings', BOOKINGS, 'Bookings')

  console.log('\n━'.repeat(50))
  console.log('✅ Seeding complete!\n')
}

main().catch(err => {
  console.error('💥 Fatal error:', err)
  process.exit(1)
})
