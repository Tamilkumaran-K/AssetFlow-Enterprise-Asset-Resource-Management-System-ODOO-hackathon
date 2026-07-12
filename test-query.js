require('dotenv').config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const q = encodeURIComponent('*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))');
  const allocRes = await fetch(`${url}/rest/v1/allocations?select=${q}&status=eq.Active`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  
  if (!allocRes.ok) {
      console.log("Error:", await allocRes.text());
  } else {
      console.log("Success, got", (await allocRes.json()).length, "records");
  }
}
run();
