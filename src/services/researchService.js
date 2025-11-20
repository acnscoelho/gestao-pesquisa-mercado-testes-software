const memoryDB = require('../database/memoryDB');
const ResearchData = require('../models/ResearchData');

class ResearchService {
  /**
   * Registra informações de pesquisa
   */
  createResearchData(userId, userProfile, data) {
    const { cargo, nivelExperiencia, faixaSalarial, ferramentas, localizacao, areaAtuacao } = data;

    // Validações
    if (!cargo || !nivelExperiencia || !localizacao || !areaAtuacao) {
      throw new Error('Campos obrigatórios: cargo, nivelExperiencia, localizacao, areaAtuacao');
    }

    // Validar nível de experiência
    const validNiveis = Object.values(ResearchData.NIVEIS_EXPERIENCIA);
    if (!validNiveis.includes(nivelExperiencia)) {
      throw new Error(`Nível de experiência inválido. Valores aceitos: ${validNiveis.join(', ')}`);
    }

    // Verificar duplicidade - cada usuário só pode ter um registro de pesquisa
    const existingResearch = memoryDB.findResearchDataByUserId(userId);
    if (existingResearch.length > 0) {
      throw new Error('Você já possui um registro de pesquisa. Use a função de atualização');
    }

    // Criar registro de pesquisa
    const researchData = new ResearchData(
      memoryDB.getNextResearchId(),
      userId,
      userProfile,
      cargo,
      nivelExperiencia,
      faixaSalarial,
      ferramentas || [],
      localizacao,
      areaAtuacao,
      new Date(),
      new Date()
    );

    memoryDB.addResearchData(researchData);

    return researchData.toJSON();
  }

  /**
   * Atualiza informações de pesquisa do usuário
   */
  updateResearchData(userId, researchId, updates) {
    const researchData = memoryDB.findResearchDataById(researchId);

    if (!researchData) {
      throw new Error('Registro de pesquisa não encontrado');
    }

    // Verificar se o usuário é dono do registro
    if (researchData.userId !== userId) {
      throw new Error('Você não tem permissão para atualizar este registro');
    }

    // Validar nível de experiência se fornecido
    if (updates.nivelExperiencia) {
      const validNiveis = Object.values(ResearchData.NIVEIS_EXPERIENCIA);
      if (!validNiveis.includes(updates.nivelExperiencia)) {
        throw new Error(`Nível de experiência inválido. Valores aceitos: ${validNiveis.join(', ')}`);
      }
    }

    const updatedData = memoryDB.updateResearchData(researchId, {
      ...updates,
      updatedAt: new Date()
    });

    return updatedData.toJSON();
  }

  /**
   * Deleta registro de pesquisa do usuário
   */
  deleteResearchData(userId, researchId) {
    const researchData = memoryDB.findResearchDataById(researchId);

    if (!researchData) {
      throw new Error('Registro de pesquisa não encontrado');
    }

    // Verificar se o usuário é dono do registro
    if (researchData.userId !== userId) {
      throw new Error('Você não tem permissão para deletar este registro');
    }

    memoryDB.deleteResearchData(researchId);

    return { message: 'Registro deletado com sucesso' };
  }

  /**
   * Busca registros do próprio usuário
   */
  getMyResearchData(userId) {
    const data = memoryDB.findResearchDataByUserId(userId);
    return data.map(item => item.toJSON());
  }

  /**
   * Lista e filtra informações de pesquisa (com anonimização)
   */
  listResearchData(filters = {}, page = 1, limit = 10, isAdmin = false) {
    let data = memoryDB.getAllResearchData();

    // Aplicar filtros
    if (filters.cargo) {
      data = data.filter(item => 
        item.cargo.toLowerCase().includes(filters.cargo.toLowerCase())
      );
    }

    if (filters.nivelExperiencia) {
      data = data.filter(item => item.nivelExperiencia === filters.nivelExperiencia);
    }

    if (filters.localizacao) {
      data = data.filter(item => 
        item.localizacao.toLowerCase().includes(filters.localizacao.toLowerCase())
      );
    }

    if (filters.faixaSalarial) {
      data = data.filter(item => 
        item.faixaSalarial && item.faixaSalarial.toLowerCase().includes(filters.faixaSalarial.toLowerCase())
      );
    }

    if (filters.ferramenta) {
      data = data.filter(item => 
        item.ferramentas.some(f => f.toLowerCase().includes(filters.ferramenta.toLowerCase()))
      );
    }

    if (filters.userProfile) {
      data = data.filter(item => item.userProfile === filters.userProfile);
    }

    if (filters.areaAtuacao) {
      data = data.filter(item => 
        item.areaAtuacao.toLowerCase().includes(filters.areaAtuacao.toLowerCase())
      );
    }

    // Anonimizar dados (remover userId) se não for admin
    const anonymizedData = data.map(item => 
      isAdmin ? item.toAdminJSON() : item.toJSON()
    );

    // Paginar resultados
    return memoryDB.paginateResearchData(anonymizedData, page, limit);
  }

  /**
   * Obtém estatísticas agregadas
   */
  getStatistics() {
    const data = memoryDB.getAllResearchData();

    const stats = {
      totalRegistros: data.length,
      porNivel: {},
      porLocalizacao: {},
      porCargo: {},
      ferramentasMaisUsadas: {}
    };

    data.forEach(item => {
      // Contar por nível
      stats.porNivel[item.nivelExperiencia] = (stats.porNivel[item.nivelExperiencia] || 0) + 1;

      // Contar por localização
      stats.porLocalizacao[item.localizacao] = (stats.porLocalizacao[item.localizacao] || 0) + 1;

      // Contar por cargo
      stats.porCargo[item.cargo] = (stats.porCargo[item.cargo] || 0) + 1;

      // Contar ferramentas
      item.ferramentas.forEach(ferramenta => {
        stats.ferramentasMaisUsadas[ferramenta] = (stats.ferramentasMaisUsadas[ferramenta] || 0) + 1;
      });
    });

    return stats;
  }
}

module.exports = new ResearchService();





