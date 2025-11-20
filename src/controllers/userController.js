const userService = require('../services/userService');

class UserController {
  /**
   * Busca informações do próprio usuário
   */
  getMyProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = userService.getUserById(userId);

      res.status(200).json({
        message: 'Perfil recuperado com sucesso',
        user
      });
    } catch (error) {
      res.status(404).json({
        error: 'Erro ao buscar perfil',
        message: error.message
      });
    }
  }

  /**
   * Lista todos os usuários (apenas para administradores)
   */
  getAllUsers(req, res) {
    try {
      const users = userService.getAllUsers();

      res.status(200).json({
        message: 'Usuários recuperados com sucesso',
        total: users.length,
        users
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao listar usuários',
        message: error.message
      });
    }
  }

  /**
   * Busca usuário por ID (apenas para administradores)
   */
  getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = userService.getUserById(parseInt(id));

      res.status(200).json({
        message: 'Usuário recuperado com sucesso',
        user
      });
    } catch (error) {
      res.status(404).json({
        error: 'Erro ao buscar usuário',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();





