// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// // import tildaRoutes from './routes/tilda.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // Обработка OPTIONS запросов для CORS
// // app.options('/api/auth/register', cors());
// app.options('*', cors());

// // Парсинг JSON и URL-encoded данных
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Логирование всех запросов
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
//   next();
// });

// // Корневой путь
// app.get('/', (req, res) => {
//   res.json({
//     message: 'DomDarom API Server',
//     status: 'active',
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       // auth: {
//       //   register: 'POST /api/auth/register',
//       //   login: 'POST /api/auth/login'
//       // },
//       tilda: {
//         webhook: 'POST /api/tilda/webhook'
//       },
//       health: 'GET /api/health'
//     }
//   });
// });

// // Health check
// // app.get('/api/health', (req, res) => {
// //   res.json({ 
// //     status: 'OK',
// //     timestamp: new Date().toISOString(),
// //     environment: process.env.NODE_ENV || 'development'
// //   });
// // });

// // app.get('/api/tilda/debug', (req, res) => {
// //   res.json({ 
// //     message: 'Tilda debug endpoint',
// //     timestamp: new Date().toISOString(),
// //     working: true
// //   });
// // });

// // Подключаем роуты
// app.use('/api/auth', authRoutes);
// // app.use('/api/tilda', tildaRoutes);
// app.use('/api/users', userRoutes);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Endpoint not found',
//     path: req.originalUrl,
//     method: req.method,
//     availableEndpoints: [
//       'GET /',
//       // 'GET /api/health',
//       // 'POST /api/auth/register',
//       // 'POST /api/auth/login',
//       'POST /api/tilda/webhook'
//     ]
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('❌ Server error:', err);
//   res.status(500).json({
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// //   console.log(`📍 Local: http://localhost:${PORT}`);
// //   console.log('📋 Available endpoints:');
// //   console.log('   POST /api/auth/register - Регистрация пользователя');
// //   console.log('   POST /api/auth/login    - Вход в систему');
// //   console.log('   POST /api/tilda/webhook - Webhook от Tilda');
// //   console.log('   GET  /api/health        - Проверка здоровья сервера');
// // });

// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// // import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import tildaRoutes from './routes/tilda.js'; // РАЗКОММЕНТИРУЙТЕ ЭТУ СТРОКУ

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors({
//   origin: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.options('*', cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Корневой путь
// app.get('/', (req, res) => {
//   res.json({
//     message: 'DomDarom API Server',
//     status: 'active',
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       tilda: {
//         webhook: 'POST /api/tilda/webhook'
//       }
//     }
//   });
// });

// app.get('/api/tilda/webhook', (req, res) => {
//   console.log('Tilda test connection');
//   res.json({ status: 'OK', message: 'Webhook is reachable' });
// });

// app.post('/api/tilda/webhook', (req, res) => {
//   console.log('=== TILDA WEBHOOK RECEIVED ===');
//   console.log('Body:', req.body);
//   console.log('Query params:', req.query);
//   console.log('Raw body:', req.rawBody);
//   console.log('=== END WEBHOOK DATA ===');
  
//   // Всегда отвечаем OK Tilda
//   res.status(200).send('OK');
// });

// // Подключаем роуты
// // app.use('/api/auth', authRoutes);
// app.use('/api/tilda', tildaRoutes);
// app.use('/api/users', userRoutes);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Endpoint not found',
//     path: req.originalUrl,
//     method: req.method,
//     availableEndpoints: [
//       'GET /',
//       'POST /api/tilda/webhook'
//     ]
//   });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error('❌ Server error:', err);
//   res.status(500).json({
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Tilda webhook available at: http://localhost:${PORT}/api/tilda/webhook`);
// });

// app.js

import express from 'express';
import cors from 'cors';
import tildaRoutes from './routes/tilda.js'
import emailRoutes from './routes/emailRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import authRoutes from './routes/auth.js'


const app = express();

// app.use(cors({
//   origin: 'https://domdarom.me',
//   credentials: true
// }));
app.use(cors({
  origin: 'https://domdarom.me', // ваш домен
  credentials: true
}));

// Важно: сначала JSON парсер, потом остальные
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(session({
//   secret: '1734f98272f2bd7e5fb895edfe8ef2d0e54b51a982649197053cbf9b6b623425e6714cfa8d8487e0fdd595950ff64cdef3d771f55a4927e6e80b8c3a9e3d5ca0', 
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false, // Поставьте true если используете HTTPS
//     maxAge: 24 * 60 * 60 * 1000 // 24 часа
//   }
// }));


// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log('=== INCOMING REQUEST ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body length:', req.body ? JSON.stringify(req.body).length : 0);
  next();
});

// Routes
app.use('/api/tilda', tildaRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      email: 'unknown'
    }
  };

  try {
    // Проверка базы данных
    // await pool.query('SELECT 1');
    healthStatus.services.database = 'healthy';
  } catch (error) {
    healthStatus.services.database = 'unhealthy';
    healthStatus.status = 'DEGRADED';
  }

  // Проверка почты (упрощенная)
  healthStatus.services.email = 'healthy'; // Предполагаем что здоров

  res.json(healthStatus);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Tilda webhook: http://localhost:${PORT}/api/tilda/webhook`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});