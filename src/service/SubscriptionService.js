import SubscriptionRepository from "../repository/SubscriptionRepository.js";
import PlanRepository from "../repository/PlanRepository.js";
import UserRepository from "../repository/UserRepository.js";
import { addDays } from "../utils/date.utils.js";
import { SUBSCRIPTION_STATUS } from "../domain/subscription.constants.js";

// Usaremos un error simple por ahora, se mejorará en Fase 4
class BusinessRuleError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default class SubscriptionService {
  constructor() {
    this.subRepository = new SubscriptionRepository();
    this.planRepository = new PlanRepository();
    this.userRepository = new UserRepository();
  }

  async createSubscription(userId, planId) {
    // 1. Verificar existencia de Plan y Usuario
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new BusinessRuleError("Plan no encontrado.", 404);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessRuleError("Usuario no encontrado.", 404);
    }

    const existingActiveSub =
      await this.subRepository.findActiveByUserIdAndPlanId(userId, planId);
    if (existingActiveSub) {
      throw new BusinessRuleError(
        "El usuario ya tiene una suscripción activa o en periodo de prueba para este plan.",
        409 // Conflict
      );
    }

    const startDate = new Date();
    const endDate = addDays(startDate, 7);

    const newSubscriptionData = {
      userId,
      planId,
      startDate,
      endDate,
      status: SUBSCRIPTION_STATUS.TRIAL,
    };

    return this.subRepository.create(newSubscriptionData);
  }

  // Aquí iría la lógica de cancelación (Fase 3/4)
  async cancelSubscription(id) {
    const subscription = await this.subRepository.findById(id);
    if (!subscription) {
      throw new BusinessRuleError("Suscripción no encontrada.", 404);
    }

    // --- REGLA: Cancelación efectiva al fin del periodo ---
    // Se actualiza el estado a 'cancelled', pero la suscripción sigue activa hasta endDate.
    return this.subRepository.updateStatus(id, SUBSCRIPTION_STATUS.CANCELLED);
  }

  async getSubscriptions(page = 1, limit = 10, status) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let where = {};

    if (status) {
      if (Object.values(SUBSCRIPTION_STATUS).includes(status)) {
        where.status = status;
      } else {
        throw new BusinessRuleError(
          `El estado de filtro '${status}' no es válido.`,
          400
        );
      }
    }

    const { data, total } =
      await this.subRepository.findWithPaginationAndFilter(
        skip,
        limitNumber,
        where
      );

    return {
      data,
      meta: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async processExpiration() {
    const expiredSubscriptions =
      await this.subRepository.findExpiredActiveSubscriptions();

    let suspendedCount = 0;

    for (const sub of expiredSubscriptions) {
      await this.subRepository.updateStatus(
        sub.id,
        SUBSCRIPTION_STATUS.SUSPENDED
      );
      suspendedCount++;
    }

    return { suspendedCount };
  }
}