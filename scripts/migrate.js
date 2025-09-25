import pool from '../src/config/database';

async function migrate() {
  try {
    const client = await pool.connect();
    
    const alterTableQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS age INTEGER,
      ADD COLUMN IF NOT EXISTS yeardate VARCHAR(100),
      ADD COLUMN IF NOT EXISTS conditions TEXT,
      ADD COLUMN IF NOT EXISTS checkbox BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS documents VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS slot_number INTEGER,
      ADD COLUMN IF NOT EXISTS purchased_numbers VARCHAR(255);
    `;

    await client.query(alterTableQuery);
    console.log('✅ Table users updated successfully');
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();