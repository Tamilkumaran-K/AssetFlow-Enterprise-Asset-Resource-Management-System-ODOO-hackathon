const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');

try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = ['Laptop', 'Projector', 'Vehicle', 'Meeting Room', 'Camera', 'Monitor', 'Tablet']
const DEPARTMENTS = [
  { name: 'Engineering', head: 'Rahul Iyer' },
  { name: 'Design', head: 'Ananya Patel' },
  { name: 'Marketing', head: 'Vikram Singh' },
  { name: 'IT Ops', head: 'Priya Shah' },
  { name: 'Finance', head: 'Karthik Rao' },
  { name: 'HR', head: 'Meera Nair' },
]
const EMPLOYEES = [
  { name: 'Priya Shah', dept: 'IT Ops', role: 'Admin' },
  { name: 'Rahul Iyer', dept: 'Engineering', role: 'Manager' },
  { name: 'Ananya Patel', dept: 'Design', role: 'Manager' },
  { name: 'Vikram Singh', dept: 'Marketing', role: 'Employee' },
  { name: 'Karthik Rao', dept: 'Finance', role: 'Employee' },
  { name: 'Meera Nair', dept: 'HR', role: 'Employee' },
  { name: 'Arjun Mehta', dept: 'Engineering', role: 'Employee' },
  { name: 'Sneha Kapoor', dept: 'Design', role: 'Employee' },
]
const ASSETS = [
  { tag: 'AF-0114', name: 'MacBook Pro 16"', category: 'Laptop', status: 'Allocated', location: 'HQ - Floor 3', serial: 'C02XF1YZLVDL', allocatedTo: 'Priya Shah' },
  { tag: 'AF-0062', name: 'Epson EB-U05 Projector', category: 'Projector', status: 'Under Maintenance', location: 'HQ - Room B2', serial: 'PROJ-2451' },
  { tag: 'AF-0031', name: 'Dell XPS 15', category: 'Laptop', status: 'Available', location: 'HQ - IT Store', serial: 'DXP-99120' },
  { tag: 'AF-0301', name: 'Sony A7 IV', category: 'Camera', status: 'Available', location: 'HQ - Studio', serial: 'SONY-A7IV-771' },
  { tag: 'AF-0088', name: 'Toyota Innova', category: 'Vehicle', status: 'Allocated', location: 'HQ - Parking', serial: 'MH12-XY-1288', allocatedTo: 'Vikram Singh' },
  { tag: 'AF-0202', name: 'Room B2 - Boardroom', category: 'Meeting Room', status: 'Available', location: 'HQ - Floor 2', serial: 'ROOM-B2' },
  { tag: 'AF-0115', name: 'MacBook Air M3', category: 'Laptop', status: 'Allocated', location: 'HQ - Floor 3', serial: 'C02AIR-M3-991', allocatedTo: 'Ananya Patel' },
  { tag: 'AF-0044', name: 'LG UltraFine 4K', category: 'Monitor', status: 'Available', location: 'HQ - IT Store', serial: 'LG-UF4K-2210' },
  { tag: 'AF-0210', name: 'iPad Pro 12.9"', category: 'Tablet', status: 'Allocated', location: 'HQ - Floor 4', serial: 'IPAD-129-5522', allocatedTo: 'Arjun Mehta' },
  { tag: 'AF-0055', name: 'BenQ 4K Projector', category: 'Projector', status: 'Available', location: 'HQ - Storage', serial: 'BENQ-4K-2019' },
  { tag: 'AF-0400', name: 'Room A1 - Focus Pod', category: 'Meeting Room', status: 'Available', location: 'HQ - Floor 1', serial: 'ROOM-A1' },
  { tag: 'AF-0032', name: 'ThinkPad X1 Carbon', category: 'Laptop', status: 'Allocated', location: 'Remote', serial: 'TP-X1C-7712', allocatedTo: 'Rahul Iyer' },
  { tag: 'AF-0501', name: 'Honda City', category: 'Vehicle', status: 'Available', location: 'HQ - Parking', serial: 'MH12-CI-4001' },
  { tag: 'AF-0121', name: 'MacBook Pro 14"', category: 'Laptop', status: 'Available', location: 'HQ - IT Store', serial: 'C02MBP14-889' },
  { tag: 'AF-0089', name: 'DJI Ronin 4D', category: 'Camera', status: 'Allocated', location: 'HQ - Studio', serial: 'DJI-R4D-101', allocatedTo: 'Sneha Kapoor' },
  { tag: 'AF-0203', name: 'Room B3 - War Room', category: 'Meeting Room', status: 'Under Maintenance', location: 'HQ - Floor 2', serial: 'ROOM-B3' },
]
const BOOKINGS = [
  { assetTag: 'AF-0202', start: 10, end: 11, user: 'Priya Shah' },
  { assetTag: 'AF-0202', start: 14, end: 15, user: 'Rahul Iyer' },
  { assetTag: 'AF-0400', start: 9, end: 10, user: 'Ananya Patel' },
  { assetTag: 'AF-0202', start: 13, end: 15, user: 'Vikram Singh' },
]
const MAINTENANCE = [
  { assetTag: 'AF-0062', status: 'Pending', issue: 'Lamp flickering during use', raisedBy: 'Vikram Singh' },
  { assetTag: 'AF-0203', status: 'Approved', issue: 'AC not cooling below 26°C', raisedBy: 'Meera Nair' },
  { assetTag: 'AF-0121', status: 'In Progress', issue: 'Battery drains rapidly', raisedBy: 'Sneha Kapoor' },
]

