import { query as _query } from '../config/database.js';

class Slot {
  // Создание нового слота
  static async create(slotData) {
    const { userId, slotNumber, yookassaPaymentId = null } = slotData;
    
    const query = `
      INSERT INTO slots (user_id, slot_number, yookassa_payment_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    const result = await _query(query, [userId, slotNumber, yookassaPaymentId]);
    return result.rows[0];
  }

  // Генерация уникального номера слота
  static async generateSlotNumber() {
    let slotNumber;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (exists && attempts < maxAttempts) {
      slotNumber = Math.floor(Math.random() * 20000) + 1;
      
      const query = 'SELECT id FROM slots WHERE slot_number = $1 AND status = $2';
      const result = await _query(query, [slotNumber, 'active']);
      
      exists = result.rows.length > 0;
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Could not generate unique slot number');
    }
    
    return slotNumber;
  }

  // Поиск слота по номеру
  static async findByNumber(slotNumber) {
    const query = 'SELECT * FROM slots WHERE slot_number = $1 AND status = $2';
    const result = await _query(query, [slotNumber, 'active']);
    return result.rows[0];
  }

  // Получение слота по ID
  static async findById(id) {
    const query = 'SELECT * FROM slots WHERE id = $1';
    const result = await _query(query, [id]);
    return result.rows[0];
  }

  // Получение всех занятых слотов
  static async getOccupiedSlots() {
    const query = 'SELECT slot_number FROM slots WHERE status = $1';
    const result = await _query(query, ['active']);
    return result.rows.map(row => row.slot_number);
  }

  // Получение количества свободных слотов
  static async getAvailableSlotsCount() {
    const query = 'SELECT COUNT(*) as occupied_count FROM slots WHERE status = $1';
    const result = await _query(query, ['active']);
    const occupiedCount = parseInt(result.rows[0].occupied_count);
    return 20000 - occupiedCount;
  }

  // Отмена/удаление слота
  static async cancel(slotId) {
    const query = 'UPDATE slots SET status = $1 WHERE id = $2 RETURNING *';
    const result = await _query(query, ['cancelled', slotId]);
    return result.rows[0];
  }

  // Получение статистики по слотам
  static async getStats() {
    const totalQuery = 'SELECT COUNT(*) as total FROM slots WHERE status = $1';
    const totalResult = await _query(totalQuery, ['active']);
    
    const usersQuery = `
      SELECT COUNT(DISTINCT user_id) as unique_users 
      FROM slots 
      WHERE status = $1
    `;
    const usersResult = await _query(usersQuery, ['active']);
    
    return {
      totalSlots: parseInt(totalResult.rows[0].total),
      uniqueUsers: parseInt(usersResult.rows[0].unique_users),
      availableSlots: 20000 - parseInt(totalResult.rows[0].total)
    };
  }
}

export default Slot;