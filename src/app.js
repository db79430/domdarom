import express from 'express';
import cors from 'cors';
import tildaRoutes from './routes/tilda.js';
import emailRoutes from './routes/emailRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/auth.js';

const app = express();

// CORS настройка
app.use(cors({
  origin: ['https://domdarom.me', 'https://www.domdarom.me','http://api.domdarom.me'],
  credentials: true
}));

// Парсеры
app.use(express.json({ limit: '50mb' }));  // увеличим лимит для Tilda
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Логирование запросов
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Подключаем роуты
app.use('/api/tilda', tildaRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);

// Тестовый endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ API работает корректно',
    timestamp: new Date().toISOString(),
    endpoints: {
      tilda: 'POST /api/tilda/webhook',
      health: 'GET /health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'DomDarom API'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /api/test',
      'POST /api/tilda/webhook',
      'GET /health'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Tilda Webhook: https://api.domdarom.me/api/tilda/webhook`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
});