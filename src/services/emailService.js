// services/emailService.js
import dotenv from 'dotenv';
import transporter from '../config/emailConfig.js';

dotenv.config();

class EmailService {
  /**
   * Отправляет приветственное письмо после успешной регистрации
   */
  static async sendWelcomeEmail(user, login, password) {
    try {
      const mailOptions = {
        from: process.env.YANDEX_EMAIL,
        to: user.email,
        subject: 'Добро пожаловать в клуб! 🎉',
        html: this.generateWelcomeTemplate(user, login, password)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent to:', user.email);
      return result;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Отправляет письмо с данными для входа после оплаты
   */
  // static async sendLoginCredentials(user, login, password) {
  //   try {
  //     const mailOptions = {
  //       from: process.env.YANDEX_EMAIL,
  //       to: user.email,
  //       subject: 'Данные для входа в личный кабинет 🔐',
  //       html: this.generateCredentialsTemplate(user, login, password)
  //     };

  //     const result = await transporter.sendMail(mailOptions);
  //     console.log('✅ Login credentials sent to:', user.email);
  //     return result;
  //   } catch (error) {
  //     console.error('❌ Error sending credentials email:', error);
  //     throw error;
  //   }
  // }

  /**
   * Шаблон приветственного письма
   */
  static generateWelcomeTemplate(user, login, password) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: #fff; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Добро пожаловать в клуб! 🎉</h1>
        </div>
        <div class="content">
            <h2>Уважаемый(ая) ${user.fullname},</h2>
            
            <p>Мы рады приветствовать вас в нашем клубе! Ваша регистрация успешно завершена.</p>
            
            <p>Теперь у вас есть доступ к эксклюзивным возможностям:</p>
            <ul>
                <li>Участие в розыгрышах призов</li>
                <li>Личный кабинет с историей участий</li>
                <li>Специальные предложения для членов клуба</li>
                <li>Поддержка 24/7</li>
            </ul>

            <div class="credentials">
                <h3>🔐 Ваши данные для входа:</h3>
                <p><strong>Логин:</strong> ${login}</p>
                <p><strong>Пароль:</strong> ${password}</p>
                <p><strong>Ссылка для входа:</strong> <a href="${process.env.APP_URL}/login">${process.env.APP_URL}/login</a></p>
            </div>

            <p>Рекомендуем сохранить эти данные в надежном месте.</p>

            <a href="${process.env.APP_URL}/login" class="button">Войти в личный кабинет</a>

            <div class="footer">
                <p>Если у вас возникли вопросы, свяжитесь с нами:</p>
                <p>Email: ${process.env.SUPPORT_EMAIL} | Телефон: ${process.env.SUPPORT_PHONE}</p>
                <p>© 2024 Ваш Клуб. Все права защищены.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Шаблон письма с данными для входа
   */
  static generateCredentialsTemplate(user, login, password) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { background: #f8f9fa; padding: 20px; margin-top: 10px; border-radius: 5px; }
        .credentials-box { background: white; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ваш доступ к личному кабинету 🔐</h1>
        </div>
        <div class="content">
            <p>Уважаемый(ая) ${user.fullname},</p>
            
            <p>Ваш взнос в клуб успешно оплачен! Вот данные для входа в личный кабинет:</p>
            
            <div class="credentials-box">
                <p><strong>Логин:</strong> ${login}</p>
                <p><strong>Пароль:</strong> ${password}</p>
                <p><strong>Ссылка для входа:</strong> <a href="${process.env.APP_URL}/login">${process.env.APP_URL}/login</a></p>
            </div>

            <div class="warning">
                <p><strong>⚠️ Важно:</strong> Сохраните эти данные. Для безопасности рекомендуется сменить пароль после первого входа.</p>
            </div>

            <p>Если у вас возникли проблемы со входом, свяжитесь с нашей поддержкой.</p>
            
            <p>С уважением,<br>Команда клуба</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Отправка тестового письма
   */
  static async sendTestEmail(toEmail) {
    try {
      const mailOptions = {
        from: process.env.YANDEX_EMAIL,
        to: toEmail,
        subject: 'Тестовое письмо от клуба ✅',
        text: 'Это тестовое письмо. Если вы его получили, значит почтовая система работает корректно.',
        html: '<h1>Тестовое письмо</h1><p>Почтовая система работает корректно!</p>'
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Test email sent successfully');
      return result;
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      throw error;
    }
  }
}

export default EmailService;