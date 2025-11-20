const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

/**
 * @route   POST /api/research
 * @desc    Criar novo registro de pesquisa
 * @access  Private (usuários autenticados)
 */
router.post('/', authenticate, (req, res) => researchController.createResearch(req, res));

/**
 * @route   PUT /api/research/:id
 * @desc    Atualizar registro de pesquisa
 * @access  Private (apenas dono do registro)
 */
router.put('/:id', authenticate, (req, res) => researchController.updateResearch(req, res));

/**
 * @route   DELETE /api/research/:id
 * @desc    Deletar registro de pesquisa
 * @access  Private (apenas dono do registro)
 */
router.delete('/:id', authenticate, (req, res) => researchController.deleteResearch(req, res));

/**
 * @route   GET /api/research/me
 * @desc    Buscar registros de pesquisa do próprio usuário
 * @access  Private
 */
router.get('/me', authenticate, (req, res) => researchController.getMyResearch(req, res));

/**
 * @route   GET /api/research
 * @desc    Listar e filtrar registros de pesquisa (dados anonimizados)
 * @access  Private
 */
router.get('/', authenticate, (req, res) => researchController.listResearch(req, res));

/**
 * @route   GET /api/research/statistics
 * @desc    Obter estatísticas agregadas
 * @access  Private (apenas administradores e gestores)
 */
router.get(
  '/stats/all',
  authenticate,
  authorize(User.PROFILES.ADMINISTRADOR, User.PROFILES.GESTOR),
  (req, res) => researchController.getStatistics(req, res)
);

module.exports = router;





