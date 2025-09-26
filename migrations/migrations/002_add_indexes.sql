CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_payment_status ON users(payment_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- +migrate Down
DROP INDEX IF EXISTS idx_users_payment_status;
DROP INDEX IF EXISTS idx_users_created_at;