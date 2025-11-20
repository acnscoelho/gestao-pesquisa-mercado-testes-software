import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { getApiUrl } from '../config/env.js';

/**
 * Teste de Performance: Registro de Usuário
 * 
 * Este teste avalia a performance do endpoint de registro de usuário sob carga.
 * 
 * NOTA IMPORTANTE: O tempo de resposta pode parecer alto (4-6s) devido ao uso de bcrypt
 * para hash de senha. O bcrypt é intencionalmente lento (computacionalmente caro) para
 * aumentar a segurança contra ataques de força bruta. Este comportamento é esperado e
 * desejável em ambientes de produção.
 */

// Métricas customizadas
const errorRate = new Rate('errors');

// Configuração do teste de carga
export const options = {
  vus: 30, // 30 usuários virtuais simultâneos
  duration: '60s', // Durante 60 segundos
  thresholds: {
    http_req_duration: ['p(95)<6000'], // 95% das requisições devem responder em até 6 segundos (ajustado para bcrypt)
    errors: ['rate<0.1'], // Taxa de erro deve ser menor que 10%
    http_req_failed: ['rate<0.1'], // Taxa de falha de requisições deve ser menor que 10%
  },
};

// Função para gerar email único baseado em timestamp e VU
function generateUniqueEmail(prefix = 'user') {
  const timestamp = Date.now();
  const vuId = __VU; // ID do usuário virtual
  const iteration = __ITER; // Número da iteração
  return `${prefix}.${timestamp}.${vuId}.${iteration}@test.com`;
}

// Função para gerar CPF único baseado em timestamp
function generateUniqueCPF() {
  const timestamp = Date.now().toString();
  const vuId = __VU.toString().padStart(2, '0');
  const iteration = __ITER.toString().padStart(2, '0');
  return (timestamp + vuId + iteration).substring(0, 11).padStart(11, '0');
}

// Função principal do teste
export default function () {
  // Dados do usuário para registro
  const userData = {
    name: 'Maria Santos',
    email: generateUniqueEmail('estudante'),
    cpf: generateUniqueCPF(),
    password: 'Senha456',
    profile: 'estudante',
  };

  // Headers da requisição
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Executa a requisição de registro
  const response = http.post(
    getApiUrl('/auth/register'),
    JSON.stringify(userData),
    params
  );

  // Validações
  const checkResult = check(response, {
    'status é 201': (r) => r.status === 201,
    'resposta contém message': (r) => r.json('message') !== undefined,
    'resposta contém user': (r) => r.json('user') !== undefined,
    'user possui id': (r) => r.json('user.id') !== undefined,
    'email do usuário está correto': (r) => r.json('user.email') === userData.email,
    'profile do usuário é estudante': (r) => r.json('user.profile') === 'estudante',
    'senha não é retornada': (r) => r.json('user.password') === undefined,
    'tempo de resposta < 6s': (r) => r.timings.duration < 6000,
  });

  // Registra erro se alguma validação falhar
  errorRate.add(!checkResult);

  // Pequeno intervalo entre requisições (simula comportamento real)
  sleep(1);
}

// Função de setup - executada uma vez antes do teste
export function setup() {
  console.log('🚀 Iniciando teste de performance: Registro de Usuário');
  console.log('⚙️  Configuração: 30 VUs por 60 segundos');
  console.log('📊 Threshold: p95 < 6s (ajustado para bcrypt)');
  console.log('');
}

// Função de teardown - executada uma vez após o teste
export function teardown(data) {
  console.log('');
  console.log('✅ Teste de performance finalizado');
}

