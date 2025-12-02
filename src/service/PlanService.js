import PlanRepository from "../repository/PlanRepository.js";

export default class PlanService {
  constructor() {
    this.repository = new PlanRepository();
  }

  async getAllPlans() {
    // Aquí iría la lógica de negocio (filtrado, permisos), pero por ahora solo delega.
    return this.repository.findAll();
  }

  async createPlan(data) {
    // Ejemplo de validación o regla de negocio aquí.
    if (data.cost <= 0) {
      throw new Error("El costo debe ser positivo.");
    }
    return this.repository.create(data);
  }

  async updatePlan(id, data) {
    // Aquí podrías añadir una regla, como: si un plan está activo, no se puede cambiar el costo.
    if (data.cost && data.cost <= 0) {
      throw new Error("El costo debe ser positivo.");
    }
    return this.repository.update(id, data);
  }

  async deletePlan(id) {
    // Aquí podrías añadir una regla clave: No se puede eliminar si hay suscripciones activas.
    return this.repository.delete(id);
  }
}