async function seedExact() {
  console.log('Seeding exact mock data...');

  await supabase.from('allocations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('maintenance_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('transfer_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('assets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('asset_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('departments').update({ head_id: null }).neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data: insertedDepts, error: dErr } = await supabase.from('departments').insert(DEPARTMENTS.map(d => ({ name: d.name, status: 'Active' }))).select();
  if (dErr) throw dErr;

  const profileInserts = EMPLOYEES.map(e => ({
    name: e.name,
    email: e.name.toLowerCase().replace(' ', '.') + '@assetflow.com',
    department_id: insertedDepts.find(d => d.name === e.dept)?.id,
    role: e.role === 'Manager' ? 'Department Head' : e.role,
    status: 'Active'
  }));
  const { data: insertedProfiles, error: pErr } = await supabase.from('profiles').insert(profileInserts).select();
  if (pErr) throw pErr;

  for (const d of DEPARTMENTS) {
    const headId = insertedProfiles.find(p => p.name === d.head)?.id;
    if (headId) await supabase.from('departments').update({ head_id: headId }).eq('name', d.name);
  }

  const { data: insertedCats, error: cErr } = await supabase.from('asset_categories').insert(CATEGORIES.map(c => ({ name: c }))).select();
  if (cErr) throw cErr;

  const { data: insertedAssets, error: aErr } = await supabase.from('assets').insert(ASSETS.map(a => ({
    asset_tag: a.tag,
    name: a.name,
    category_id: insertedCats.find(c => c.name === a.category).id,
    status: a.status,
    location: a.location,
    serial_number: a.serial
  }))).select();
  if (aErr) throw aErr;

  const adminId = insertedProfiles[0].id;

  for (const a of ASSETS) {
    if (a.status === 'Allocated') {
      const assetId = insertedAssets.find(ass => ass.asset_tag === a.tag).id;
      const empId = insertedProfiles.find(p => p.name === a.allocatedTo).id;
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      await supabase.from('allocations').insert({
        asset_id: assetId,
        assigned_to_employee_id: empId,
        allocated_by: adminId,
        status: 'Active',
        expected_return_date: pastDate.toISOString() // Make some overdue for the banner
      });
    }
  }

  const today = new Date();
  for (const b of BOOKINGS) {
    const assetId = insertedAssets.find(a => a.asset_tag === b.assetTag).id;
    const empId = insertedProfiles.find(p => p.name === b.user).id;
    const start = new Date(today); start.setHours(b.start, 0, 0, 0);
    const end = new Date(today); end.setHours(b.end, 0, 0, 0);
    start.setDate(start.getDate() + 1); end.setDate(end.getDate() + 1); // Tomorrow
    await supabase.from('bookings').insert({
      asset_id: assetId,
      booked_by: empId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'Upcoming'
    });
  }

  for (const m of MAINTENANCE) {
    const assetId = insertedAssets.find(a => a.asset_tag === m.assetTag).id;
    const empId = insertedProfiles.find(p => p.name === m.raisedBy).id;
    await supabase.from('maintenance_requests').insert({
      asset_id: assetId,
      raised_by: empId,
      issue_description: m.issue,
      status: m.status
    });
  }

  console.log('Dashboard mock data re-seeded successfully!');
}

seedExact().catch(console.error);
