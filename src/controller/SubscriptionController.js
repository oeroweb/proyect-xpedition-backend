import SubscriptionService from '../service/SubscriptionService.js';

const subscriptionService = new SubscriptionService();
class SubscriptionController {
  async createSubscription(req, res) {
    const { userId, planId } = req.body;

    try {
      const newSubscription = await subscriptionService.createSubscription(userId, planId);
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
        message: 'Cancelación registrada, efectiva al final del periodo.',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async listSubscriptions(req, res) {
    const { page, limit, status, startDateFrom, startDateTo } = req.query;

    try {
      const result = await subscriptionService.getSubscriptions(
        page,
        limit,
        status,
        startDateFrom,
        startDateTo,
      );

      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  async updateSubscription(req, res) {
    const { id } = req.params;
    const { status, planId } = req.body;

    if (!status && !planId) {
      return res.status(400).json({ message: 'Se requiere el campo "status" y/o "planId".' });
    }

    try {
      const result = await subscriptionService.updateSubscription(id, status, planId);
      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
}

export default new SubscriptionController();
