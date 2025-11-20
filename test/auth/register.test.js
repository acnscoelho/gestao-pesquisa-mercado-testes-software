const request = require('supertest');
const { expect } = require('chai');
const { baseURL, apiBasePath, generateUniqueEmail, generateUniqueCPF } = require('../helpers/testHelpers');
const usersFixture = require('../fixtures/users.json');

describe('JIRA-9165: Registro de Usuário por Perfil', () => {
  
  describe('CT-1: Verificar o comportamento do sistema ao realizar o registro de um novo usuário por perfil', () => {
    
    it('Deve permitir o registro de um novo usuário com perfil "estudante"', async () => {
      const userData = {
        ...usersFixture.validUsers[1],
        email: generateUniqueEmail('estudante'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('sucesso');
      expect(response.body).to.have.property('user');
      expect(response.body.user).to.have.property('id');
      expect(response.body.user.email).to.equal(userData.email);
      expect(response.body.user.profile).to.equal('estudante');
      expect(response.body.user).to.not.have.property('password');
    });
  });

  describe('CT-2: Avaliar a validação de unicidade dos dados de cadastro (e-mail, CPF)', () => {
    
    it('Deve impedir o registro de usuário com e-mail já cadastrado', async () => {
      // Primeiro, cria um usuário
      const existingUser = {
        name: "Usuário Existente",
        email: generateUniqueEmail('existing'),
        cpf: generateUniqueCPF(),
        password: "Senha123",
        profile: "profissional_qa"
      };

      await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(existingUser);

      // Tenta criar outro usuário com o mesmo e-mail
      const duplicateEmailUser = {
        ...existingUser,
        name: "Outro Nome",
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(duplicateEmailUser);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('Email');
    });
  });
});
