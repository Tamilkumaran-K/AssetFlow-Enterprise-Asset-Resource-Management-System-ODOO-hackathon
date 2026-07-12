const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'app/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('allocations').select('*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))').eq('status', 'Active');
  console.log("Error:", error);
  console.log("Data length:", data ? data.length : 0);
}
run();
