import SubscriptionRepository from '../repository/SubscriptionRepository.js';
import PlanRepository from '../repository/PlanRepository.js';
import UserRepository from '../repository/UserRepository.js';
import { addDays } from '../utils/date.utils.js';
import { SUBSCRIPTION_STATUS } from '../domain/subscription.constants.js';
import { BusinessRuleError } from '../domain/errors/BusinessRuleError.js';

export default class SubscriptionService {
  constructor() {
    this.subRepository = new SubscriptionRepository();
    this.planRepository = new PlanRepository();
    this.userRepository = new UserRepository();
  }

  async createSubscription(userId, planId) {
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new BusinessRuleError('Plan no encontrado.', 404);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BusinessRuleError('Usuario no encontrado.', 404);
    }

    const existingActiveSub = await this.subRepository.findActiveByUserIdAndPlanId(userId, planId);
    if (existingActiveSub) {
      throw new BusinessRuleError(
        'El usuario ya tiene una suscripción activa o en periodo de prueba para este plan.',
        409,
      );
    }

    const existingSubscription = await this.subRepository.findActiveByUserIdAndPlanId(
      userId,
      planId,
    );
    if (existingSubscription) {
      throw new BusinessRuleError(
        'El usuario ya tiene una suscripción activa o en periodo de prueba para este plan.',
        409,
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

  async cancelSubscription(id) {
    const subscription = await this.subRepository.findById(id);
    if (!subscription) {
      throw new BusinessRuleError('Suscripción no encontrada.', 404);
    }

    return this.subRepository.updateStatus(id, SUBSCRIPTION_STATUS.CANCELLED);
  }

  async getSubscriptions(page = 1, limit = 10, status, startDateFrom, startDateTo) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where = {};

    if (status) {
      if (Object.values(SUBSCRIPTION_STATUS).includes(status)) {
        where.status = status;
      } else {
        throw new BusinessRuleError(`El estado de filtro '${status}' no es válido.`, 400);
      }
    }

    const dateFilter = {};

    if (startDateFrom) {
      const dateFrom = new Date(startDateFrom);
      if (isNaN(dateFrom))
        throw new BusinessRuleError('Formato de fecha de inicio (desde) inválido.', 400);
      dateFilter.gte = dateFrom;
    }

    if (startDateTo) {
      const dateTo = new Date(startDateTo);
      if (isNaN(dateTo))
        throw new BusinessRuleError('Formato de fecha de inicio (hasta) inválido.', 400);
      dateFilter.lte = dateTo;
    }

    if (Object.keys(dateFilter).length > 0) {
      where.startDate = dateFilter;
    }

    const { data, total } = await this.subRepository.findWithPaginationAndFilter(
      skip,
      limitNumber,
      where,
    );

    return {
      data,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async processExpiration() {
    const expiredSubscriptions = await this.subRepository.findExpiredActiveSubscriptions();

    let suspendedCount = 0;

    for (const sub of expiredSubscriptions) {
      await this.subRepository.updateStatus(sub.id, SUBSCRIPTION_STATUS.SUSPENDED);
      suspendedCount++;
    }

    return { suspendedCount };
  }

  async updateSubscription(subscriptionId, newStatus, newPlanId) {
    const subscription = await this.subRepository.findById(subscriptionId);
    if (!subscription) {
      throw new BusinessRuleError('Suscripción no encontrada.', 404);
    }

    const updateData = {};

    if (newStatus) {
      if (!Object.values(SUBSCRIPTION_STATUS).includes(newStatus)) {
        throw new BusinessRuleError(`El estado '${newStatus}' no es un estado válido.`, 400);
      }
      updateData.status = newStatus;
    }

    if (newPlanId && newPlanId !== subscription.planId) {
      const newPlan = await this.planRepository.findById(newPlanId);
      if (!newPlan) {
        throw new BusinessRuleError('El nuevo plan no fue encontrado.', 404);
      }

      updateData.planId = newPlanId;
    }

    if (Object.keys(updateData).length === 0) {
      return subscription;
    }

    const updatedSubscription = await this.subRepository.update(subscriptionId, updateData);

    return updatedSubscription;
  }
}
