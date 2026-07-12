require('dotenv').config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const res = await fetch(`${url}/rest/v1/assets?select=id,status`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const assets = await res.json();
  console.log("Assets:", assets);
  
  const allocRes = await fetch(`${url}/rest/v1/allocations?select=asset_id,status`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const allocs = await allocRes.json();
  console.log("Allocs:", allocs);
}
run();
