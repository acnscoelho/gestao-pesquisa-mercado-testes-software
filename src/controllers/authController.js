const authService = require('../services/authService');
const userService = require('../services/userService');

class AuthController {
  /**
   * Endpoint de registro de usuário
   */
  async register(req, res) {
    try {
      const userData = req.body;
      const user = await userService.register(userData);

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user
      });
    } catch (error) {
      res.status(400).json({
        error: 'Erro ao registrar usuário',
        message: error.message
      });
    }
  }

  /**
   * Endpoint de login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Dados incompletos',
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        message: 'Login realizado com sucesso',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      // Verificar se é erro de conta bloqueada
      if (error.message.includes('bloqueada')) {
        return res.status(403).json({
          error: 'Conta bloqueada',
          message: error.message
        });
      }

      res.status(401).json({
        error: 'Erro ao fazer login',
        message: error.message
      });
    }
  }

  /**
   * Endpoint para validar token
   */
  validateToken(req, res) {
    // Se chegou aqui, o token já foi validado pelo middleware
    res.status(200).json({
      message: 'Token válido',
      user: req.user
    });
  }
}

module.exports = new AuthController();





