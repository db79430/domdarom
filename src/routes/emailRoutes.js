// routes/emailRoutes.js
import express from 'express';
import EmailService from '../services/emailService.js';

const router = express.Router();

// Тестовый endpoint для проверки почты
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    await EmailService.sendTestEmail(email);
    res.json({ success: true, message: 'Test email sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;