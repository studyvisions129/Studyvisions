const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const sql = `
CREATE TABLE IF NOT EXISTS marketing_leads (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 full_name VARCHAR(150) NOT NULL,
 whatsapp_number VARCHAR(15) NOT NULL,
 academic_interest VARCHAR(100),
 source_url TEXT NOT NULL,
 lead_source VARCHAR(50) DEFAULT 'free_notes_download',
 ip_address VARCHAR(50),
 utm_source VARCHAR(100),
 utm_campaign VARCHAR(100),
 is_whatsapp_verified BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_proof_config (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 is_enabled BOOLEAN DEFAULT TRUE,
 display_interval_sec INT DEFAULT 18,
 display_duration_sec INT DEFAULT 4,
 show_on_mobile BOOLEAN DEFAULT TRUE,
 min_time_ago_mins INT DEFAULT 2,
 max_time_ago_mins INT DEFAULT 45,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_proof_pool (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_name VARCHAR(100) NOT NULL,
 city VARCHAR(100) NOT NULL,
 product_title VARCHAR(255) NOT NULL,
 action_type VARCHAR(50) DEFAULT 'purchased',
 is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS ad_placements (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 placement_key VARCHAR(100) UNIQUE NOT NULL,
 ad_client_id VARCHAR(100) NOT NULL,
 ad_slot_id VARCHAR(100) NOT NULL,
 ad_format VARCHAR(50) DEFAULT 'auto',
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

async function main() {
  await client.connect();
  console.log("Connected to DB");
  try {
    await client.query(sql);
    console.log("Migration successful");
  } catch(e) {
    console.error("Migration error", e);
  } finally {
    await client.end();
  }
}

main();
