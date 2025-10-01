// models/User.js
// import pool from '../config/database.js';

// class User {
//   static async create(userData) {
//     try {
//       const user_id = User.generateUserId();
//       // const payment_id = PaymentService.generatePaymentId();
//       // console.log('🆕 Creating user with ID:', user_id, 'Payment ID:', payment_id);
      
//       // Используем ТОЧНЫЕ названия колонок из вашей таблицы
//       const query = `
//         INSERT INTO users 
//           (user_id, fullname, phone, email, login, password, age, yeardate, conditions, checkbox, 
//            documents, payment_status, purchased_numbers, membership_status,
//            tilda_transaction_id, tilda_form_id, tilda_project_id, tilda_page_id, payment_id)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
//         RETURNING *
//       `;
  
//       const values = [
//         user_id,
//         userData.fullname, 
//         userData.phone, 
//         userData.email, 
//         userData.login, 
//         userData.password, 
//         userData.age, 
//         userData.yeardate, 
//         userData.conditions, 
//         userData.checkbox,
//         userData.documents, 
//         userData.payment_status,
//         userData.purchased_numbers,  
//         userData.membership_status, 
//         userData.tilda_transaction_id,
//         userData.tilda_form_id,
//         userData.tilda_project_id,
//         userData.tilda_page_id,
//         payment_id
//       ];
      
//       console.log('📝 Executing INSERT with correct column names');
//       console.log('📦 Values count:', values.length);
      
//       const result = await pool.query(query, values);
//       console.log('✅ User created successfully!');
      
//       return result.rows[0];
  
//     } catch (error) {
//       console.error('❌ Error in User.create():', error);
//       throw error;
//     }
//   }

//   static generateUserId() {
//     return parseInt(Date.now().toString().slice(-9)); 
//   }

  
//   static getUserId(user) {
//     if (!user || typeof user !== 'object') {
//       console.log('❌ Invalid user object');
//       return null;
//     }

//     // Приоритетные названия полей с ID
//     const priorityIdFields = ['user_id', 'id'];

//     // Ищем в приоритетных полях
//     for (const field of priorityIdFields) {
//       if (user[field] !== undefined && user[field] !== null) {
//         console.log(`✅ Found ID in field "${field}": ${user[field]}`);
//         return this.normalizeId(user[field]); // Теперь метод существует
//       }
//     }
//   }

//   static normalizeId(id) {
//     if (typeof id === 'number') return id;
//     if (typeof id === 'string' && !isNaN(id) && id.trim() !== '') {
//       const numId = parseInt(id);
//       return isNaN(numId) ? id : numId;
//     }
//     return id;
//   }
//   // Поиск по email
//   static async findByLogin(login) {
//     try {
//       console.log('🔍 Searching user by login:', login);
      
//       // Ищем по email или по полю login
//       const query = `
//         SELECT * FROM users 
//         WHERE email = $1 OR login = $1 
//         LIMIT 1
//       `;
      
//       const result = await pool.query(query, [login]);
//       return result.rows[0] || null;
      
//     } catch (error) {
//       console.error('Error finding user by login:', error);
//       throw error;
//     }
//   }

//   // Поиск по телефону
//   static async findByPhone(phone) {
//     const query = 'SELECT * FROM users WHERE phone = $1';
//     const result = await pool.query(query, [phone]);
//     return result.rows[0];
//   }

//   // static async findByLogin(login) {
//   //   const query = 'SELECT * FROM users WHERE login = $1 OR email = $1';
//   //   const result = await pool.query(query, [login]);
//   //   return result.rows[0];
//   // }

//   static async findByEmail(email) {
//     try {
//       console.log('🔍 Searching user by email:', email);
      
//       const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
//       const result = await pool.query(query, [email]);
      
//       const user = result.rows[0] || null;
//       console.log('✅ Find by email result:', user ? 'found' : 'not found');
      
//       return user;
//     } catch (error) {
//       console.error('❌ Error finding user by email:', error);
//       throw error;
//     }
//   }

//   static async findById(user_id) {
//     const query = 'SELECT * FROM users WHERE user_id = $1';
//     const result = await pool.query(query, [user_id]);
//     return result.rows[0];
//   }

//   static async updateLastLogin(user_id) {
//     const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1';
//     await pool.query(query, [user_id]);
//   }

