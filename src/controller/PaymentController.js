import PaymentService from '../service/PaymentService.js';

const paymentService = new PaymentService();

class PaymentController {
  async registerPayment(req, res) {
    const { subscriptionId, amount } = req.body;

    if (!subscriptionId || !amount) {
      return res
        .status(400)
        .json({ message: "subscriptionId y amount son requeridos." });
    }

    try {
      const payment = await paymentService.processPayment(
        subscriptionId,
        amount
      );
      res.status(201).json(payment);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res
        .status(statusCode)
        .json({ message: "Error en el pago: " + error.message });
    }
  }
}

export default new PaymentController();