require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQuery(tableName, selectStr) {
  try {
    const { data, error } = await supabase.from(tableName).select(selectStr).limit(1)
    if (error) {
      console.log(`❌ ${tableName} error:`, error.message, error.details || '')
    } else {
      console.log(`✅ ${tableName} query successful:`, data)
    }
  } catch (err) {
    console.log(`💥 ${tableName} exception:`, err.message)
  }
}

async function main() {
  console.log('Running Supabase Schema Queries Check...')
  await testQuery('assets', '*, category:asset_categories(name)')
  await testQuery('asset_categories', '*')
  await testQuery('allocations', '*, employee:profiles!allocations_assigned_to_employee_id_fkey(name, department:departments!profiles_department_id_fkey(name))')
  await testQuery('profiles', '*, department:departments!profiles_department_id_fkey(name)')
  await testQuery('maintenance_requests', '*, asset:assets(name, asset_tag), profile:profiles(name)')
  await testQuery('transfer_requests', '*, from:profiles!transfer_requests_from_employee_id_fkey(name), to:profiles!transfer_requests_to_employee_id_fkey(name), asset:assets(name, asset_tag)')
  await testQuery('departments', '*')
  await testQuery('bookings', '*, profile:profiles!bookings_booked_by_fkey(name), asset:assets!bookings_asset_id_fkey(asset_tag, name)')
}

main()
