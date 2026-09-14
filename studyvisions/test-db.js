const { Client } = require('pg');

async function testConnection(url) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log("SUCCESS:", url);
    await client.end();
    return true;
  } catch (err) {
    console.log("FAILED:", url);
    console.log("Error:", err.message);
    return false;
  }
}

async function run() {
  const pwd = "r%25FW5x*8TJkxf%2CE";
  const id = "hlxhsaomjoaxmfllvdzp";
  
  const urls = [
    `postgresql://postgres:${pwd}@${id}.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${id}:${pwd}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${id}:${pwd}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
  ];
  
  for (const url of urls) {
    await testConnection(url);
  }
}

run();
