// test-tilda.js
import axios from 'axios';

async function testTildaWebhook() {
  try {
    const tildaData = {
      formid: '1329166621',
      projectid: '14245141',
      name: 'Тест Иванов',
      phone: '+79220112222',
      email: 'test@example.com',
      age: '25',
      yeardate: '1998-05-15',
      conditions: 'accepted',
      checkbox: '1',
      pageid: '123456',
      paymentid: 'txn_123456'
    };

    const response = await axios.post(
      'http://localhost:3000/api/tilda/webhook',
      new URLSearchParams(tildaData).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Webhook test successful:', response.data);
  } catch (error) {
    console.error('❌ Webhook test failed:', error.response?.data || error.message);
  }
}

testTildaWebhook();