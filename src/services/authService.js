const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const memoryDB = require('../database/memoryDB');

const JWT_SECRET = 'sua_chave_secreta_super_segura_12345'; // Em produção, usar variável de ambiente
const JWT_EXPIRATION = '24h';
const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos

class AuthService {
  /**
   * Gera um token JWT
   */
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      profile: user.profile
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Verifica um token JWT
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Realiza o login do usuário
   */
  async login(email, password) {
    const user = memoryDB.findUserByEmail(email);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar se a conta está bloqueada
    if (user.blocked && user.blockedUntil) {
      const now = new Date();
      if (now < user.blockedUntil) {
        const minutesRemaining = Math.ceil((user.blockedUntil - now) / 60000);
        throw new Error(`Conta bloqueada. Tente novamente em ${minutesRemaining} minuto(s)`);
      } else {
        // Desbloquear conta se o tempo já passou
        memoryDB.updateUser(user.id, {
          blocked: false,
          blockedUntil: null,
          loginAttempts: 0
        });
        user.blocked = false;
        user.blockedUntil = null;
        user.loginAttempts = 0;
      }
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incrementar tentativas de login
      const newAttempts = user.loginAttempts + 1;

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS);
        memoryDB.updateUser(user.id, {
          loginAttempts: newAttempts,
          blocked: true,
          blockedUntil: blockedUntil
        });
        throw new Error('Conta bloqueada após 3 tentativas incorretas. Tente novamente em 15 minutos');
      }

      memoryDB.updateUser(user.id, { loginAttempts: newAttempts });
      throw new Error(`Credenciais inválidas. ${MAX_LOGIN_ATTEMPTS - newAttempts} tentativa(s) restante(s)`);
    }

    // Login bem-sucedido - resetar tentativas
    memoryDB.updateUser(user.id, { loginAttempts: 0 });

    const token = this.generateToken(user);

    return {
      token,
      user: user.toJSON()
    };
  }

  /**
   * Valida a força da senha
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: 'A senha deve ter no mínimo 8 caracteres' };
    }

    if (!hasUpperCase) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
    }

    if (!hasLowerCase) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
    }

    if (!hasNumber) {
      return { valid: false, message: 'A senha deve conter pelo menos um número' };
    }

    return { valid: true };
  }

  /**
   * Criptografa uma senha
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

module.exports = new AuthService();





