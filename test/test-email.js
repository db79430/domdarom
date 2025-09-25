// test-email-config.js
import EmailService from '../src/services/emailService.js';
import dotenv from 'dotenv';

async function testEmail() {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Проверяем переменные окружения
    console.log('📧 Checking environment variables:');
    console.log('   YANDEX_EMAIL:', process.env.YANDEX_EMAIL ? 'SET' : 'NOT SET');
    console.log('   YANDEX_APP_PASSWORD:', process.env.YANDEX_APP_PASSWORD ? '***' + process.env.YANDEX_APP_PASSWORD.slice(-3) : 'NOT SET');
    
    if (!process.env.YANDEX_EMAIL || !process.env.YANDEX_APP_PASSWORD) {
      console.log('❌ Please set YANDEX_EMAIL and YANDEX_APP_PASSWORD in .env file');
      return;
    }

    // Тестовое письмо
    const testUser = {
      fullname: 'Тестовый Пользователь',
      email: process.env.YANDEX_EMAIL // Отправляем себе для теста
    };

    const result = await EmailService.sendWelcomeEmail(
      testUser, 
      'test@example.com', 
      'test123'
    );
    
    if (result) {
      console.log('✅ Email test completed successfully!');
    } else {
      console.log('❌ Email test failed');
    }
    
  } catch (error) {
    console.error('❌ Email test error:', error.message);
  }
}

testEmail();