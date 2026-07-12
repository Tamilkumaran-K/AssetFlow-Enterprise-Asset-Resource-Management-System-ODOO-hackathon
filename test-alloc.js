const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function test() {
  const allocRes = await supabase.from('allocations').select('*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))').eq('status', 'Active')
  console.log("Allocations:", allocRes.data)
  
  const assetRes = await supabase.from('assets').select('*')
  console.log("Assets:", assetRes.data.map(a => ({ id: a.id, tag: a.asset_tag, status: a.status })))
}
test()
