require('dotenv').config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const assetsRes = await fetch(`${url}/rest/v1/assets?select=*`, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
  const allocRes = await fetch(`${url}/rest/v1/allocations?select=*&status=eq.Active`, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } });
  
  const assets = await assetsRes.json();
  const allocs = await allocRes.json();
  
  const mappedAssets = (assets || []).map(a => {
      const activeAlloc = (allocs || []).find(al => al.asset_id === a.id)
      return {
        id: a.id,
        tag: a.asset_tag,
        status_in_db: a.status,
        active_alloc: !!activeAlloc,
        status: activeAlloc ? 'Allocated' : (a.status === 'Allocated' ? 'Available' : a.status)
      }
    })
    
  console.table(mappedAssets);
}
run();
