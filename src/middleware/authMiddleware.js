const authService = require('../services/authService');
const memoryDB = require('../database/memoryDB');

/**
 * Middleware para verificar autenticação JWT
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de autenticação não fornecido',
        message: 'É necessário fornecer um token no header Authorization'
      });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({
        error: 'Token mal formatado',
        message: 'O formato deve ser: Bearer [token]'
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: 'Token mal formatado',
        message: 'O formato deve ser: Bearer [token]'
      });
    }

    try {
      const decoded = authService.verifyToken(token);

      // Verificar se o usuário ainda existe
      const user = memoryDB.findUserById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          error: 'Usuário não encontrado',
          message: 'O usuário associado a este token não existe mais'
        });
      }

      if (user.blocked) {
        return res.status(403).json({
          error: 'Conta bloqueada',
          message: 'Sua conta está bloqueada'
        });
      }

      // Adicionar informações do usuário na requisição
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        profile: decoded.profile
      };

      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido',
        message: error.message
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Erro no servidor',
      message: 'Erro ao processar autenticação'
    });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão baseada no perfil
 */
const authorize = (...allowedProfiles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Você precisa estar autenticado para acessar este recurso'
      });
    }

    if (!allowedProfiles.includes(req.user.profile)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: `Apenas usuários com perfil ${allowedProfiles.join(' ou ')} podem acessar este recurso`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};





