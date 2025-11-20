class ResearchData {
  constructor(id, userId, userProfile, cargo, nivelExperiencia, faixaSalarial, ferramentas, localizacao, areaAtuacao, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.userProfile = userProfile;
    this.cargo = cargo;
    this.nivelExperiencia = nivelExperiencia; // junior, pleno, senior, especialista
    this.faixaSalarial = faixaSalarial;
    this.ferramentas = ferramentas; // Array de strings
    this.localizacao = localizacao; // Estado ou cidade
    this.areaAtuacao = areaAtuacao; // web, mobile, api, automacao, etc
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static NIVEIS_EXPERIENCIA = {
    JUNIOR: 'junior',
    PLENO: 'pleno',
    SENIOR: 'senior',
    ESPECIALISTA: 'especialista'
  };

  toJSON() {
    return {
      id: this.id,
      userProfile: this.userProfile,
      cargo: this.cargo,
      nivelExperiencia: this.nivelExperiencia,
      faixaSalarial: this.faixaSalarial,
      ferramentas: this.ferramentas,
      localizacao: this.localizacao,
      areaAtuacao: this.areaAtuacao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toAdminJSON() {
    return {
      id: this.id,
      userId: this.userId,
      userProfile: this.userProfile,
      cargo: this.cargo,
      nivelExperiencia: this.nivelExperiencia,
      faixaSalarial: this.faixaSalarial,
      ferramentas: this.ferramentas,
      localizacao: this.localizacao,
      areaAtuacao: this.areaAtuacao,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ResearchData;





