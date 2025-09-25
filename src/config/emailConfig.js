import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Загружаем .env только в development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Проверяем переменные окружения
const requiredEnvVars = ['YANDEX_EMAIL', 'YANDEX_APP_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.log('Available variables:', Object.keys(process.env).filter(key => key.includes('YANDEX')));
  
  // В production лучше выходить с ошибкой
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const emailConfig = {
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_EMAIL, 
    pass: process.env.YANDEX_APP_PASSWORD
  }
};

console.log('SMTP Config:', {
  host: emailConfig.host,
  port: emailConfig.port,
  user: process.env.YANDEX_EMAIL ? 'set' : 'not set',
  pass: process.env.YANDEX_APP_PASSWORD ? 'set' : 'not set'
});

const transporter = nodemailer.createTransport(emailConfig);

// Проверка подключения с таймаутом
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection error:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send messages');
  }
});

export default transporter;