// check-table.js
import pool from '../src/config/database.js';

async function checkTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('🎯 ТОЧНАЯ СТРУКТУРА ТАБЛИЦЫ users:');
    result.rows.forEach((col, i) => {
      console.log(`${i + 1}. ${col.column_name} (${col.data_type})`);
    });
    
    return result.rows;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

checkTable();