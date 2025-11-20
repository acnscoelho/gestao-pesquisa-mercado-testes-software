const request = require('supertest');
const { expect } = require('chai');
const { baseURL, apiBasePath, registerUser, generateUniqueEmail, generateUniqueCPF } = require('../helpers/testHelpers');
const usersFixture = require('../fixtures/users.json');

describe('JIRA-9167: Login por Perfil', () => {
  
  let testUser;

  // Setup: Cria um usuário para os testes de login
  before(async () => {
    testUser = {
      ...usersFixture.validUsers[0],
      email: generateUniqueEmail('login'),
      cpf: generateUniqueCPF()
    };

    await registerUser(testUser);
  });

  describe('CT-1: Verificar a autenticação de usuários com base em credenciais válidas e inválidas', () => {
    
    it('Deve autenticar usuário com credenciais válidas', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('sucesso');
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string');
      expect(response.body).to.have.property('user');
      expect(response.body.user.email).to.equal(testUser.email);
    });

    it('Deve rejeitar login com senha incorreta', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: 'SenhaErrada123'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('Credenciais inválidas');
    });

    it('Deve rejeitar login com e-mail não cadastrado', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: 'naoexiste@test.com',
          password: 'Senha123'
        });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });

    it('Deve rejeitar login sem e-mail', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          password: 'Senha123'
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('Deve rejeitar login sem senha', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });
  });

  describe('CT-2: Avaliar o comportamento do sistema após tentativas de login incorretas sucessivas', () => {
    
    let userForBlocking;

    before(async () => {
      // Cria um usuário específico para testar bloqueio
      userForBlocking = {
        ...usersFixture.validUsers[0],
        email: generateUniqueEmail('blocking'),
        cpf: generateUniqueCPF()
      };

      await registerUser(userForBlocking);
    });

    it('Deve informar o número de tentativas restantes após login incorreto', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: userForBlocking.email,
          password: 'SenhaErrada123'
        });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.include('tentativa');
    });

    it('Deve bloquear a conta após 3 tentativas incorretas', async () => {
      // Primeira tentativa incorreta
      await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: userForBlocking.email,
          password: 'SenhaErrada1'
        });

      // Segunda tentativa incorreta
      await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: userForBlocking.email,
          password: 'SenhaErrada2'
        });

      // Terceira tentativa incorreta
      const thirdAttempt = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: userForBlocking.email,
          password: 'SenhaErrada3'
        });

      expect(thirdAttempt.status).to.equal(403);
      expect(thirdAttempt.body.message).to.include('bloqueada');
      expect(thirdAttempt.body.message).to.include('15 minutos');
    });

    it('Deve impedir login mesmo com senha correta após bloqueio', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: userForBlocking.email,
          password: userForBlocking.password
        });

      expect(response.status).to.equal(403);
      expect(response.body.message).to.include('bloqueada');
    });
  });

  describe('CT-3: Validar a geração, validade e conteúdo do token de autenticação', () => {
    
    it('Deve gerar um token JWT válido no formato correto', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
      
      // JWT tem 3 partes separadas por ponto
      const tokenParts = response.body.token.split('.');
      expect(tokenParts).to.have.lengthOf(3);
    });

    it('Deve retornar informações do usuário junto com o token', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property('id');
      expect(response.body.user).to.have.property('email');
      expect(response.body.user).to.have.property('profile');
      expect(response.body.user).to.not.have.property('password');
    });

    it('Deve validar token através do endpoint /auth/validate', async () => {
      // Faz login para obter token
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Valida o token
      const validateResponse = await request(baseURL)
        .get(`${apiBasePath}/auth/validate`)
        .set('Authorization', `Bearer ${token}`);

      expect(validateResponse.status).to.equal(200);
      expect(validateResponse.body).to.have.property('message');
      expect(validateResponse.body.message).to.include('válido');
      expect(validateResponse.body).to.have.property('user');
    });
  });

  describe('CT-4: Confirmar a obrigatoriedade e uso do token para acessar rotas protegidas', () => {
    
    it('Deve negar acesso a rota protegida sem token', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/users/me`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });

    it('Deve negar acesso a rota protegida com token inválido', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/users/me`)
        .set('Authorization', 'Bearer tokeninvalido123');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });

    it('Deve permitir acesso a rota protegida com token válido', async () => {
      // Faz login para obter token válido
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Acessa rota protegida
      const response = await request(baseURL)
        .get(`${apiBasePath}/users/me`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('user');
    });

    it('Deve negar acesso sem o prefixo "Bearer" no header Authorization', async () => {
      // Faz login para obter token
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = loginResponse.body.token;

      // Tenta acessar sem Bearer
      const response = await request(baseURL)
        .get(`${apiBasePath}/users/me`)
        .set('Authorization', token);

      expect(response.status).to.equal(401);
    });
  });

  describe('CT-5: Verificar o controle de acesso e restrição de funcionalidades por perfil de usuário', () => {
    
    let adminUser, regularUser;

    before(async () => {
      // Cria usuário administrador
      adminUser = {
        ...usersFixture.validUsers[3],
        email: generateUniqueEmail('admin'),
        cpf: generateUniqueCPF()
      };
      await registerUser(adminUser);

      // Cria usuário regular
      regularUser = {
        ...usersFixture.validUsers[1],
        email: generateUniqueEmail('regular'),
        cpf: generateUniqueCPF()
      };
      await registerUser(regularUser);
    });

    it('Deve permitir acesso de administrador à listagem de usuários', async () => {
      // Login como admin
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: adminUser.email,
          password: adminUser.password
        });

      const token = loginResponse.body.token;

      // Acessa rota restrita a admins
      const response = await request(baseURL)
        .get(`${apiBasePath}/users`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('users');
    });

    it('Deve negar acesso de usuário regular à listagem de usuários', async () => {
      // Login como usuário regular
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: regularUser.email,
          password: regularUser.password
        });

      const token = loginResponse.body.token;

      // Tenta acessar rota restrita
      const response = await request(baseURL)
        .get(`${apiBasePath}/users`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('administrador');
    });

    it('Deve incluir informações de perfil no token JWT', async () => {
      const loginResponse = await request(baseURL)
        .post(`${apiBasePath}/auth/login`)
        .send({
          email: adminUser.email,
          password: adminUser.password
        });

      expect(loginResponse.body.user).to.have.property('profile');
      expect(loginResponse.body.user.profile).to.equal('administrador');
    });
  });
});

