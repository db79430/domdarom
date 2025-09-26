// controllers/tildaController.js
import UserService from '../services/userServices.js';

class TildaController {
  static async handleWebhook(req, res) {
    console.log('=== TILDA WEBHOOK RECEIVED ===');
    console.log('🎯 === TILDA WEBHOOK RECEIVED ===');
    console.log('⏰ Time:', new Date().toISOString());
    console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));
    console.log('📨 Tilda Webhook Received:', {
      headers: JSON.stringify(req.headers, null, 2),
      body: req.body,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    try {
      const tildaData = req.body;
      console.log('📦 Raw data type:', typeof tildaData);
      console.log('📦 Raw data keys:', Object.keys(tildaData));
      
      
      // Сразу отвечаем Tilda
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ status: 'received' });

      // Обрабатываем данные
      await TildaController.processTildaData(tildaData);

    } catch (error) {
      console.error('❌ Tilda webhook error:', error);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).json({ status: 'ok' });
    }
  }

  static async handleRegistrationWithPayment(tildaData) {
    try {
      console.log('🎯 Automatic registration with payment stub');
      
      const formData = tildaData.data || tildaData;
      
      // Регистрируем пользователя с immediate оплатой
      const result = await UserService.registerWithPayment(formData);
      
      console.log('✅ Automatic registration with payment completed');
      return result;
      
    } catch (error) {
      console.error('❌ Automatic registration error:', error);
      throw error;
    }
  }

  static async processTildaData(tildaData) {
    console.log('🔄 START processTildaData');
    
    try {
      if (!tildaData) {
        console.log('❌ No data received');
        return;
      }

      console.log('🔍 Data structure analysis:');
      console.log('- Has Email:', !!tildaData.Email);
      console.log('- Has Phone:', !!tildaData.Phone);
      console.log('- Has FullName:', !!tildaData.FullName);
      console.log('- Has formid:', !!tildaData.formid);

      // Обрабатываем плоский формат
      if (tildaData.Email || tildaData.Phone) {
        console.log('✅ Flat format detected - processing directly');
        await TildaController.processFlatData(tildaData);
      } else {
        console.log('❌ No contact info found in flat data');
      }

      console.log('✅ Data processing completed');

    } catch (error) {
      console.error('❌ Error in processTildaData:', error);
    }
  }

  static async processFlatData(flatData) {
    console.log('\n🎯 PROCESSING FLAT DATA');
    console.log('Flat data:', flatData);
    
    try {
      // Создаем структуру, которую ожидает UserService
      const structuredData = {
        type: 'success', // По умолчанию success для плоского формата
        projectid: flatData.formid ? flatData.formid.replace('form', '') : '14245141',
        data: {
          FullName: flatData.FullName,
          Phone: flatData.Phone,
          Email: flatData.Email,
          Age: flatData.Age,
          Yeardate: flatData.Yeardate,
          Conditions: flatData.Conditions,
          Checkbox: flatData.Checkbox
        },
        form: {
          id: flatData.formid
        },
        integration: {
          lead: flatData.tranid ? flatData.tranid.split(':')[1] : null
        }
      };

      console.log('📊 Structured data for UserService:', structuredData);

      // Вызываем UserService
      const user = await UserService.createUserFromTilda(structuredData);
      console.log('🎉 User created successfully with ID:', user.user_id);
      
    } catch (error) {
      console.error('❌ Error processing flat data:', error.message);
    }
  }
}

export default TildaController;