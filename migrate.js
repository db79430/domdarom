// migrate.js
import pg from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Конфигурация БД
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Таблица для отслеживания миграций
const createMigrationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
  console.log('✅ Migrations table ready');
};

// Применение миграций
const applyMigrations = async () => {
  await createMigrationsTable();

  // Получаем список примененных миграций
  const appliedResult = await pool.query('SELECT name FROM migrations ORDER BY id');
  const appliedMigrations = new Set(appliedResult.rows.map(row => row.name));

  // Читаем файлы миграций
  const migrationFiles = readdirSync(join(__dirname, 'migrations'))
    .filter(file => file.endsWith('.sql'))
    .sort();

  console.log(`📋 Found ${migrationFiles.length} migration files`);

  for (const file of migrationFiles) {
    if (!appliedMigrations.has(file)) {
      console.log(`🔄 Applying migration: ${file}`);
      
      const migrationSQL = readFileSync(join(__dirname, 'migrations', file), 'utf8');
      const statements = migrationSQL.split('-- +migrate Up');
      
      if (statements.length > 1) {
        const upStatements = statements[1].split('-- +migrate Down')[0];
        
        // Выполняем миграцию в транзакции
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(upStatements);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✅ Migration ${file} applied successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`❌ Error applying migration ${file}:`, error);
          throw error;
        } finally {
          client.release();
        }
      }
    } else {
      console.log(`⏩ Migration ${file} already applied, skipping`);
    }
  }

  console.log('🎉 All migrations applied successfully');
  await pool.end();
};

applyMigrations().catch(console.error);