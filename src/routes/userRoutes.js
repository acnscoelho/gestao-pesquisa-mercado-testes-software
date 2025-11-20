const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

/**
 * @route   GET /api/users/me
 * @desc    Obter perfil do usuário autenticado
 * @access  Private
 */
router.get('/me', authenticate, (req, res) => userController.getMyProfile(req, res));

/**
 * @route   GET /api/users
 * @desc    Listar todos os usuários
 * @access  Private (apenas administradores)
 */
router.get(
  '/', 
  authenticate, 
  authorize(User.PROFILES.ADMINISTRADOR),
  (req, res) => userController.getAllUsers(req, res)
);

/**
 * @route   GET /api/users/:id
 * @desc    Buscar usuário por ID
 * @access  Private (apenas administradores)
 */
router.get(
  '/:id', 
  authenticate, 
  authorize(User.PROFILES.ADMINISTRADOR),
  (req, res) => userController.getUserById(req, res)
);

module.exports = router;





