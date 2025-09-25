// test-fixed.js
import UserService from '../src/services/userServices.js';

const testData = {
  FullName: 'Тестовый пользователь',
  Phone: '+7 (966) 362-04-29',
  Email: 'test@example.com',
  Age: '25',
  Yeardate: '23.09.2025',
  Conditions: 'yes',
  Checkbox: 'yes',
  formid: 'form1329166621',
  tranid: '14245141:123456'
};

async function test() {
  try {
    console.log('🧪 Testing with correct column names...');
    const user = await UserService.createUserFromTilda(testData);
    console.log('✅ SUCCESS! User created:', user);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

test();