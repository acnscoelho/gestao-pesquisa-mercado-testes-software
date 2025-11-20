const memoryDB = require('../database/memoryDB');
const User = require('../models/User');
const authService = require('./authService');

class UserService {
  /**
   * Valida CPF
   */
  validateCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    return true;
  }

  /**
   * Valida email
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Registra um novo usuário
   */
  async register(userData) {
    const { name, email, cpf, password, profile } = userData;

    // Validações
    if (!name || !email || !cpf || !password || !profile) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (!this.validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!this.validateCPF(cpf)) {
      throw new Error('CPF inválido');
    }

    // Verificar perfil válido
    const validProfiles = Object.values(User.PROFILES);
    if (!validProfiles.includes(profile)) {
      throw new Error(`Perfil inválido. Valores aceitos: ${validProfiles.join(', ')}`);
    }

    // Validar senha
    const passwordValidation = authService.validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Verificar duplicidade
    if (memoryDB.findUserByEmail(email)) {
      throw new Error('Email já cadastrado');
    }

    if (memoryDB.findUserByCPF(cpf)) {
      throw new Error('CPF já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await authService.hashPassword(password);

    // Criar usuário
    const user = new User(
      memoryDB.getNextUserId(),
      name,
      email,
      cpf,
      hashedPassword,
      profile,
      new Date()
    );

    memoryDB.addUser(user);

    return user.toJSON();
  }

  /**
   * Busca um usuário por ID
   */
  getUserById(id) {
    const user = memoryDB.findUserById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user.toJSON();
  }

  /**
   * Lista todos os usuários (apenas para administradores)
   */
  getAllUsers() {
    return memoryDB.users.map(user => user.toJSON());
  }
}

module.exports = new UserService();





