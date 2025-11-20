/**
 * Banco de dados em memória para armazenamento temporário
 */
class MemoryDB {
  constructor() {
    this.users = [];
    this.researchData = [];
    this.userIdCounter = 1;
    this.researchIdCounter = 1;
  }

  // Métodos de usuário
  addUser(user) {
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserByCPF(cpf) {
    return this.users.find(user => user.cpf === cpf);
  }

  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  updateUser(id, updates) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      return this.users[userIndex];
    }
    return null;
  }

  getNextUserId() {
    return this.userIdCounter++;
  }

  // Métodos de dados de pesquisa
  addResearchData(data) {
    this.researchData.push(data);
    return data;
  }

  findResearchDataById(id) {
    return this.researchData.find(data => data.id === id);
  }

  findResearchDataByUserId(userId) {
    return this.researchData.filter(data => data.userId === userId);
  }

  getAllResearchData() {
    return this.researchData;
  }

  updateResearchData(id, updates) {
    const dataIndex = this.researchData.findIndex(data => data.id === id);
    if (dataIndex !== -1) {
      this.researchData[dataIndex] = { ...this.researchData[dataIndex], ...updates };
      return this.researchData[dataIndex];
    }
    return null;
  }

  deleteResearchData(id) {
    const dataIndex = this.researchData.findIndex(data => data.id === id);
    if (dataIndex !== -1) {
      this.researchData.splice(dataIndex, 1);
      return true;
    }
    return false;
  }

  getNextResearchId() {
    return this.researchIdCounter++;
  }

  // Método para paginação
  paginateResearchData(data, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalItems: data.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < data.length,
        hasPreviousPage: page > 1
      }
    };
  }
}

// Exportar uma instância única (singleton)
module.exports = new MemoryDB();





