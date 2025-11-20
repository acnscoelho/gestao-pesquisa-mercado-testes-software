const request = require('supertest');
require('dotenv').config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const apiBasePath = process.env.API_BASE_PATH || '/api';

/**
 * Helper para registrar um usuário
 */
async function registerUser(userData) {
  const response = await request(baseURL)
    .post(`${apiBasePath}/auth/register`)
    .send(userData);
  return response;
}

/**
 * Helper para fazer login e obter token
 */
async function loginUser(email, password) {
  const response = await request(baseURL)
    .post(`${apiBasePath}/auth/login`)
    .send({ email, password });
  return response;
}

/**
 * Helper para obter token JWT de um usuário
 */
async function getAuthToken(email, password) {
  const response = await loginUser(email, password);
  return response.body.token;
}

/**
 * Helper para criar um registro de pesquisa
 */
async function createResearch(token, researchData) {
  const response = await request(baseURL)
    .post(`${apiBasePath}/research`)
    .set('Authorization', `Bearer ${token}`)
    .send(researchData);
  return response;
}

/**
 * Helper para gerar email único baseado em timestamp
 */
function generateUniqueEmail(prefix = 'user') {
  const timestamp = Date.now();
  return `${prefix}.${timestamp}@test.com`;
}

/**
 * Helper para gerar CPF único baseado em timestamp
 */
function generateUniqueCPF() {
  const timestamp = Date.now().toString();
  return timestamp.substring(timestamp.length - 11).padStart(11, '0');
}

/**
 * Helper para criar um usuário completo (registro + login)
 */
async function createUserWithToken(userData) {
  const uniqueEmail = generateUniqueEmail(userData.email.split('@')[0]);
  const uniqueCPF = generateUniqueCPF();
  
  const userDataWithUniqueFields = {
    ...userData,
    email: uniqueEmail,
    cpf: uniqueCPF
  };

  const registerResponse = await registerUser(userDataWithUniqueFields);
  
  if (registerResponse.status === 201) {
    const token = await getAuthToken(uniqueEmail, userData.password);
    return {
      user: registerResponse.body.user,
      token,
      credentials: {
        email: uniqueEmail,
        password: userData.password
      }
    };
  }
  
  throw new Error('Failed to create user');
}

module.exports = {
  baseURL,
  apiBasePath,
  registerUser,
  loginUser,
  getAuthToken,
  createResearch,
  generateUniqueEmail,
  generateUniqueCPF,
  createUserWithToken
};

