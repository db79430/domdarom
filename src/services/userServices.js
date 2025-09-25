// services/userServices.js
import User from '../models/User.js';
import EmailService from './emailService.js';
import PaymentService from './paymentService.js';

class UserService {
  static async createUserFromTilda(tildaData) {
    try {
      console.log('📝 Creating user from Tilda data...');
      const paymentId = PaymentService.generatePaymentId();
      
      const formData = tildaData.data || tildaData;
      
      // Валидация
      if (!formData.Email && !formData.Phone) {
        throw new Error('Email or Phone is required');
      }
      // Используем ПРАВИЛЬНЫЕ названия полей согласно структуре таблицы
      const userData = {
        fullname: formData.FullName || 'Не указано',
        phone: this.normalizePhone(formData.Phone || ''),
        email: formData.Email || '',
        login: formData.Email || `user_${Date.now()}`,
        password: this.generatePassword(),
        age: parseInt(formData.Age) || null,
        yeardate: formData.Yeardate || null,
        conditions: formData.Conditions === 'yes' ? 'accepted' : 'pending',
        checkbox: formData.Checkbox === 'yes',
        documents: 'pending',
        payment_status: 'pending', 
        slot_number: null,
        // payment_id: paymentId,
        purchased_numbers: null,
        payment_id: paymentId,   
        membership_status: 'pending_payment', 
        tilda_transaction_id: tildaData.tranid || null,
        tilda_form_id: tildaData.formid || null,
        tilda_project_id: tildaData.formid ? tildaData.formid.replace('form', '') : '14245141',
        tilda_page_id: null
      };

      // Проверяем существующего пользователя
      const existingUser = await User.findByEmail(userData.email) || 
                          await User.findByPhone(userData.phone);

      // Явно проверяем, нужно ли создавать нового пользователя
let user;

if (existingUser) {
  console.log('🔄 User exists, updating...');
  const userId = User.getUserId(existingUser);
  
  if (userId) {
    const updateData = {
      fullname: userData.fullname,
      phone: userData.phone,
      age: userData.age,
      email: userData.email,
      yeardate: userData.yeardate,
      payment_id: userData.payment_id
    };
    
    user = await User.update(userId, updateData);
    console.log('✅ User updated successfully');
  } else {
    console.log('⚠️ Cannot determine user ID, creating new user');
    user = await User.create(userData);
    console.log('✅ New user created instead');
  }
} else {
  console.log('🆕 User does not exist, creating new...');
  user = await User.create(userData);
  console.log('✅ New user created successfully');
}

// Проверяем оплату для любого сценария
await this.checkAndProcessPayment(user, userData);
return user;

    } catch (error) {
      console.error('❌ Error creating user from Tilda:', error);
      throw error;
    }
  }

  /**
   * НОВЫЙ МЕТОД: Проверка оплаты и отправка уведомления
   */
  static async checkAndProcessPayment(user, userData) {
    try {
      console.log(`💳 Starting payment check for user ${user.email}`);
      
      // Получаем payment_id из объекта пользователя
      const paymentId = userData.payment_id;
      
      if (!paymentId) {
        console.log('⚠️ No payment ID found, skipping payment check');
        return;
      }

      console.log(`🔍 Checking payment status for ID: ${paymentId}`);
      
      // Проверяем статус платежа
      const paymentResult = await PaymentService.checkPaymentStatus(paymentId);
      
      console.log('📊 Payment result:', {
        success: paymentResult.success,
        status: paymentResult.status,
        message: paymentResult.message
      });

      // Если оплата успешна - обновляем статус и отправляем письмо
      if (paymentResult.success && paymentResult.status === 'succeeded') {
        console.log('💰 Payment successful! Updating user status...');
        
        // Получаем ID пользователя для обновления
        const userId = User.getUserId(user);
        if (!userId) {
          console.error('❌ Cannot determine user ID for update');
          return;
        }
        
        // Обновляем статус пользователя
        const updatedUser = await User.update(userId, {
          payment_status: 'succeeded',
          membership_status: 'active'
        });

        // Отправляем письмо с данными для входа
        await EmailService.sendWelcomeEmail(
          updatedUser, 
          userData.email, 
          userData.password,
          {
            paymentId: paymentId,
            paymentStatus: 'success',
            paymentMessage: paymentResult.message
          }
        );

        console.log('✅ Payment processed successfully and email sent');
        
      } else if (paymentResult.status === 'pending') {
        console.log('⏳ Payment pending, will check later');
      } else {
        console.log('❌ Payment failed or not completed');
      }

    } catch (paymentError) {
      console.error('❌ Error in payment processing:', paymentError);
    }
}

  // Остальные методы остаются без изменений
  static normalizePhone(phone) {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    
    if (digits.startsWith('8') && digits.length === 11) {
      return '7' + digits.slice(1);
    }
    if (digits.startsWith('7') && digits.length === 11) {
      return digits;
    }
    if (digits.length === 10) {
      return '7' + digits;
    }
    
    return digits;
  }

  static generatePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length}, () => 
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join('');
  }

  static async registerWithPayment(userData) {
    try {
      console.log('🎯 Registering user with immediate payment stub');
      
      // Создаем пользователя
      const newUser = await this.createUserFromTilda(userData);
      
      // Immediately process payment (stub)
      const paymentResult = await PaymentService.processPayment({
        user_id: newUser.user_id,
        amount: 1000,
        description: "Регистрационный взнос в клуб"
      });

      console.log('✅ Registration with payment completed successfully');
      
      return {
        user: newUser,
        payment: paymentResult
      };
      
    } catch (error) {
      console.error('❌ Registration with payment error:', error);
      throw error;
    }
  }
  
  static async authenticate(login, password) {
    try {
      console.log('🔐 Starting authentication for:', login);
      
      if (!login || !password) {
        throw new Error('Login or password is empty');
      }
  
      // Ищем пользователя
      console.log('🔍 Searching user by login/email:', login);
      const user = await User.findByEmail(login) || await User.findByLogin(login);
      
      if (!user) {
        console.log('❌ User not found in database');
        return { 
          success: false, 
          message: 'Пользователь не найден' 
        };
      }
  
      console.log('✅ User found:', { 
        id: user.user_id, 
        email: user.email,
        hasPassword: !!user.password 
      });
  
      // Проверяем пароль
      if (user.password !== password) {
        console.log('❌ Password mismatch');
        return { 
          success: false, 
          message: 'Неверный пароль' 
        };
      }
  
      console.log('✅ Authentication successful');
      return { 
        success: true, 
        user: user,
        message: 'Аутентификация успешна'
      };
      
    } catch (error) {
      console.error('❌ AUTHENTICATION SERVICE ERROR:', error);
      console.error('❌ Error stack:', error.stack);
      throw error;
    }
  }
}

export default UserService;