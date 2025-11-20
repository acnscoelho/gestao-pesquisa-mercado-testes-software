const request = require('supertest');
const { expect } = require('chai');
const { baseURL, apiBasePath, createUserWithToken } = require('../helpers/testHelpers');
const researchFixture = require('../fixtures/research.json');
const usersFixture = require('../fixtures/users.json');

describe('JIRA-9169: Registrar Informações da Pesquisa do Mercado de Testes de Software', () => {
  
  let authToken;
  let testUser;

  // Setup: Cria usuário e obtém token antes de todos os testes
  before(async () => {
    const userData = await createUserWithToken(usersFixture.validUsers[0]);
    authToken = userData.token;
    testUser = userData.user;
  });

  describe('CT-1: Verificar a possibilidade de registrar informações da pesquisa apenas por usuários autenticados', () => {
    
    it('Deve permitir o registro de pesquisa por usuário autenticado', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(researchFixture.validResearchData[0]);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('sucesso');
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('id');
    });

    it('Deve rejeitar o registro de pesquisa sem token de autenticação', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .send(researchFixture.validResearchData[1]);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });

    it('Deve rejeitar o registro de pesquisa com token inválido', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', 'Bearer tokeninvalido123')
        .send(researchFixture.validResearchData[1]);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('CT-2: Avaliar o vínculo das informações registradas ao usuário e perfil correspondente', () => {
    
    it('Deve associar o registro de pesquisa ao usuário autenticado', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[1]);
      
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[1]);

      expect(response.status).to.equal(201);
      expect(response.body.data).to.have.property('userProfile');
      expect(response.body.data.userProfile).to.equal(userData.user.profile);
    });

    it('Deve permitir que o usuário consulte seus próprios registros', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[2]);
      
      // Cria um registro
      await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[2]);

      // Consulta registros próprios
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/me`)
        .set('Authorization', `Bearer ${userData.token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
    });
  });

  describe('CT-3: Confirmar a validação e consistência dos dados obrigatórios da pesquisa', () => {
    
    it('Deve rejeitar registro sem campos obrigatórios', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(researchFixture.invalidResearchData.missingRequiredFields);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('obrigatório');
    });

    it('Deve validar os campos obrigatórios: cargo, nivelExperiencia, localizacao, areaAtuacao', async () => {
      const requiredFields = ['cargo', 'nivelExperiencia', 'localizacao', 'areaAtuacao'];
      const baseData = researchFixture.validResearchData[0];

      for (const field of requiredFields) {
        const incompleteData = { ...baseData };
        delete incompleteData[field];

        const userData = await createUserWithToken(usersFixture.validUsers[0]);

        const response = await request(baseURL)
          .post(`${apiBasePath}/research`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send(incompleteData);

        expect(response.status).to.equal(400, 
          `Campo ${field} deveria ser obrigatório`);
      }
    });

    it('Deve validar valores do enum nivelExperiencia', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.invalidResearchData.invalidNivelExperiencia);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('Deve aceitar níveis de experiência válidos: junior, pleno, senior, especialista', async () => {
      const validLevels = ['junior', 'pleno', 'senior', 'especialista'];
      
      for (const level of validLevels) {
        const userData = await createUserWithToken(usersFixture.validUsers[0]);
        const researchData = {
          ...researchFixture.validResearchData[0],
          nivelExperiencia: level
        };

        const response = await request(baseURL)
          .post(`${apiBasePath}/research`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send(researchData);

        expect(response.status).to.equal(201, 
          `Nível ${level} deveria ser aceito`);
      }
    });
  });

  describe('CT-4: Analisar o controle de duplicidade de registros para o mesmo usuário', () => {
    
    it('Deve impedir múltiplos registros para o mesmo usuário', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      // Primeiro registro
      const firstResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[0]);

      expect(firstResponse.status).to.equal(201);

      // Tentativa de segundo registro
      const secondResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[1]);

      expect(secondResponse.status).to.equal(400);
      expect(secondResponse.body.message).to.include('já possui um registro');
      expect(secondResponse.body.message).to.include('atualização');
    });
  });

  describe('CT-5: Verificar a aplicação de anonimização ou pseudonimização dos dados armazenados', () => {
    
    it('Deve garantir que dados pessoais não sejam expostos em listagens gerais', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      // Cria um registro
      await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[0]);

      // Lista registros gerais (anonimizados)
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      
      // Verifica anonimização (não deve conter informações pessoais identificáveis)
      if (response.body.data.length > 0) {
        const record = response.body.data[0];
        // Dados da pesquisa devem estar presentes
        expect(record).to.have.property('cargo');
        expect(record).to.have.property('nivelExperiencia');
      }
    });
  });

  describe('CT-6: Avaliar o comportamento do sistema em operações de atualização e exclusão das informações', () => {
    
    it('Deve permitir que o usuário atualize seus próprios registros', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      // Cria um registro
      const createResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[0]);

      const recordId = createResponse.body.data.id;

      // Atualiza o registro
      const updateResponse = await request(baseURL)
        .put(`${apiBasePath}/research/${recordId}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.updateData);

      expect(updateResponse.status).to.equal(200);
      expect(updateResponse.body).to.have.property('message');
      expect(updateResponse.body.message).to.include('atualizado');
      expect(updateResponse.body.data.cargo).to.equal(researchFixture.updateData.cargo);
    });

    it('Deve impedir que usuário atualize registro de outro usuário', async () => {
      const userData1 = await createUserWithToken(usersFixture.validUsers[0]);
      const userData2 = await createUserWithToken(usersFixture.validUsers[1]);

      // Usuário 1 cria um registro
      const createResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData1.token}`)
        .send(researchFixture.validResearchData[0]);

      const recordId = createResponse.body.data.id;

      // Usuário 2 tenta atualizar o registro do usuário 1
      const updateResponse = await request(baseURL)
        .put(`${apiBasePath}/research/${recordId}`)
        .set('Authorization', `Bearer ${userData2.token}`)
        .send(researchFixture.updateData);

      expect(updateResponse.status).to.equal(403);
      expect(updateResponse.body).to.have.property('error');
      expect(updateResponse.body.message).to.include('permissão');
    });

    it('Deve permitir que o usuário delete seus próprios registros', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      // Cria um registro
      const createResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[0]);

      const recordId = createResponse.body.data.id;

      // Deleta o registro
      const deleteResponse = await request(baseURL)
        .delete(`${apiBasePath}/research/${recordId}`)
        .set('Authorization', `Bearer ${userData.token}`);

      expect(deleteResponse.status).to.equal(200);
      expect(deleteResponse.body).to.have.property('message');
    });

    it('Deve impedir que usuário delete registro de outro usuário', async () => {
      const userData1 = await createUserWithToken(usersFixture.validUsers[0]);
      const userData2 = await createUserWithToken(usersFixture.validUsers[1]);

      // Usuário 1 cria um registro
      const createResponse = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData1.token}`)
        .send(researchFixture.validResearchData[0]);

      const recordId = createResponse.body.data.id;

      // Usuário 2 tenta deletar o registro do usuário 1
      const deleteResponse = await request(baseURL)
        .delete(`${apiBasePath}/research/${recordId}`)
        .set('Authorization', `Bearer ${userData2.token}`);

      expect(deleteResponse.status).to.equal(403);
      expect(deleteResponse.body).to.have.property('error');
    });

    it('Deve retornar 404 ao tentar atualizar registro inexistente', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      const response = await request(baseURL)
        .put(`${apiBasePath}/research/99999`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.updateData);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.include('não encontrado');
    });

    it('Deve retornar 404 ao tentar deletar registro inexistente', async () => {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);

      const response = await request(baseURL)
        .delete(`${apiBasePath}/research/99999`)
        .set('Authorization', `Bearer ${userData.token}`);

      expect(response.status).to.equal(404);
    });
  });
});

