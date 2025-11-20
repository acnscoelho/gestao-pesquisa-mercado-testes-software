const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const routes = require('./routes');

// Inicializar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Carregar documentação Swagger
const swaggerDocument = YAML.load(path.join(__dirname, '../resources/swagger.yaml'));

// Endpoint para renderizar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'API Gestão de Pesquisa - Documentação',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Rotas da API
app.use('/api', routes);

// Rota raiz - redireciona para documentação
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Gestão de Pesquisa do Mercado de Testes de Software',
    version: '1.0.0',
    author: 'Ana Cláudia Coelho',
    documentation: '/api-docs',
    api: '/api'
  });
});

// Middleware para tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.url} não existe`,
    documentation: '/api-docs'
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Servidor iniciado com sucesso!');
  console.log('='.repeat(60));
  console.log(`📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('='.repeat(60));
  console.log('📋 Endpoints disponíveis:');
  console.log('   - POST   /api/auth/register      - Registrar usuário');
  console.log('   - POST   /api/auth/login         - Fazer login');
  console.log('   - GET    /api/auth/validate      - Validar token');
  console.log('   - GET    /api/users/me           - Obter perfil');
  console.log('   - GET    /api/users              - Listar usuários (admin)');
  console.log('   - POST   /api/research           - Criar pesquisa');
  console.log('   - GET    /api/research           - Listar pesquisas');
  console.log('   - GET    /api/research/me        - Minhas pesquisas');
  console.log('   - PUT    /api/research/:id       - Atualizar pesquisa');
  console.log('   - DELETE /api/research/:id       - Deletar pesquisa');
  console.log('   - GET    /api/research/stats/all - Estatísticas (admin/gestor)');
  console.log('='.repeat(60));
});

module.exports = app;





