import PaymentRepository from "../repository/PaymentRepository.js";
import SubscriptionRepository from "../repository/SubscriptionRepository.js";
import PlanRepository from "../repository/PlanRepository.js";
import { SUBSCRIPTION_STATUS } from "../domain/subscription.constants.js";
import { addDays } from "../utils/date.utils.js";

export default class PaymentService {
  constructor() {
    this.payRepository = new PaymentRepository();
    this.subRepository = new SubscriptionRepository();
    this.planRepository = new PlanRepository();
  }

  // Asegúrate de que los imports estén correctos al inicio del archivo:
  // import { addDays } from '../utils/date.utils.js';
  // import { SUBSCRIPTION_STATUS } from '../domain/subscription.constants.js';

  async processPayment(subscriptionId, amount) {
    const subscription = await this.subRepository.findById(subscriptionId);
    if (!subscription) {
      throw new Error("Suscripción no encontrada.", 404);
    }

    const plan = await this.planRepository.findById(subscription.planId);
    if (!plan) {
      throw new Error("Plan asociado no encontrado.", 500);
    }

    const paymentData = {
      subscriptionId,
      amount,
      status: "completed",
    };
    const newPayment = await this.payRepository.create(paymentData);

    const currentEndDate = subscription.endDate;

    const newEndDate = addDays(currentEndDate, plan.durationDays);

    const newStatus = SUBSCRIPTION_STATUS.ACTIVE;

    await this.subRepository.updateStatus(subscriptionId, newStatus);
    await this.subRepository.updateEndDate(subscriptionId, newEndDate);

    return newPayment;
  }
 
}
