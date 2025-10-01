-- Создание таблицы пользователей
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
    purchased_numbers INTEGER DEFAULT 0,
    membership_status VARCHAR(50) DEFAULT 'active',
    tilda_transaction_id VARCHAR(100),
    tilda_form_id VARCHAR(100),
    tilda_project_id VARCHAR(100),
    tilda_page_id VARCHAR(100),
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); -- 🔥 УБРАЛИ лишнюю запятую

-- Создание таблицы слотов (ИСПРАВЛЕНО user_id)
CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE, -- 🔥 BIGINT вместо INTEGER
    slot_number INTEGER NOT NULL CHECK (slot_number >= 1 AND slot_number <= 20000),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    yookassa_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
    UNIQUE(slot_number)
);

-- Создание таблицы платежей (ИСПРАВЛЕНО user_id)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE, -- 🔥 BIGINT вместо INTEGER
    slot_id INTEGER REFERENCES slots(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50) CHECK (payment_type IN ('entrance_fee', 'slot_purchase')),
    yookassa_payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
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

-- Тестовые данные для проверки
INSERT INTO users (user_id, fullname, email, phone, login, password, payment_status, membership_status) 
VALUES 
(100000001, 'Тестовый Пользователь 1', 'test1@example.com', '+79990000001', 'testuser1', 'password123', 'pending', 'pending_payment'),
(100000002, 'Тестовый Пользователь 2', 'test2@example.com', '+79990000002', 'testuser2', 'password123', 'completed', 'active')
ON CONFLICT (user_id) DO NOTHING;