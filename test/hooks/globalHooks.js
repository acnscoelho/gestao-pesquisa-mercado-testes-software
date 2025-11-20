const { createUserWithToken } = require('../helpers/testHelpers');
const usersFixture = require('../fixtures/users.json');

// Armazena tokens e usuários criados para uso nos testes
let testUsers = {};

/**
 * Hook global: Executado antes de todos os testes
 * Cria usuários de teste e obtém tokens JWT para cada perfil
 */
async function setupTestUsers() {
  console.log('\n🔧 Configurando usuários de teste...');
  
  try {
    // Cria usuários para cada perfil
    for (const user of usersFixture.validUsers) {
      const { user: createdUser, token, credentials } = await createUserWithToken(user);
      testUsers[user.profile] = {
        user: createdUser,
        token,
        credentials
      };
      console.log(`✓ Usuário criado: ${user.profile}`);
    }
    
    console.log('✓ Todos os usuários de teste foram configurados\n');
  } catch (error) {
    console.error('✗ Erro ao configurar usuários de teste:', error.message);
    throw error;
  }
}

/**
 * Obtém o token de um perfil específico
 */
function getTokenByProfile(profile) {
  if (!testUsers[profile]) {
    throw new Error(`Perfil ${profile} não encontrado. Execute setupTestUsers primeiro.`);
  }
  return testUsers[profile].token;
}

/**
 * Obtém o usuário completo de um perfil específico
 */
function getUserByProfile(profile) {
  if (!testUsers[profile]) {
    throw new Error(`Perfil ${profile} não encontrado. Execute setupTestUsers primeiro.`);
  }
  return testUsers[profile];
}

/**
 * Limpa os dados de teste
 */
function cleanupTestUsers() {
  testUsers = {};
}

/**
 * Obtém todos os usuários de teste
 */
function getAllTestUsers() {
  return testUsers;
}

module.exports = {
  setupTestUsers,
  getTokenByProfile,
  getUserByProfile,
  cleanupTestUsers,
  getAllTestUsers
};

