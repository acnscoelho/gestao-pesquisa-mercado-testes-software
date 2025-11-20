# 🚀 Testes de Performance com K6

## Descrição

Testes de performance implementados com K6 para avaliar o tempo de resposta e capacidade de carga dos endpoints da API.

## 📋 Pré-requisitos

### Instalar K6

**Windows:**
```powershell
winget install k6 --source winget
```
ou baixe em: https://k6.io/docs/get-started/installation/

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**macOS:**
```bash
brew install k6
```

## ⚙️ Configuração

Os testes utilizam variáveis de ambiente definidas em `test/k6/config/env.js`:
- `BASE_URL`: URL base da API (padrão: http://localhost:3000)
- `API_BASE_PATH`: Caminho base da API (padrão: /api)

## 🧪 Executando os Testes

### 1. Iniciar a API
```bash
npm start
```

### 2. Executar teste de registro
```bash
k6 run test/k6/auth/register-performance.js
```

### 3. Executar com URL customizada
```bash
k6 run -e BASE_URL=http://localhost:3000 test/k6/auth/register-performance.js
```

## 📊 Thresholds Configurados

### Teste de Registro de Usuário
- **VUs (Virtual Users)**: 30 usuários simultâneos
- **Duração**: 60 segundos
- **Thresholds**:
  - `http_req_duration p(95) < 6000ms (6s)`: 95% das requisições devem responder em até 6 segundos
    - **Nota**: Threshold ajustado considerando o uso de bcrypt para hash de senha (operação intencionalmente lenta por segurança)
  - `errors < 10%`: Taxa de erro deve ser menor que 10%
  - `http_req_failed < 10%`: Falhas de requisição devem ser menores que 10%

## 📈 Interpretando os Resultados

Após a execução, o K6 mostrará:

```
✓ status é 201
✓ resposta contém message
✓ resposta contém user
✓ user possui id
✓ email do usuário está correto
✓ profile do usuário é estudante
✓ senha não é retornada
✓ tempo de resposta < 6s

http_req_duration..........: avg=4s min=2s med=3.8s max=6s p(90)=5.2s p(95)=5.6s
http_reqs..................: 388 6/s
vus........................: 30 min=30 max=30
```

### Métricas Importantes:
- **http_req_duration**: Tempo de resposta das requisições
  - `avg`: Tempo médio
  - `p(95)`: 95% das requisições foram mais rápidas que esse valor
- **http_reqs**: Total de requisições executadas
- **errors**: Taxa de erros nas validações
- **vus**: Número de usuários virtuais

## ✅ Critérios de Sucesso

O teste é considerado bem-sucedido quando:
1. ✅ p(95) do `http_req_duration` < 6000ms (6s)
2. ✅ Taxa de erro < 10%
3. ✅ Todas as validações (checks) passam > 90%

**Nota**: O tempo de resposta de 6 segundos pode parecer alto, mas é esperado para operações de registro que utilizam bcrypt para hash de senha. O bcrypt é intencionalmente lento (computacionalmente caro) para aumentar a segurança contra ataques de força bruta.

## 🎯 Cenários de Teste

### Registro de Usuário (register-performance.js)
- Simula 30 usuários tentando se registrar simultaneamente
- Gera emails únicos usando timestamp + VU ID + iteração
- Valida:
  - Status code 201
  - Estrutura da resposta
  - Campos do usuário
  - Tempo de resposta (< 6s, considerando bcrypt)

## 📝 Estrutura dos Testes

```
test/k6/
├── config/
│   └── env.js              # Configurações de ambiente
└── auth/
    └── register-performance.js  # Teste de performance de registro
```

## 🔧 Personalizando os Testes

Para alterar a carga do teste, edite as `options` no arquivo:

```javascript
export const options = {
  vus: 50,           // Aumentar para 50 VUs
  duration: '120s',  // Aumentar duração para 120s
  thresholds: {
    http_req_duration: ['p(95)<8000'], // Ajustar threshold conforme necessário
  },
};
```

**Importante**: Ao ajustar thresholds de tempo, considere que operações com bcrypt são intencionalmente lentas. Para endpoints sem bcrypt (como listagem), thresholds mais rigorosos (< 200ms) são apropriados.

## 📊 Gerando Relatórios HTML

```bash
k6 run --out json=test-results/performance.json test/k6/auth/register-performance.js
```

Depois use ferramentas como `k6-reporter` para converter em HTML.

