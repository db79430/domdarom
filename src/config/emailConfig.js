// config/emailConfig.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config();

const emailConfig = {
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_EMAIL, 
    pass: process.env.YANDEX_APP_PASSWORD
  }
};

const transporter = nodemailer.createTransport(emailConfig);

// Проверка подключения
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection error:', error);
  } else {
    console.log('✅ SMTP server is ready to send messages');
  }
});

export default transporter;