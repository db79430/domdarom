// config/database.js
import pkg from 'pg';
const { Pool } = pkg;

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  ...(process.env.DB_PASSWORD && { password: process.env.DB_PASSWORD }),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Retry логика
  retryConnection: {
    maxRetries: 5,
    retryDelay: 2000
  }
};

class RetryPool extends Pool {
  constructor(config) {
    super(config);
    this.retryCount = 0;
    this.maxRetries = config.retryConnection?.maxRetries || 5;
    this.retryDelay = config.retryConnection?.retryDelay || 2000;
  }

  async queryWithRetry(text, params) {
    while (this.retryCount < this.maxRetries) {
      try {
        const result = await super.query(text, params);
        this.retryCount = 0; // Сбрасываем счетчик при успехе
        return result;
      } catch (error) {
        this.retryCount++;
        
        if (error.code === 'ECONNREFUSED' && this.retryCount < this.maxRetries) {
          console.log(`🔄 Database connection failed, retry ${this.retryCount}/${this.maxRetries} in ${this.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          continue;
        }
        
        throw error;
      }
    }
  }
}

const pool = new RetryPool(poolConfig);

// Тестируем подключение при старте
async function testConnection() {
  try {
    await pool.queryWithRetry('SELECT NOW()');
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to database after retries:', error.message);
    process.exit(1);
  }
}

testConnection();

export default pool;