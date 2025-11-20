# 🔍 API de Gestão de Pesquisa do Mercado de Testes de Software

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Testes](https://github.com/acnscoelho/gestao-pesquisa-mercado-testes-software/actions/workflows/test.yml/badge.svg)
[![Mocha](https://img.shields.io/badge/Testes-Mocha%20%7C%20Chai-8D6748?logo=mocha)](https://mochajs.org/)
[![K6](https://img.shields.io/badge/Performance-K6-7D64FF?logo=k6)](https://k6.io/)

API Rest para gerenciamento de pesquisas sobre o mercado de testes de software no Brasil, desenvolvida por **Ana Cláudia Coelho**.

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/acnscoelho/gestao-pesquisa-mercado-testes-software.git
cd gestao-pesquisa-mercado-testes-software

# Instale as dependências
npm install

# Inicie o servidor
npm start

# Em outro terminal, execute os testes
npm test

# Acesse a documentação
open http://localhost:3000/api-docs
```

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Documentação da API](#documentação-da-api)
- [Autenticação](#autenticação)
- [Perfis de Usuário](#perfis-de-usuário)
- [Endpoints Principais](#endpoints-principais)
- [User Stories e Regras de Negócio](#user-stories-e-regras-de-negócio)
- [Testes Automatizados](#testes-automatizados)
- [Testes de Performance](#testes-de-performance)
- [CI/CD](#cicd)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 🎯 Sobre o Projeto

Esta API permite que profissionais, estudantes, gestores e recrutadores da área de testes de software contribuam com informações sobre o mercado, criando uma base de dados rica para análise do cenário atual da área de QA no Brasil.

### Funcionalidades Principais

- ✅ **Registro e autenticação** de usuários por perfil
- ✅ **Gestão de dados de pesquisa** (criar, atualizar, deletar)
- ✅ **Listagem e filtragem** avançada de dados com paginação
- ✅ **Estatísticas agregadas** para análise do mercado
- ✅ **Controle de acesso** baseado em perfis de usuário
- ✅ **Anonimização de dados** para garantir privacidade
- ✅ **Documentação interativa** com Swagger

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas para melhor organização e manutenibilidade:

```
┌─────────────────────┐
│      Routes         │  ← Definição de rotas e mapeamento HTTP
├─────────────────────┤
│    Controllers      │  ← Manipulação de requisições/respostas
├─────────────────────┤
│     Services        │  ← Lógica de negócio
├─────────────────────┤
│      Models         │  ← Definição de entidades
├─────────────────────┤
│   Database (RAM)    │  ← Armazenamento em memória
└─────────────────────┘
```

**Middleware de Autenticação**: Intercepta requisições para validar JWT e permissões.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web minimalista
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **Swagger UI Express** - Documentação interativa da API
- **YAML.js** - Parser para arquivos YAML
- **Express Validator** - Validação de dados

### Testes
- **Mocha** - Framework de testes funcionais
- **Chai** - Biblioteca de asserções
- **Supertest** - Testes de API REST
- **Mochawesome** - Relatórios HTML de testes funcionais
- **K6** - Testes de performance e carga
- **dotenv** - Gerenciamento de variáveis de ambiente

### CI/CD
- **GitHub Actions** - Integração e entrega contínua

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou yarn
- **K6** (opcional, para testes de performance) - [Instruções de instalação](https://k6.io/docs/get-started/installation/)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/acnscoelho/gestao-pesquisa-mercado-testes-software.git
cd gestao-pesquisa-mercado-testes-software
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente (para testes)**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Ou crie manualmente o arquivo .env com:
# BASE_URL=http://localhost:3000
# API_BASE_PATH=/api
# JWT_SECRET=your-secret-key-here
# REQUEST_TIMEOUT=10000
```

4. **Inicie o servidor**
```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

5. **Acesse a aplicação**
- 🌐 Servidor: http://localhost:3000
- 📚 Documentação: http://localhost:3000/api-docs
- 🔌 API: http://localhost:3000/api

### ⚙️ Instalar K6 (Testes de Performance)

**Windows:**
```powershell
winget install k6 --source winget
```

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

---

## 📜 Scripts NPM Disponíveis

```bash
# Servidor
npm start                    # Inicia a API em modo produção
npm run dev                  # Inicia a API em modo desenvolvimento (nodemon)

# Testes Funcionais
npm test                     # Executa testes funcionais
npm run test:report          # Executa testes e gera relatório HTML

# Testes de Performance
npm run test:performance     # Executa testes de performance K6
npm run test:performance:report  # Executa testes K6 e gera JSON
```

---

## 🚀 Uso

### Exemplo de Fluxo Completo

#### 1. Registrar um usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "12345678900",
    "password": "Senha123",
    "profile": "profissional_qa"
  }'
```

#### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "Senha123"
  }'
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### 3. Registrar dados de pesquisa (com token)

```bash
curl -X POST http://localhost:3000/api/research \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "cargo": "QA Engineer",
    "nivelExperiencia": "pleno",
    "faixaSalarial": "R$ 5.000 - R$ 7.000",
    "ferramentas": ["Selenium", "Cypress", "JMeter"],
    "localizacao": "São Paulo - SP",
    "areaAtuacao": "web"
  }'
```

#### 4. Listar dados com filtros

```bash
curl -X GET "http://localhost:3000/api/research?nivelExperiencia=pleno&localizacao=São Paulo&page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📚 Documentação da API

A documentação completa está disponível via **Swagger UI** após iniciar o servidor:

🔗 **http://localhost:3000/api-docs**

A documentação inclui:
- Todos os endpoints disponíveis
- Modelos de requisição e resposta
- Códigos de status HTTP
- Exemplos de uso
- Teste interativo de endpoints

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

### Como autenticar:

1. Faça login em `/api/auth/login`
2. Copie o token retornado
3. Inclua o token no header das requisições:
   ```
   Authorization: Bearer SEU_TOKEN_AQUI
   ```

### Tempo de expiração
- Tokens expiram em **24 horas**

### Bloqueio de conta
- Após **3 tentativas incorretas** de login, a conta é bloqueada por **15 minutos**

---

## 👥 Perfis de Usuário

| Perfil | Descrição | Permissões |
|--------|-----------|------------|
| **estudante** | Estudante da área de TI/QA | Acesso básico |
| **profissional_qa** | Profissional atuante em QA | Acesso básico |
| **gestor** | Gestor de equipe/projetos | Acesso a estatísticas |
| **recrutador** | Recrutador técnico | Acesso básico |
| **administrador** | Administrador do sistema | Acesso total |

---

## 🌐 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/validate` - Validar token JWT

### Usuários
- `GET /api/users/me` - Obter perfil do usuário autenticado
- `GET /api/users` - Listar todos os usuários (admin)
- `GET /api/users/:id` - Buscar usuário por ID (admin)

### Pesquisa
- `POST /api/research` - Criar novo registro de pesquisa
- `GET /api/research` - Listar e filtrar registros (com paginação)
- `GET /api/research/me` - Buscar registros do próprio usuário
- `PUT /api/research/:id` - Atualizar registro (apenas dono)
- `DELETE /api/research/:id` - Deletar registro (apenas dono)
- `GET /api/research/stats/all` - Obter estatísticas (admin/gestor)

### Filtros disponíveis em GET /api/research
- `cargo` - Filtrar por cargo
- `nivelExperiencia` - junior, pleno, senior, especialista
- `localizacao` - Filtrar por localização
- `faixaSalarial` - Filtrar por faixa salarial
- `ferramenta` - Filtrar por ferramenta específica
- `userProfile` - Filtrar por perfil de usuário
- `areaAtuacao` - Filtrar por área de atuação
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

---

## 📖 User Stories e Regras de Negócio

### **1. Registro de Usuário por Perfil**

**User Story:**
Como **usuário**, eu quero **me registrar na plataforma informando meu perfil (ex: estudante, profissional de QA, gestor ou recrutador)**, para que **eu possa acessar e participar da pesquisa do mercado de testes de software de forma personalizada conforme meu perfil**.

**Regras de Negócio:**
- ❌ Não pode haver **duplicidade de cadastro** (e-mail e CPF devem ser únicos)
- ✅ O campo **perfil de usuário** é obrigatório e deve aceitar apenas valores pré-definidos
- 🔒 A senha deve ter **mínimo de 8 caracteres**, incluindo letras maiúsculas, minúsculas e números
- 📅 O sistema deve **armazenar a data e hora do registro**

---

### **2. Login por Perfil**

**User Story:**
Como **usuário registrado**, eu quero **realizar login conforme meu perfil**, para que **eu possa acessar as funcionalidades da API de acordo com as permissões do meu tipo de usuário**.

**Regras de Negócio:**
- ✅ O login deve ser feito com **e-mail e senha válidos**
- 🚫 Após **três tentativas de login incorretas**, a conta deve ser **bloqueada temporariamente** (15 minutos)
- 🎫 Ao efetuar login com sucesso, o sistema deve **gerar um token de autenticação (JWT)** contendo o perfil do usuário e tempo de expiração (24h)
- 🔑 O token deve ser **obrigatório para acessar rotas protegidas** da API
- 🛡️ Usuários só poderão **acessar rotas correspondentes ao seu perfil**

---

### **3. Registrar Informações da Pesquisa do Mercado de Testes de Software**

**User Story:**
Como **usuário autenticado**, eu quero **registrar informações sobre o mercado de teste de software (ex: cargo, nível de experiência, salário, ferramentas utilizadas, localização)**, para que **os dados possam ser analisados e contribuam para o mapeamento do cenário atual da área de QA**.

**Regras de Negócio:**
- 🔐 Somente **usuários autenticados** podem registrar informações
- 👤 Cada registro deve ser **associado ao usuário e ao perfil**
- ✅ O sistema deve validar **campos obrigatórios**: área de atuação, nível de experiência e localização
- ❌ Não deve haver **registros duplicados** do mesmo usuário para a mesma coleta de pesquisa
- 🕵️ Os dados devem ser **armazenados de forma anônima ou pseudonimizada** para garantir privacidade
- ✏️ O usuário pode **atualizar ou excluir** suas próprias informações

---

### **4. Listar e Filtrar Informações Registradas**

**User Story:**
Como **administrador ou usuário autenticado com permissão**, eu quero **listar e filtrar as informações registradas na pesquisa**, para que **eu possa analisar os dados e gerar relatórios personalizados sobre o mercado de testes de software**.

**Regras de Negócio:**
- 📊 O sistema deve permitir **listagem completa** das informações registradas, exibindo apenas **dados anonimizados** (para usuários comuns)
- 🔍 Deve ser possível **filtrar por cargo, nível, região, faixa salarial, ferramentas ou perfil**
- 🔓 Apenas **usuários com permissão específica (ex: administrador, gestor)** podem visualizar todos os dados agregados (incluindo userId)
- 📄 O sistema deve **retornar resultados paginados** para otimizar a consulta
- 🔗 Os filtros aplicados devem ser **combináveis** (ex: cargo + região + ferramenta)

---

## 📁 Estrutura do Projeto

```
gestao-pesquisa-mercado-testes-software/
│
├── .github/
│   └── workflows/
│       └── test.yml          # Pipeline CI/CD (GitHub Actions)
│
├── src/
│   ├── controllers/          # Controladores (manipulação req/res)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── researchController.js
│   │
│   ├── database/             # Banco de dados em memória
│   │   └── memoryDB.js
│   │
│   ├── middleware/           # Middlewares personalizados
│   │   └── authMiddleware.js
│   │
│   ├── models/               # Modelos de dados
│   │   ├── User.js
│   │   └── ResearchData.js
│   │
│   ├── routes/               # Definição de rotas
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── researchRoutes.js
│   │   └── index.js
│   │
│   ├── services/             # Lógica de negócio
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── researchService.js
│   │
│   └── server.js             # Arquivo principal do servidor
│
├── resources/                # Recursos e documentação
│   └── swagger.yaml          # Documentação Swagger
│
├── test/                     # Testes automatizados
│   ├── auth/                 # Testes funcionais de autenticação
│   │   └── register.test.js  # Testes de registro
│   │
│   ├── fixtures/             # Dados de teste (Data Driven)
│   │   ├── users.json        # Fixtures de usuários
│   │   └── research.json     # Fixtures de pesquisa
│   │
│   ├── helpers/              # Funções auxiliares
│   │   └── testHelpers.js    # Helpers de teste
│   │
│   ├── hooks/                # Hooks compartilhados
│   │   └── globalHooks.js    # Setup de tokens JWT
│   │
│   └── k6/                   # Testes de performance
│       ├── config/
│       │   └── env.js        # Configurações K6
│       ├── auth/
│       │   └── register-performance.js  # Teste de carga
│       └── README.md         # Documentação K6
│
├── .env.example              # Exemplo de variáveis de ambiente
├── .gitignore
├── .mocharc.json             # Configuração do Mocha
├── CondicoesDeTeste.txt      # Condições de teste documentadas
├── package.json
└── README.md
```

---

## 🧪 Testes Automatizados

A API possui testes automatizados funcionais para garantir a qualidade e corretude das funcionalidades.

### 🎯 Executar Testes Funcionais

```bash
# Executar todos os testes funcionais
npm test

# Executar testes com relatório HTML
npm run test:report
```

### 📊 Cobertura de Testes Funcionais

#### JIRA-9165: Registro de Usuário por Perfil
- ✅ **CT-1**: Verificar registro de novo usuário com perfil "estudante"

#### JIRA-9165: Validação de Dados de Cadastro
- ✅ **CT-2**: Avaliar validação de unicidade (e-mail duplicado)

**Total:** 2 testes funcionais implementados

### 🛠️ Tecnologias de Teste

- **Mocha** - Framework de testes
- **Chai** - Biblioteca de asserções
- **Supertest** - Testes de API REST
- **Mochawesome** - Relatórios HTML

### ✨ Recursos de Teste

- 📦 **Data Driven Testing** - Dados organizados em fixtures JSON
- 🔄 **Hooks Reutilizáveis** - Gerenciamento automático de tokens JWT
- 🎯 **Helpers Customizados** - Funções para geração de dados únicos
- 📊 **Relatórios HTML** - Visualização detalhada com Mochawesome
- 🌐 **Variáveis de Ambiente** - Configuração via `.env` com dotenv

### 📁 Estrutura de Testes

```
test/
├── auth/
│   └── register.test.js       # Testes de registro de usuário
├── fixtures/
│   ├── users.json             # Dados de teste de usuários
│   └── research.json          # Dados de teste de pesquisa
├── helpers/
│   └── testHelpers.js         # Funções auxiliares
└── hooks/
    └── globalHooks.js         # Hooks compartilhados (JWT)
```

---

## ⚡ Testes de Performance

Os testes de performance são implementados com **K6** para avaliar o comportamento da API sob carga.

### 🚀 Executar Testes de Performance

```bash
# Executar teste de performance de registro
npm run test:performance

# Executar com relatório JSON
npm run test:performance:report
```

### 📊 Cenários Implementados

#### Registro de Usuário (POST /api/auth/register)
- **30 VUs (Virtual Users)** simultâneos
- **Duração**: 60 segundos
- **Threshold**: p(95) < 6s
  - *Nota: Tempo ajustado considerando o uso de bcrypt para hash de senha*

### 🎯 Métricas Avaliadas

- **Tempo de resposta**: p(95), p(90), média, mediana
- **Taxa de erro**: < 10%
- **Taxa de falha**: < 10%
- **Throughput**: Requisições por segundo
- **Validações funcionais**: Status 201, estrutura de resposta, etc.

### ⚙️ Por que 6 segundos?

O bcrypt é **intencionalmente lento** (computacionalmente caro) por design de segurança:
- Protege contra ataques de força bruta
- Com 30 usuários simultâneos, cada hash leva ~4-6s
- **Esse comportamento é esperado e desejável** em produção

### 📁 Estrutura de Testes K6

```
test/k6/
├── config/
│   └── env.js                 # Configurações de ambiente
├── auth/
│   └── register-performance.js # Teste de carga de registro
└── README.md                  # Documentação detalhada
```

Para mais detalhes, consulte [test/k6/README.md](test/k6/README.md)

---

## 🔄 CI/CD

A aplicação utiliza **GitHub Actions** para integração contínua e execução automatizada de testes.

### 🚀 Pipeline Automatizada

O pipeline é executado automaticamente em:
- ✅ **Push** para a branch `main`
- ✅ **Pull Requests** para a branch `main`

### 📋 Etapas do Pipeline

1. **Checkout do código**
2. **Configuração do Node.js 20.x**
3. **Instalação de dependências** (`npm ci`)
4. **Criação do arquivo `.env`** automaticamente
5. **Inicialização da API** em background
6. **Verificação de saúde** da API (health check)
7. **Execução dos testes funcionais** (`npm test`)
8. **Geração de relatórios HTML**
9. **Upload de artifacts** (relatórios ficam disponíveis por 30 dias)

### 📊 Visualizar Resultados

1. Acesse a aba **Actions** no repositório GitHub
2. Selecione o workflow executado
3. Visualize os logs e baixe os relatórios nos **artifacts**

### 🔧 Arquivo de Configuração

O workflow está definido em: `.github/workflows/test.yml`

### ✅ Status dos Testes

![Testes](https://github.com/acnscoelho/gestao-pesquisa-mercado-testes-software/actions/workflows/test.yml/badge.svg)

O badge acima mostra o status atual dos testes no CI.

---

## 🔒 Segurança

- ✅ Senhas armazenadas com **bcrypt** (hash seguro)
  - 🛡️ O bcrypt é intencionalmente lento (computacionalmente caro)
  - ⏱️ Isso resulta em tempos de resposta de 4-6s para registro/login sob carga
  - 🎯 Protege contra ataques de força bruta - comportamento desejável
- ✅ Autenticação via **JWT** com expiração (24h)
- ✅ Validação rigorosa de dados de entrada
- ✅ Proteção contra tentativas de login (bloqueio temporário - 15 min)
- ✅ Controle de acesso baseado em perfis (RBAC)
- ✅ Anonimização de dados sensíveis

---

## 📈 Status de Desenvolvimento

### Funcionalidades
- ✅ Sistema de autenticação JWT
- ✅ CRUD completo de usuários
- ✅ CRUD completo de pesquisas
- ✅ Sistema de filtros e paginação
- ✅ Estatísticas agregadas
- ✅ Documentação Swagger
- ✅ Controle de permissões por perfil
- ✅ Banco de dados em memória

### Qualidade e Testes
- ✅ **Testes funcionais automatizados** (Mocha, Chai, Supertest)
- ✅ **Testes de performance** (K6)
- ✅ **Relatórios HTML** (Mochawesome)
- ✅ **Data Driven Testing** (fixtures JSON)
- ✅ **Hooks e helpers** reutilizáveis
- ✅ **Variáveis de ambiente** (dotenv)

### CI/CD
- ✅ **GitHub Actions** - Pipeline automatizada
- ✅ **Testes automáticos** em PRs e pushes
- ✅ **Artifacts de relatórios** (30 dias de retenção)
- ✅ **Health checks** da API antes dos testes

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Ana Cláudia Coelho**

---

## 📞 Suporte

Para dúvidas ou sugestões, consulte a documentação Swagger em `/api-docs` após iniciar o servidor.

---

## 🔗 Links Úteis

- 📚 [Documentação Swagger](http://localhost:3000/api-docs) - Documentação interativa da API
- 🧪 [Documentação de Testes K6](test/k6/README.md) - Guia completo de testes de performance
- 📋 [Condições de Teste](CondicoesDeTeste.txt) - Especificação detalhada dos casos de teste
- 🔄 [GitHub Actions](https://github.com/acnscoelho/gestao-pesquisa-mercado-testes-software/actions) - Pipeline CI/CD
- 📊 [Swagger Spec](resources/swagger.yaml) - Especificação OpenAPI 3.0

---

## 📚 Recursos Adicionais

- [Mocha Documentation](https://mochajs.org/) - Framework de testes
- [Chai Assertions](https://www.chaijs.com/) - Biblioteca de asserções
- [Supertest](https://github.com/visionmedia/supertest) - Testes de API HTTP
- [K6 Documentation](https://k6.io/docs/) - Testes de performance e carga
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD
- [JWT.io](https://jwt.io/) - Debugger de tokens JWT

---

**Desenvolvido com ❤️ para a comunidade de QA no Brasil**
