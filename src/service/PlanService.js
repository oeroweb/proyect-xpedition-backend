import PlanRepository from "../repository/PlanRepository.js";

export default class PlanService {
  constructor() {
    this.repository = new PlanRepository();
  }

  async getAllPlans() {
    return this.repository.findAll();
  }

  async createPlan(data) {
    if (data.cost <= 0) {
      throw new Error("El costo debe ser positivo.");
    }
    return this.repository.create(data);
  }

  async updatePlan(id, data) {
    if (data.cost && data.cost <= 0) {
      throw new Error("El costo debe ser positivo.");
    }
    return this.repository.update(id, data);
  }

  async deletePlan(id) {
    return this.repository.delete(id);
  }
}
