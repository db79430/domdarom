// services/paymentService.js
class PaymentService {
    /**
     * Заглушка для обработки оплаты - всегда возвращает успех
     */
    static async processPayment(paymentData) {
      console.log('💳 PAYMENT STUB: Processing payment...');
      
      // Имитация обработки платежа (задержка 1-2 секунды)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const stubResponse = {
        success: true,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        amount: paymentData.amount || 1000,
        currency: 'RUB',
        timestamp: new Date().toISOString(),
        message: 'Оплата успешно завершена (заглушка)'
      };
      
      console.log('✅ PAYMENT STUB: Payment processed successfully:', stubResponse.paymentId);
      return stubResponse;
    }
  
    /**
     * Заглушка для проверки статуса платежа
     */
    static async checkPaymentStatus(payment_id) {
      console.log('💳 PAYMENT STUB: Checking payment status for:', payment_id);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        paymentId: payment_id,
        status: 'succeeded',
        message: 'Платеж подтвержден (заглушка)'
      };
    }

    static generatePaymentId() {
      return Math.floor(Date.now() / 100) % 1000000000;
    }
  
  
    /**
     * Заглушка для возврата средств
     */
    static async refundPayment(paymentId) {
      console.log('💳 PAYMENT STUB: Refunding payment:', paymentId);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        refundId: `ref_${Date.now()}`,
        message: 'Возврат успешно выполнен (заглушка)'
      };
    }
  }
  
  export default PaymentService;