const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const researchRoutes = require('./researchRoutes');

/**
 * Configuração central de rotas
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/research', researchRoutes);

/**
 * Rota raiz da API
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API de Gestão de Pesquisa do Mercado de Testes de Software',
    version: '1.0.0',
    author: 'Ana Cláudia Coelho',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      research: '/api/research',
      documentation: '/api-docs'
    }
  });
});

module.exports = router;





