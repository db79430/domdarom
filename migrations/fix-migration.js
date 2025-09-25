import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
  user: process.env.DB_USER || 'myuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'club_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🔄 Запуск миграции...');
    await client.query('BEGIN');

    // Выполняем запросы по одному чтобы избежать ошибок синтаксиса
    const queries = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS yeardate VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS conditions TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS checkbox BOOLEAN DEFAULT true`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS documents VARCHAR(50) DEFAULT 'pending'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS slot_number INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS purchased_numbers VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS fullname VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_status VARCHAR(50) DEFAULT 'pending_payment'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS tilda_transaction_id VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS tilda_form_id VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS tilda_project_id VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS tilda_page_id VARCHAR(100)`,

      // Комментарии
      `COMMENT ON COLUMN users.age IS 'Возраст пользователя'`,
      `COMMENT ON COLUMN users.yeardate IS 'Год и дата'`,
      `COMMENT ON COLUMN users.conditions IS 'Условия'`,
      `COMMENT ON COLUMN users.checkbox IS 'Флаг согласия'`,
      `COMMENT ON COLUMN users.documents IS 'Статус документов'`,
      `COMMENT ON COLUMN users.payment_status IS 'Статус оплаты'`,
      `COMMENT ON COLUMN users.slot_number IS 'Номер слота'`,
      `COMMENT ON COLUMN users.purchased_numbers IS 'Купленные номера'`,
      `COMMENT ON COLUMN users.fullname IS 'Полное имя пользователя'`,
      `COMMENT ON COLUMN users.phone IS 'Номер телефона пользователя'`,
      `COMMENT ON COLUMN users.email IS 'Email пользователя'`,
      `COMMENT ON COLUMN users.password IS 'Хэш пароля пользователя'`,
      `COMMENT ON COLUMN users.membership_status IS 'Статус членства'`
    ];

    for (const query of queries) {
      try {
        await client.query(query);
        console.log(`✅ Выполнено: ${query.split(' ').slice(0, 4).join(' ')}...`);
      } catch (error) {
        console.log(`⚠️  Пропущено (возможно уже существует): ${error.message}`);
      }
    }

    await client.query('COMMIT');
    console.log('✅ Миграция успешно выполнена!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Ошибка миграции:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// Запускаем миграцию
runMigration().catch(console.error);