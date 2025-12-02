import UserRepository from "../repository/UserRepository.js";

// Usaremos un error simple, se mejorará en Fase 4
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
    // Aquí iría la validación de formato de email (Fase 4 - Joi)
    // También, la verificación de email único (se podría implementar en el Repository)
    return this.repository.create(data);
  }

  async updateUser(id, data) {
    // Buscar si existe antes de intentar actualizar
    await this.getUserById(id);
    return this.repository.update(id, data);
  }

  async deleteUser(id) {
    // Regla de Negocio: No se puede eliminar si tiene suscripciones activas
    // NOTA: Para implementar esta regla, el repository debería verificar la tabla Subscription.

    // Por ahora, solo verificamos existencia y eliminamos
    await this.getUserById(id);
    return this.repository.delete(id);
  }
}
