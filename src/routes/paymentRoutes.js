// routes/paymentRoutes.js
import express from 'express';
import PaymentController from '../controllers/paymentController.js';

const router = express.Router();

// Подтверждение оплаты (основной endpoint)
router.post('/confirm', PaymentController.confirmPayment);

// Быстрый тест оплаты (без реального пользователя)
router.post('/test', PaymentController.testPayment);

// Проверка статуса платежа
router.post('/status', PaymentController.checkStatus);

// Возврат средств (заглушка)
router.post('/refund', async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    // Здесь будет заглушка для возврата
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      message: 'Возврат успешно выполнен (заглушка)',
      refundId: `ref_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Информация о платежной системе (заглушка)
router.get('/info', (req, res) => {
  res.json({
    payment_system: 'Тестовая заглушка',
    status: 'active',
    currencies: ['RUB'],
    min_amount: 100,
    max_amount: 100000,
    note: '⚠️ Это тестовая реализация. В продакшене будет реальная платежная система.'
  });
});

export default router;