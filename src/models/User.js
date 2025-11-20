class User {
  constructor(id, name, email, cpf, password, profile, createdAt, loginAttempts = 0, blocked = false, blockedUntil = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.password = password; // Armazenado como hash
    this.profile = profile; // estudante, profissional_qa, gestor, recrutador
    this.createdAt = createdAt;
    this.loginAttempts = loginAttempts;
    this.blocked = blocked;
    this.blockedUntil = blockedUntil;
  }

  static PROFILES = {
    ESTUDANTE: 'estudante',
    PROFISSIONAL_QA: 'profissional_qa',
    GESTOR: 'gestor',
    RECRUTADOR: 'recrutador',
    ADMINISTRADOR: 'administrador'
  };

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      profile: this.profile,
      createdAt: this.createdAt,
      blocked: this.blocked
    };
  }
}

module.exports = User;





