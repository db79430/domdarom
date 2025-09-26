// routes/tilda.js
// import express from 'express';
// const router = express.Router();

// // Явный обработчик для Tilda webhook
// app.post('/api/tilda/webhook', (req, res) => {
//   console.log('🎯 Tilda webhook received:', req.body);
  
//   try {
//     // Данные от Tilda обычно приходят в формате x-www-form-urlencoded
//     const {
//       fullName,
//       fullname, // на случай если приходит в lowercase
//       phone,
//       email,
//       age,
//       yeardate,
//       conditions,
//       checkbox,
//       tranid,
//       formid,
//       projectid,
//       pageid,
//     } = req.body;

//     console.log('📋 Form data:', { 
//       name, 
//       phone, 
//       email, 
//       formId: formid,
//       transactionId: tranid 
//     });

//     // Обязательный ответ для Tilda в течение 5 секунд
//     res.json({
//       success: true,
//       message: 'Webhook received successfully',
//       data: { name, phone, email }
//     });

//   } catch (error) {
//     console.error('❌ Tilda webhook error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error'
//     });
//   }
// });

// export default router;
// // Основной endpoint для регистрации
// router.post('/register', async (req, res) => {
//   try {
//     console.log('Tilda registration data:', req.body);
    
//     // Tilda отправляет данные с заглавными буквами
//     const {
//       Name: fullName,
//       Phone: phone, 
//       Email: email,
//       Age: age,
//       Yeardate: yeardate,
//       Conditions: conditions,
//       Checkbox: checkbox,
//       form_id,
//       project_id
//     } = req.body;

//     // Проверяем обязательные поля
//     if (!fullName || !phone || !email || !age || !yeardate || !conditions || !checkbox) {
//       return res.status(400).json({ 
//         error: 'Все поля обязательны для заполнения',
//         received: req.body
//       });
//     }

//     // Проверяем существование пользователя
//     const existingUser = await User.findByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ 
//         error: 'Пользователь с таким email уже существует' 
//       });
//     }

//     // Генерируем пароль и хешируем
//     const password = Math.random().toString(36).slice(-8);
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Создаем пользователя
//     const userData = {
//       id: Date.now().toString(),
//       fullName,
//       phone,
//       email,
//       login: email,
//       password: hashedPassword,
//       age,
//       yeardate,
//       conditions,
//       checkbox: checkbox === 'on' || checkbox === 'true',
//       documents: 'pending',
//       paymentStatus: 'pending',
//       membershipStatus: 'pending_payment',
//       tildaFormId: form_id,
//       tildaProjectId: project_id
//     };

//     const user = await User.create(userData);
    
//     // Отправляем приветственное письмо
//     try {
//       await sendWelcomeEmail(email, fullName, email, password);
//     } catch (emailError) {
//       console.log('Email sending failed:', emailError);
//     }

//     // Успешный ответ для Tilda
//     res.json({
//       success: true,
//       message: 'Регистрация успешна!',
//       userId: user.id
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ 
//       error: 'Внутренняя ошибка сервера',
//       details: error.message 
//     });
//   }
// });

// // Endpoint для проверки работы
// router.get('/status', (req, res) => {
//   res.json({ 
//     status: 'active',
//     service: 'Tilda Webhook Handler',
//     timestamp: new Date().toISOString()
//   });
// });


// import express from 'express';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';
// import { sendWelcomeEmail } from '../services/emailService.js';
// import TildaController from '../controllers/tildaController.js';

// const router = express.Router();

// router.post('/webhook', TildaController.handleWebhook);

// Правильный путь - только '/webhook'
// router.post('/webhook', TildaController.handleWebhook, async (req, res) => {
//   try {
//     console.log('🎯 Tilda Webhook Triggered!');
//     console.log('📋 Headers:', req.headers);
//     console.log('📦 Body:', JSON.stringify(req.body, null, 2));
//     console.log('🔍 Query params:', req.query);
//     console.log('⏰ Timestamp:', new Date().toISOString());

    

//     const {
//       fullName,
//       fullname,
//       phone,
//       email,
//       age,
//       yeardate,
//       conditions,
//       checkbox,
//       tranid,
//       formid,
//       projectid,
//       pageid,
//       name,
//       Name,
//       Phone,
//       Email,
//       FORM_ID,
//       PROJECT_ID,
//       PAGE_ID
//     } = req.body;

