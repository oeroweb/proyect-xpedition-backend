import SubscriptionService from "../service/SubscriptionService.js";

const subscriptionService = new SubscriptionService();
class SubscriptionController {
  async createSubscription(req, res) {
    const { userId, planId } = req.body;

    try {
      const newSubscription = await subscriptionService.createSubscription(
        userId,
        planId
      );
      res.status(201).json(newSubscription);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async cancelSubscription(req, res) {
    const { id } = req.params;
    try {
      const cancelledSub = await subscriptionService.cancelSubscription(id);
      res.status(200).json({
        message: "Cancelación registrada, efectiva al final del periodo.",
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async listSubscriptions(req, res) {
    // Obtiene parámetros de consulta (query) con valores por defecto
    const { page, limit, status } = req.query;

    try {
      const result = await subscriptionService.getSubscriptions(
        page,
        limit,
        status
      );

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
}

export default new SubscriptionController();