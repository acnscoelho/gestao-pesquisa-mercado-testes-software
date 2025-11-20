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

    it('Deve permitir o registro de um novo usuário com perfil "profissional_qa"', async () => {
      const userData = {
        ...usersFixture.validUsers[0],
        email: generateUniqueEmail('profissional'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.user.profile).to.equal('profissional_qa');
    });

    it('Deve permitir o registro de um novo usuário com perfil "gestor"', async () => {
      const userData = {
        ...usersFixture.validUsers[2],
        email: generateUniqueEmail('gestor'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.user.profile).to.equal('gestor');
    });

    it('Deve permitir o registro de um novo usuário com perfil "administrador"', async () => {
      const userData = {
        ...usersFixture.validUsers[3],
        email: generateUniqueEmail('admin'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.user.profile).to.equal('administrador');
    });
  });

  describe('CT-2: Avaliar a validação de unicidade dos dados de cadastro (e-mail, CPF)', () => {
    
    let existingUser;

    before(async () => {
      // Cria um usuário para testar duplicidade
      existingUser = {
        name: "Usuário Existente",
        email: generateUniqueEmail('existing'),
        cpf: generateUniqueCPF(),
        password: "Senha123",
        profile: "profissional_qa"
      };

      await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(existingUser);
    });

    it('Deve impedir o registro de usuário com e-mail já cadastrado', async () => {
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

    it('Deve impedir o registro de usuário com CPF já cadastrado', async () => {
      const duplicateCPFUser = {
        ...existingUser,
        email: generateUniqueEmail('different'),
        name: "Outro Nome"
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(duplicateCPFUser);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('CPF');
    });
  });

  describe('CT-3: Validar o cumprimento das regras de obrigatoriedade e formato dos campos de registro', () => {
    
    it('Deve rejeitar registro sem campos obrigatórios', async () => {
      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(usersFixture.invalidUsers.missingFields);

      expect(response.status).to.be.oneOf([400, 422]);
      expect(response.body).to.have.property('error');
    });

    it('Deve rejeitar registro com e-mail em formato inválido', async () => {
      const invalidUser = {
        ...usersFixture.invalidUsers.invalidEmail,
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(invalidUser);

      expect(response.status).to.be.oneOf([400, 422]);
      expect(response.body).to.have.property('error');
    });

    it('Deve validar campos obrigatórios: name, email, cpf, password, profile', async () => {
      const requiredFields = ['name', 'email', 'cpf', 'password', 'profile'];
      const baseUser = {
        name: "Teste",
        email: generateUniqueEmail('test'),
        cpf: generateUniqueCPF(),
        password: "Senha123",
        profile: "estudante"
      };

      for (const field of requiredFields) {
        const incompleteUser = { ...baseUser };
        delete incompleteUser[field];

        const response = await request(baseURL)
          .post(`${apiBasePath}/auth/register`)
          .send(incompleteUser);

        expect(response.status).to.be.oneOf([400, 422], 
          `Campo ${field} deveria ser obrigatório`);
      }
    });
  });

  describe('CT-4: Avaliar a aplicação de políticas de segurança no cadastro de usuário', () => {
    
    it('Deve rejeitar senha com menos de 8 caracteres', async () => {
      const weakPasswordUser = {
        ...usersFixture.invalidUsers.invalidPassword,
        email: generateUniqueEmail('weak'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(weakPasswordUser);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.include('senha');
    });

    it('Deve rejeitar perfil não permitido', async () => {
      const invalidProfileUser = {
        ...usersFixture.invalidUsers.invalidProfile,
        email: generateUniqueEmail('invalid'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(invalidProfileUser);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.include('Perfil');
    });

    it('Deve aceitar apenas perfis válidos: estudante, profissional_qa, gestor, recrutador, administrador', async () => {
      const validProfiles = ['estudante', 'profissional_qa', 'gestor', 'recrutador', 'administrador'];
      
      for (const profile of validProfiles) {
        const userData = {
          name: `Usuário ${profile}`,
          email: generateUniqueEmail(profile),
          cpf: generateUniqueCPF(),
          password: "Senha123",
          profile: profile
        };

        const response = await request(baseURL)
          .post(`${apiBasePath}/auth/register`)
          .send(userData);

        expect(response.status).to.equal(201, 
          `Perfil ${profile} deveria ser aceito`);
      }
    });
  });

  describe('CT-5: Garantir o armazenamento adequado de metadados do registro', () => {
    
    it('Deve armazenar metadados do registro (createdAt, profile)', async () => {
      const userData = {
        ...usersFixture.validUsers[0],
        email: generateUniqueEmail('metadata'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.user).to.have.property('createdAt');
      expect(response.body.user).to.have.property('profile');
      expect(response.body.user.profile).to.equal(userData.profile);
      
      // Valida formato de data
      const createdAt = new Date(response.body.user.createdAt);
      expect(createdAt).to.be.a('date');
      expect(createdAt.toString()).to.not.equal('Invalid Date');
    });

    it('Deve armazenar o campo blocked como false por padrão', async () => {
      const userData = {
        ...usersFixture.validUsers[0],
        email: generateUniqueEmail('blocked'),
        cpf: generateUniqueCPF()
      };

      const response = await request(baseURL)
        .post(`${apiBasePath}/auth/register`)
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.user).to.have.property('blocked');
      expect(response.body.user.blocked).to.be.false;
    });
  });
});