//     // Нормализуем данные (Тильда может отправлять в разных регистрах)
//     const normalizedFullName = fullName || fullname || name || Name;
//     const normalizedPhone = phone || Phone;
//     const normalizedEmail = email || Email;
//     const normalizedFormId = formid || FORM_ID;
//     const normalizedProjectId = projectid || PROJECT_ID;
//     const normalizedPageId = pageid || PAGE_ID;

//     console.log('📊 Normalized data:', {
//       normalizedFullName,
//       normalizedPhone,
//       normalizedEmail,
//       normalizedFormId,
//       normalizedProjectId,
//       normalizedPageId
//     });

//     res.set('Content-Type', 'text/plain; charset=utf-8');
//     res.send('OK');

//     // Проверяем обязательные поля
//     if (!normalizedFullName || !normalizedPhone || !normalizedEmail) {
//       return res.status(400).json({ 
//         error: 'Обязательные поля: имя, телефон и email',
//         receivedData: req.body,
//         missing: {
//           name: !normalizedFullName,
//           phone: !normalizedPhone,
//           email: !normalizedEmail
//         }
//       });
//     }

//     // Проверяем существование пользователя
//     const existingUser = await User.findByEmail(normalizedEmail);
//     if (existingUser) {
//       console.log('⚠️ User already exists:', normalizedEmail);
//       return res.status(400).json({ 
//         error: 'Пользователь с таким email уже существует',
//         userId: existingUser.id
//       });
//     }

//     // Генерируем пароль
//     const password = Math.random().toString(36).slice(-8);
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Подготавливаем данные
//     const userData = {
//               fullname: normalizedFullName,
//               phone,
//               email,
//               login: email,
//               password: hashedPassword,
//               age: age || null,
//               yeardate: yeardate || null,
//               conditions: conditions || null,
//               checkbox: checkbox === 'yes' || checkbox === 'on' || checkbox === 'true' || checkbox === '1' || false,
//               documents: 'pending',
//               payment_status: 'pending',
//               slot_number: null,
//               purchased_numbers: null,
//               membership_status: 'pending_payment',
//               tilda_transaction_id: tranid || null,
//               tilda_form_id: formid || null,
//               tilda_project_id: projectid || null,
//               tilda_page_id: pageid || null
//             };

//     console.log('👤 Creating user with data:', userData);

//     // Создаем пользователя
//     const user = await User.create(userData);
    
//     // Отправляем письмо
//     let emailSent = false;
//     try {
//       await sendWelcomeEmail(normalizedEmail, normalizedFullName, normalizedEmail, password);
//       emailSent = true;
//       console.log('✅ Welcome email sent successfully');
//     } catch (emailError) {
//       console.error('❌ Email sending failed:', emailError);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Регистрация успешна!',
//       userId: user.id,
//       userEmail: normalizedEmail,
//       emailSent: emailSent,
//       tildaData: {
//         formId: normalizedFormId,
//         projectId: normalizedProjectId,
//         pageId: normalizedPageId
//       }
//     });

//   } catch (error) {
//     console.error('❌ Tilda webhook error:', error);
    
//     if (error.code === '23505') {
//       return res.status(400).json({ 
//         error: 'Пользователь с таким email или телефоном уже существует'
//       });
//     }
    
//     if (error.code === '23502') {
//       return res.status(400).json({ 
//         error: 'Отсутствуют обязательные поля',
//         details: error.message
//       });
//     }

//     res.status(500).json({ 
//       error: 'Внутренняя ошибка сервера',
//       details: process.env.NODE_ENV === 'development' ? error.message : 'Обратитесь к администратору'
//     });
//   }
// });

// // Добавляем тестовый endpoint для проверки
// router.get('/test', (req, res) => {
//   res.json({ 
//     message: 'Tilda webhook endpoint is working!',
//     timestamp: new Date().toISOString()
//   });
// });

// routes/tildaRoutes.js
import express from 'express';
import TildaController from '../controllers/tildaController.js';

const router = express.Router();

// Основной webhook endpoint
router.post('/webhook', TildaController.handleWebhook);
console.log('📨 Tilda Webhook Received:', {
  headers: req.headers,
  body: req.body,
  ip: req.ip,
  timestamp: new Date().toISOString()
});

// Тестовый endpoint для проверки
router.get('/webhook', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tilda webhook is ready',
    timestamp: new Date().toISOString()
  });
});

// Endpoint для ручного тестирования
router.post('/test', TildaController.handleWebhook);

export default router;