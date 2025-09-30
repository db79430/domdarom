import { query as _query } from '../config/database.js';

class Payment {
  // Создание записи о платеже
  static async create(paymentData) {
    const { userId, slotId = null, amount, paymentType, yookassaPaymentId, status = 'pending' } = paymentData;
    
    const query = `
      INSERT INTO payments (user_id, slot_id, amount, payment_type, yookassa_payment_id, status) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const result = await _query(query, [userId, slotId, amount, paymentType, yookassaPaymentId, status]);
    return result.rows[0];
  }

  // Обновление статуса платежа
  static async updateStatus(paymentId, status) {
    const query = 'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *';
    const result = await _query(query, [status, paymentId]);
    return result.rows[0];
  }

  // Поиск платежа по ID ЮKassa
  static async findByYookassaId(yookassaPaymentId) {
    const query = 'SELECT * FROM payments WHERE yookassa_payment_id = $1';
    const result = await _query(query, [yookassaPaymentId]);
    return result.rows[0];
  }

  // Получение истории платежей пользователя
  static async getUserPayments(userId) {
    const query = `
      SELECT p.*, s.slot_number 
      FROM payments p 
      LEFT JOIN slots s ON p.slot_id = s.id 
      WHERE p.user_id = $1 
      ORDER BY p.created_at DESC
    `;
    const result = await _query(query, [userId]);
    return result.rows;
  }
}

export default Payment;