// Configurações de ambiente para testes K6
export const config = {
  BASE_URL: __ENV.BASE_URL || 'http://localhost:3000',
  API_BASE_PATH: '/api',
};

// URL completa da API
export const getApiUrl = (endpoint) => {
  return `${config.BASE_URL}${config.API_BASE_PATH}${endpoint}`;
};

