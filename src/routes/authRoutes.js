const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 * @access  Public
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /api/auth/login
 * @desc    Fazer login
 * @access  Public
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route   GET /api/auth/validate
 * @desc    Validar token JWT
 * @access  Private
 */
router.get('/validate', authenticate, (req, res) => authController.validateToken(req, res));

module.exports = router;





