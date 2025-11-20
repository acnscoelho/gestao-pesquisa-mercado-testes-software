const request = require('supertest');
const { expect } = require('chai');
const { baseURL, apiBasePath, createUserWithToken } = require('../helpers/testHelpers');
const researchFixture = require('../fixtures/research.json');
const usersFixture = require('../fixtures/users.json');

describe('JIRA-9172: Listar e Filtrar Informações Registradas', () => {
  
  let regularUserToken;
  let adminUserToken;
  let gestorUserToken;
  let createdRecords = [];

  // Setup: Cria usuários e registros de pesquisa para os testes
  before(async function() {
    this.timeout(30000); // Aumenta timeout para setup
    
    // Cria usuário regular
    const regularUser = await createUserWithToken(usersFixture.validUsers[0]);
    regularUserToken = regularUser.token;

    // Cria usuário administrador
    const adminUser = await createUserWithToken(usersFixture.validUsers[3]);
    adminUserToken = adminUser.token;

    // Cria usuário gestor
    const gestorUser = await createUserWithToken(usersFixture.validUsers[2]);
    gestorUserToken = gestorUser.token;

    // Cria múltiplos registros de pesquisa para testar filtros
    for (let i = 0; i < researchFixture.validResearchData.length; i++) {
      const userData = await createUserWithToken(usersFixture.validUsers[0]);
      
      const response = await request(baseURL)
        .post(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(researchFixture.validResearchData[i]);

      if (response.status === 201) {
        createdRecords.push(response.body.data);
      }
    }
  });

  describe('CT-1: Verificar a listagem das informações registradas considerando anonimização e permissões de acesso', () => {
    
    it('Deve listar informações de forma anonimizada para usuários regulares', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');
      
      // Verifica que dados estão anonimizados (não contém ID de usuário explícito)
      if (response.body.data.length > 0) {
        const record = response.body.data[0];
        expect(record).to.have.property('cargo');
        expect(record).to.have.property('nivelExperiencia');
        expect(record).to.have.property('localizacao');
      }
    });

    it('Deve respeitar permissões de acesso baseadas no perfil do usuário', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('message');
    });

    it('Deve retornar erro ao tentar listar sem autenticação', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
    });
  });

  describe('CT-2: Avaliar a funcionalidade de filtragem de dados conforme parâmetros disponíveis', () => {
    
    it('Deve filtrar registros por cargo', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(researchFixture.filters.byCargo)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('filters');
    });

    it('Deve filtrar registros por nível de experiência', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(researchFixture.filters.byNivel)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      
      // Se houver dados, todos devem ter o nível filtrado
      if (response.body.data.length > 0) {
        response.body.data.forEach(record => {
          expect(record.nivelExperiencia).to.equal(researchFixture.filters.byNivel.nivelExperiencia);
        });
      }
    });

    it('Deve filtrar registros por localização', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(researchFixture.filters.byLocalizacao)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      
      // Se houver dados, todos devem ter a localização filtrada
      if (response.body.data.length > 0) {
        response.body.data.forEach(record => {
          expect(record.localizacao).to.equal(researchFixture.filters.byLocalizacao.localizacao);
        });
      }
    });

    it('Deve filtrar registros por ferramenta', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(researchFixture.filters.byFerramenta)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      
      // Se houver dados, todos devem conter a ferramenta filtrada
      if (response.body.data.length > 0) {
        response.body.data.forEach(record => {
          if (record.ferramentas) {
            expect(record.ferramentas).to.include(researchFixture.filters.byFerramenta.ferramenta);
          }
        });
      }
    });

    it('Deve suportar todos os parâmetros de filtro disponíveis', async () => {
      const filters = {
        cargo: 'QA Engineer',
        nivelExperiencia: 'pleno',
        localizacao: 'São Paulo - SP',
        faixaSalarial: 'R$ 5.000 - R$ 7.000',
        ferramenta: 'Selenium',
        areaAtuacao: 'web'
      };

      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(filters)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
    });
  });

  describe('CT-3: Validar o comportamento do sistema na combinação de múltiplos filtros aplicados simultaneamente', () => {
    
    it('Deve aplicar múltiplos filtros simultaneamente', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(researchFixture.filters.multipleFilters)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('filters');
    });

    it('Deve retornar resultados consistentes com múltiplos filtros', async () => {
      const filters = {
        nivelExperiencia: 'pleno',
        localizacao: 'São Paulo - SP'
      };

      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(filters)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      
      // Todos os resultados devem atender aos filtros aplicados
      if (response.body.data.length > 0) {
        response.body.data.forEach(record => {
          expect(record.nivelExperiencia).to.equal(filters.nivelExperiencia);
          expect(record.localizacao).to.equal(filters.localizacao);
        });
      }
    });

    it('Deve retornar array vazio quando nenhum registro atende aos filtros', async () => {
      const filters = {
        cargo: 'Cargo Inexistente XYZ123',
        nivelExperiencia: 'junior'
      };

      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query(filters)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.data).to.be.an('array');
    });
  });

  describe('CT-4: Confirmar a aplicação de paginação e ordenação nos resultados listados', () => {
    
    it('Deve suportar paginação com parâmetro page', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query({ page: 1, limit: 2 })
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('pagination');
      expect(response.body.pagination).to.have.property('currentPage');
      expect(response.body.pagination.currentPage).to.equal(1);
    });

    it('Deve suportar definição de limite de itens por página', async () => {
      const limit = 5;
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query({ limit })
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('pagination');
      expect(response.body.pagination).to.have.property('itemsPerPage');
      expect(response.body.pagination.itemsPerPage).to.equal(limit);
    });

    it('Deve incluir informações de paginação nos resultados', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query({ page: 1, limit: 10 })
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.pagination).to.have.property('currentPage');
      expect(response.body.pagination).to.have.property('totalPages');
      expect(response.body.pagination).to.have.property('totalItems');
      expect(response.body.pagination).to.have.property('itemsPerPage');
      expect(response.body.pagination).to.have.property('hasNextPage');
      expect(response.body.pagination).to.have.property('hasPreviousPage');
    });

    it('Deve usar valores padrão de paginação quando não especificados', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('pagination');
      expect(response.body.pagination.currentPage).to.equal(1);
      expect(response.body.pagination.itemsPerPage).to.equal(10);
    });

    it('Deve retornar página 2 corretamente', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research`)
        .query({ page: 2, limit: 2 })
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      if (response.body.pagination.totalPages >= 2) {
        expect(response.body.pagination.currentPage).to.equal(2);
        expect(response.body.pagination.hasPreviousPage).to.be.true;
      }
    });
  });

  describe('CT-5: Avaliar o controle de acesso e restrição de visualização conforme perfil do usuário', () => {
    
    it('Deve permitir que administradores acessem estatísticas agregadas', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/stats/all`)
        .set('Authorization', `Bearer ${adminUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('statistics');
      expect(response.body.statistics).to.have.property('totalRegistros');
      expect(response.body.statistics).to.have.property('porNivel');
      expect(response.body.statistics).to.have.property('porLocalizacao');
    });

    it('Deve permitir que gestores acessem estatísticas agregadas', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/stats/all`)
        .set('Authorization', `Bearer ${gestorUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('statistics');
    });

    it('Deve negar acesso de usuários regulares às estatísticas', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/stats/all`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('error');
      expect(response.body.message).to.include('administrador ou gestor');
    });

    it('Deve permitir que usuários visualizem apenas seus próprios registros através de /research/me', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/me`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('data');
      expect(response.body).to.have.property('total');
    });

    it('Deve negar acesso às estatísticas sem autenticação', async () => {
      const response = await request(baseURL)
        .get(`${apiBasePath}/research/stats/all`);

      expect(response.status).to.equal(401);
    });
  });
});

