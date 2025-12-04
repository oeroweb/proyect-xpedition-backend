import UserRepository from "../repository/UserRepository.js";

class BusinessRuleError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async getAllUsers() {
    return this.repository.findAll();
  }

  async getUserById(id) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new BusinessRuleError("Usuario no encontrado.", 404);
    }
    return user;
  }

  async createUser(data) {
    return this.repository.create(data);
  }

  async updateUser(id, data) {
    await this.getUserById(id);
    return this.repository.update(id, data);
  }

  async deleteUser(id) {
    await this.getUserById(id);
    return this.repository.delete(id);
  }
}
