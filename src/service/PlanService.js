import PlanRepository from '../repository/PlanRepository.js';

export default class PlanService {
  constructor() {
    this.repository = new PlanRepository();
  }

  async getAllPlans() {
    return await this.repository.findAll();
  }

  async createPlan(data) {
    if (data.cost <= 0) {
      throw new Error('El costo debe ser positivo.');
    }
    return await this.repository.create(data);
  }

  async updatePlan(id, data) {
    if (data.cost && data.cost <= 0) {
      throw new Error('El costo debe ser positivo.');
    }
    return await this.repository.update(id, data);
  }

  async deletePlan(id) {
    return await this.repository.delete(id);
  }
}
