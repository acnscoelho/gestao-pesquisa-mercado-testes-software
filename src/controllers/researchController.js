const researchService = require('../services/researchService');
const User = require('../models/User');

class ResearchController {
  /**
   * Cria um novo registro de pesquisa
   */
  createResearch(req, res) {
    try {
      const userId = req.user.userId;
      const userProfile = req.user.profile;
      const data = req.body;

      const researchData = researchService.createResearchData(userId, userProfile, data);

      res.status(201).json({
        message: 'Dados de pesquisa registrados com sucesso',
        data: researchData
      });
    } catch (error) {
      res.status(400).json({
        error: 'Erro ao registrar dados de pesquisa',
        message: error.message
      });
    }
  }

  /**
   * Atualiza registro de pesquisa do usuário
   */
  updateResearch(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const updates = req.body;

      const updatedData = researchService.updateResearchData(userId, parseInt(id), updates);

      res.status(200).json({
        message: 'Dados de pesquisa atualizados com sucesso',
        data: updatedData
      });
    } catch (error) {
      const statusCode = error.message.includes('não encontrado') ? 404 : 
                        error.message.includes('permissão') ? 403 : 400;

      res.status(statusCode).json({
        error: 'Erro ao atualizar dados de pesquisa',
        message: error.message
      });
    }
  }

  /**
   * Deleta registro de pesquisa do usuário
   */
  deleteResearch(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const result = researchService.deleteResearchData(userId, parseInt(id));

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.message.includes('não encontrado') ? 404 : 
                        error.message.includes('permissão') ? 403 : 400;

      res.status(statusCode).json({
        error: 'Erro ao deletar dados de pesquisa',
        message: error.message
      });
    }
  }

  /**
   * Busca registros de pesquisa do próprio usuário
   */
  getMyResearch(req, res) {
    try {
      const userId = req.user.userId;
      const data = researchService.getMyResearchData(userId);

      res.status(200).json({
        message: 'Dados recuperados com sucesso',
        total: data.length,
        data
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar dados de pesquisa',
        message: error.message
      });
    }
  }

  /**
   * Lista e filtra registros de pesquisa (com anonimização)
   */
  listResearch(req, res) {
    try {
      const { 
        cargo, 
        nivelExperiencia, 
        localizacao, 
        faixaSalarial, 
        ferramenta, 
        userProfile, 
        areaAtuacao,
        page = 1,
        limit = 10
      } = req.query;

      const filters = {
        cargo,
        nivelExperiencia,
        localizacao,
        faixaSalarial,
        ferramenta,
        userProfile,
        areaAtuacao
      };

      // Remover filtros vazios
      Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
      });

      // Verificar se é admin ou gestor
      const isAdmin = [User.PROFILES.ADMINISTRADOR, User.PROFILES.GESTOR].includes(req.user.profile);

      const result = researchService.listResearchData(
        filters, 
        parseInt(page), 
        parseInt(limit),
        isAdmin
      );

      res.status(200).json({
        message: 'Dados recuperados com sucesso',
        filters: Object.keys(filters).length > 0 ? filters : 'Nenhum filtro aplicado',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao listar dados de pesquisa',
        message: error.message
      });
    }
  }

  /**
   * Obtém estatísticas agregadas (apenas para admins e gestores)
   */
  getStatistics(req, res) {
    try {
      const stats = researchService.getStatistics();

      res.status(200).json({
        message: 'Estatísticas recuperadas com sucesso',
        statistics: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao obter estatísticas',
        message: error.message
      });
    }
  }
}

module.exports = new ResearchController();





