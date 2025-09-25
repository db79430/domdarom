// controllers/paymentController.js
import UserService from '../services/userServices.js';
import PaymentService from '../services/paymentService.js';

class PaymentController {
  /**
   * Заглушка для подтверждения оплаты - всегда успешно
   */
  static async confirmPayment(req, res) {
    try {
      const { user_id, amount = 1000, description = "Взнос в клуб" } = req.body;
      
      console.log('💳 PAYMENT STUB: Confirm payment request received');
      console.log('User ID:', user_id);
      console.log('Amount:', amount);
      console.log('Description:', description);

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      // Имитируем обработку платежа через заглушку
      const paymentResult = await PaymentService.processPayment({
        user_id,
        amount,
        description
      });

      // Обновляем статус пользователя и отправляем письмо
      const user = await UserService.confirmPayment(user_id);
      
      res.json({
        success: true,
        message: '✅ Оплата успешно подтверждена! Данные для входа отправлены на email.',
        payment: paymentResult,
        user: {
          id: user.user_id,
          email: user.email,
          fullname: user.fullname,
          status: user.membership_status,
          payment_status: user.payment_status
        },
        note: '⚠️ Это тестовая заглушка. В реальной системе здесь будет интеграция с платежной системой.'
      });
      
    } catch (error) {
      console.error('❌ Payment confirmation error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Тестовый endpoint для быстрой проверки оплаты
   */
  static async testPayment(req, res) {
    try {
      console.log('🧪 TEST PAYMENT: Quick test endpoint');
      
      // Создаем тестового пользователя или используем существующего
      const testUser = {
        user_id: 1,
        email: 'test@example.com',
        fullname: 'Тестовый Пользователь'
      };

      const paymentResult = await PaymentService.processPayment({
        user_id: testUser.user_id,
        amount: 1000,
        description: "Тестовый взнос в клуб"
      });

      res.json({
        success: true,
        message: '🧪 Тестовый платеж успешно обработан',
        payment: paymentResult,
        user: testUser,
        instructions: 'Для реального теста используйте endpoint /confirm с реальным userId'
      });
      
    } catch (error) {
      console.error('❌ Test payment error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Endpoint для проверки статуса платежа
   */
  static async checkStatus(req, res) {
    try {
      const { payment_id } = req.body;
      
      if (!payment_id) {
        return res.status(400).json({
          success: false,
          error: 'Payment ID is required'
        });
      }

      const status = await PaymentService.checkPaymentStatus(payment_id);
      
      res.json({
        success: true,
        status: status
      });
      
    } catch (error) {
      console.error('❌ Check status error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default PaymentController;