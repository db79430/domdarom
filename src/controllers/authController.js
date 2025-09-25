import UserService from '../services/userServices.js';

class AuthController {
    static async login(req, res) {
        try {
            const { login, password } = req.body;
            
            console.log('🔐 Login attempt for:', login);
            
            // ВАЖНО: Устанавливаем Content-Type ДО любого ответа
            res.setHeader('Content-Type', 'application/json');
            
            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Заполните все поля'
                });
            }

            const authResult = await UserService.authenticate(login, password);
            
            if (!authResult.success) {
                return res.status(401).json({
                    success: false,
                    message: authResult.message || 'Ошибка аутентификации'
                });
            }

            // Устанавливаем куки
            const cookieOptions = {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };

            res.cookie('user_id', authResult.user.user_id, cookieOptions);
            res.cookie('user_email', authResult.user.email, cookieOptions);
            res.cookie('user_fullname', authResult.user.fullname, cookieOptions);

            // ✅ УПРОЩЕННАЯ ВЕРСИЯ - ВСЕГДА возвращаем JSON
            console.log('✅ Sending JSON response for user:', authResult.user.user_id);
            
            return res.json({
                success: true,
                message: 'Вход выполнен успешно',
                redirect_url: `/account?user_id=${authResult.user.user_id}`,
                user: {
                    id: authResult.user.user_id,
                    email: authResult.user.email,
                    name: authResult.user.fullname
                }
            });

        } catch (error) {
            console.error('❌ Login error:', error);
            
            // ВАЖНО: Устанавливаем Content-Type для ошибок тоже
            res.setHeader('Content-Type', 'application/json');
            
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}

export default AuthController;