//   // Обновление пользователя
//   static async update(user_id, updateData) {
//     const fields = Object.keys(updateData);
//     const values = Object.values(updateData);
    
//     const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
//     // ✅ ИСПРАВЛЕНО: WHERE user_id вместо WHERE id
//     const query = `UPDATE users SET ${setClause} WHERE user_id = $${fields.length + 1} RETURNING *`;
//     const result = await pool.query(query, [...values, user_id]);
    
//     return result.rows[0];
//   }
//   // Получение всех пользователей
//   static async getAll() {
//     const query = 'SELECT * FROM users ORDER BY created_at DESC';
//     const result = await pool.query(query);
//     return result.rows;
//   }

//   static async getUserSlots(userId) {
//     const query = `
//       SELECT s.* 
//       FROM slots s 
//       WHERE s.user_id = $1 AND s.status = 'active'
//       ORDER BY s.purchase_date DESC
//     `;
//     const result = await db.query(query, [userId]);
//     return result.rows;
//   }

//   static async getUserSlotsCount(userId) {
//     const query = `
//       SELECT COUNT(*) as slot_count 
//       FROM slots 
//       WHERE user_id = $1 AND status = 'active'
//     `;
//     const result = await db.query(query, [userId]);
//     return parseInt(result.rows[0].slot_count);
//   }

// }

// export default User;

// models/User.js
import pool from '../config/database.js';

class User {
  static async create(userData) {
    try {
      const user_id = User.generateUserId();
      const payment_id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('🆕 Creating user with ID:', user_id);

      const query = `
        INSERT INTO users 
          (user_id, fullname, phone, email, login, password, age, yeardate, conditions, checkbox, 
           documents, payment_status, purchased_numbers, membership_status,
           tilda_transaction_id, tilda_form_id, tilda_project_id, tilda_page_id, payment_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *
      `;

      const values = [
        user_id,
        userData.fullname || 'Не указано', 
        userData.phone || '', 
        userData.email || '', 
        userData.login || userData.email || `user_${user_id}`,
        userData.password || User.generatePassword(),
        userData.age || null, 
        userData.yeardate || null, 
        userData.conditions || 'pending', 
        userData.checkbox || false,
        userData.documents || 'pending', 
        userData.payment_status || 'pending',
        userData.purchased_numbers || null,  
        userData.membership_status || 'pending_payment', 
        userData.tilda_transaction_id || null,
        userData.tilda_form_id || null,
        userData.tilda_project_id || null,
        userData.tilda_page_id || null,
        payment_id
      ];
      
      console.log('📝 Executing INSERT query...');
      
      const result = await pool.queryWithRetry(query, values);
      console.log('✅ User created successfully! ID:', user_id);
      
      return result.rows[0];
  
    } catch (error) {
      console.error('❌ Error in User.create():', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      console.log('🔍 Searching user by email:', email);
      
      const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
      const result = await pool.queryWithRetry(query, [email]);
      
      const user = result.rows[0] || null;
      console.log('✅ Find by email result:', user ? `found user ${user.user_id}` : 'not found');
      
      return user;
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      // Возвращаем null вместо ошибки чтобы не ломать процесс
      return null;
    }
  }

  static generateUserId() {
    return parseInt(Date.now().toString().slice(-9)); 
  }

  static generatePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length}, () => 
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join('');
  }

    static async findById(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }

  static async updateLastLogin(user_id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1';
    await pool.query(query, [user_id]);
  }

  // Обновление пользователя
  static async update(user_id, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    // ✅ ИСПРАВЛЕНО: WHERE user_id вместо WHERE id
    const query = `UPDATE users SET ${setClause} WHERE user_id = $${fields.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, user_id]);
    
    return result.rows[0];
  }
  // Получение всех пользователей
  static async getAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getUserSlots(userId) {
    const query = `
      SELECT s.* 
      FROM slots s 
      WHERE s.user_id = $1 AND s.status = 'active'
      ORDER BY s.purchase_date DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getUserSlotsCount(userId) {
    const query = `
      SELECT COUNT(*) as slot_count 
      FROM slots 
      WHERE user_id = $1 AND status = 'active'
    `;
    const result = await db.query(query, [userId]);
    return parseInt(result.rows[0].slot_count);
  }


}

export default User;