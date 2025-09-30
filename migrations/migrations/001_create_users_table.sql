-- migrations/001_create_users_table.sql
-- +migrate Up
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,
    fullname VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    login VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    age INTEGER,
    yeardate VARCHAR(50),
    conditions TEXT,
    checkbox BOOLEAN DEFAULT false,
    documents TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending',
    slot_number INTEGER,
    purchased_numbers INTEGER DEFAULT 0,
    membership_status VARCHAR(50) DEFAULT 'active',
    tilda_transaction_id VARCHAR(100),
    tilda_form_id VARCHAR(100),
    tilda_project_id VARCHAR(100),
    tilda_page_id VARCHAR(100),
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 20000),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    yookassa_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
    UNIQUE(slot_number)
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES slots(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50) CHECK (payment_type IN ('entrance_fee', 'slot_purchase')),
    yookassa_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_slots_user_id ON slots(user_id);
CREATE INDEX IF NOT EXISTS idx_slots_slot_number ON slots(slot_number);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_yookassa_id ON payments(yookassa_payment_id);

-- Функция для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- +migrate Down
DROP TABLE IF EXISTS users;