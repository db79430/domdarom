// import express from 'express';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';
// import { sendWelcomeEmail } from '../services/emailService.js';

// const router = express.Router();

// router.post('/webhook', async (req, res) => {
//   try {
//     console.log('📋 Full request body:', req.body);
    
//     // Данные от Tilda могут приходить в разных форматах
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

//     // Нормализуем имя - используем любое из возможных полей
//     const normalizedFullName = fullName || fullname;
    
//     // Проверяем обязательные поля
//     if (!normalizedFullName || !phone || !email) {
//       return res.status(400).json({ 
//         error: 'Обязательные поля: имя, телефон и email',
//         receivedFields: Object.keys(req.body),
//         missingFields: [
//           !normalizedFullName && 'имя',
//           !phone && 'телефон',
//           !email && 'email'
//         ].filter(Boolean)
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

//     // Подготавливаем данные для создания пользователя
//     const userData = {
//       fullname: normalizedFullName,
//       phone,
//       email,
//       login: email,
//       password: hashedPassword,
//       age: age || null,
//       yeardate: yeardate || null,
//       conditions: conditions || null,
//       checkbox: checkbox === 'yes' || checkbox === 'on' || checkbox === 'true' || checkbox === '1' || false,
//       documents: 'pending',
//       payment_status: 'pending',
//       slot_number: null,
//       purchased_numbers: null,
//       membership_status: 'pending_payment',
//       tilda_transaction_id: tranid || null,
//       tilda_form_id: formid || null,
//       tilda_project_id: projectid || null,
//       tilda_page_id: pageid || null
//     };

//     console.log('🔄 Processed user data:', userData);

//     // Создаем пользователя
//     const user = await User.create(userData);
    
//     // Отправляем письмо
//     let emailSent = true;
//     try {
//       await sendWelcomeEmail(email, normalizedFullName, email, password);
//       emailSent = true;
//     } catch (emailError) {
//       console.log('❌ Email sending failed:', emailError);
//     }

//     console.log('Check email service configuration:');
//     console.log('SMTP Host:', process.env.SMTP_HOST);
//     console.log('SMTP Port:', process.env.SMTP_PORT);
//     console.log('SMTP User:', process.env.SMTP_USER);

//     res.status(201).json({
//       success: true,
//       message: 'Регистрация успешна!',
//       userId: user.id,
//       emailSent: emailSent
//     });

//   } catch (error) {
//     console.error('❌ Registration error:', error);
    
//     // Более детальные ошибки для разных случаев
//     if (error.code === '23505') { // violation of unique constraint
//       return res.status(400).json({ 
//         error: 'Пользователь с таким email или телефоном уже существует'
//       });
//     }
    
//     if (error.code === '23502') { // not null violation
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

// export default router;

// routes/authRoutes.js
import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

// Маршрут для обработки входа
router.post('/login', AuthController.login);

router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Auth routes работают!',
        path: '/api/auth/test'
    });
});

export default router;