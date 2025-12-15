import PaymentService from '../service/PaymentService.js';

const paymentService = new PaymentService();

class PaymentController {
  async registerPayment(req, res) {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res.status(400).json({ message: 'subscriptionId y amount son requeridos.' });
    }

    try {
      const payment = await paymentService.processPayment(subscriptionId, amount);
      res.status(201).json(payment);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: 'Error en el pago: ' + error.message });
    }
  }

  async updatePaymentStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'El campo "status" es requerido.' });
    }

    try {
      const result = await paymentService.updatePaymentStatus(id, status);
      res.status(200).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
}

export default new PaymentController();
