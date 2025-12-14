import PlanService from '../service/PlanService.js';

const planService = new PlanService();

class PlanController {
  async listPlans(req, res) {
    try {
      const plans = await planService.getAllPlans();
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ message: 'Error interno: ' + error.message });
    }
  }

  async createPlan(req, res) {
    const { name, cost } = req.body;

    if (!name || cost === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    try {
      const newPlan = await planService.createPlan(req.body);
      res.status(201).json(newPlan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePlan(req, res) {
    const { id } = req.params;
    try {
      const updatedPlan = await planService.updatePlan(id, req.body);
      res.status(200).json(updatedPlan);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePlan(req, res) {
    const { id } = req.params;
    try {
      await planService.deletePlan(id);
      res.status(204).send();
    } catch () {
      res.status(404).json({ message: 'Plan no encontrado o no se puede eliminar.' });
    }
  }
}

export default new PlanController();
