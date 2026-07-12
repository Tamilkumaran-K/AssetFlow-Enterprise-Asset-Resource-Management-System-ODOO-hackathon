const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');
global.WebSocket = require('ws');

// Require dotenv if running locally
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Database...');

  // 1. Clear existing data (optional, but good for fresh seed)
  console.log('Clearing old data (this relies on cascading deletes if applicable)...');
  await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('asset_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Departments
  console.log('Creating Departments...');
  const { data: depts, error: deptError } = await supabase.from('departments').insert([
    { name: 'Engineering', status: 'Active' },
    { name: 'Human Resources', status: 'Active' },
    { name: 'Facilities', status: 'Active' },
    { name: 'IT Support', status: 'Active' }
  ]).select();
  if (deptError) throw deptError;

  // 3. Profiles (Employees)
  console.log('Creating Profiles...');
  const profilesData = [];
  const roles = ['Employee', 'Employee', 'Asset Manager', 'Department Head'];
  
  for (let i = 0; i < 20; i++) {
    profilesData.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      department_id: depts[Math.floor(Math.random() * depts.length)].id,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: 'Active'
    });
  }
  
  // Add an Admin
  profilesData.push({
    name: 'Admin User',
    email: 'admin@assetflow.com',
    department_id: depts[0].id,
    role: 'Admin',
    status: 'Active'
  });

  const { data: profiles, error: profError } = await supabase.from('profiles').insert(profilesData).select();
  if (profError) throw profError;

  // Update Department Heads
  for (const dept of depts) {
    const head = profiles.find(p => p.department_id === dept.id && p.role === 'Department Head') || profiles[0];
    await supabase.from('departments').update({ head_id: head.id }).eq('id', dept.id);
  }

  // 4. Asset Categories
  console.log('Creating Asset Categories...');
  const { data: categories, error: catError } = await supabase.from('asset_categories').insert([
    { name: 'Electronics', metadata_schema: { warranty_months: 'number' } },
    { name: 'Furniture', metadata_schema: { material: 'string' } },
    { name: 'Vehicles', metadata_schema: { license_plate: 'string' } },
  ]).select();
  if (catError) throw catError;

  // 5. Assets
  console.log('Creating Assets...');
  const assetsData = [];
  for (let i = 1; i <= 50; i++) {
    const isShared = Math.random() > 0.8;
    const cat = categories[Math.floor(Math.random() * categories.length)];
    assetsData.push({
      name: `${cat.name} Item ${i}`,
      category_id: cat.id,
      asset_tag: `AF-${i.toString().padStart(4, '0')}`,
      serial_number: faker.string.alphanumeric(10).toUpperCase(),
      acquisition_date: faker.date.past({ years: 2 }),
      acquisition_cost: faker.commerce.price({ min: 100, max: 2000 }),
      condition: faker.helpers.arrayElement(['New', 'Good', 'Fair', 'Poor']),
      location: `Building A, Room ${faker.number.int({ min: 100, max: 500 })}`,
      is_shared_bookable: isShared,
      status: isShared ? 'Available' : faker.helpers.arrayElement(['Available', 'Allocated', 'Under Maintenance'])
    });
  }
  const { data: assets, error: assetError } = await supabase.from('assets').insert(assetsData).select();
  if (assetError) throw assetError;

  // 6. Allocations & Bookings & Maintenance
  console.log('Creating Allocations & Maintenance...');
  for (const asset of assets) {
    if (asset.status === 'Allocated') {
      await supabase.from('allocations').insert({
        asset_id: asset.id,
        assigned_to_employee_id: profiles[Math.floor(Math.random() * profiles.length)].id,
        allocated_by: profiles.find(p => p.role === 'Asset Manager')?.id || profiles[0].id,
        status: 'Active',
        expected_return_date: faker.date.future({ years: 1 })
      });
    } else if (asset.status === 'Under Maintenance') {
      await supabase.from('maintenance_requests').insert({
        asset_id: asset.id,
        raised_by: profiles[Math.floor(Math.random() * profiles.length)].id,
        issue_description: faker.lorem.sentence(),
        priority: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
        status: 'In Progress'
      });
    }
  }

  console.log('Database successfully seeded!');
}

seed().catch(console.error);
