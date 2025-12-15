import PaymentRepository from '../repository/PaymentRepository.js';
import SubscriptionRepository from '../repository/SubscriptionRepository.js';
import PlanRepository from '../repository/PlanRepository.js';
import { SUBSCRIPTION_STATUS } from '../domain/subscription.constants.js';
import { addDays } from '../utils/date.utils.js';
import { PAYMENT_STATUS } from '../domain/payment.constants.js';
import { BusinessRuleError } from '../domain/errors/BusinessRuleError.js';

export default class PaymentService {
  constructor() {
    this.payRepository = new PaymentRepository();
    this.subRepository = new SubscriptionRepository();
    this.planRepository = new PlanRepository();
  }

  async processPayment(subscriptionId, amount) {
    const subscription = await this.subRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Suscripción no encontrada.', 404);
    }

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new Error('Plan asociado no encontrado.', 404);
    }

    const paymentData = {
      subscriptionId,
      amount,
      status: 'completed',
    };
    const newPayment = await this.payRepository.create(paymentData);

    const currentEndDate = subscription.endDate;

    const newEndDate = addDays(currentEndDate, plan.durationDays);

    const newStatus = SUBSCRIPTION_STATUS.ACTIVE;

    await this.subRepository.updateStatus(subscriptionId, newStatus);
    await this.subRepository.updateEndDate(subscriptionId, newEndDate);

    return newPayment;
  }

  async updatePaymentStatus(paymentId, newStatus) {
    const payment = await this.payRepository.findById(paymentId);
    if (!payment) {
      throw new BusinessRuleError('Pago no encontrado.', 404);
    }

    if (!Object.values(PAYMENT_STATUS).includes(newStatus)) {
      throw new BusinessRuleError(`El estado '${newStatus}' no es un estado de pago válido.`, 400);
    }

    const updatedPayment = await this.payRepository.updateStatus(paymentId, newStatus);

    return updatedPayment;
  }
}
