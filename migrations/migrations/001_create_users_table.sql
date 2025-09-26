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
    last_login TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- +migrate Down
DROP TABLE IF EXISTS users;