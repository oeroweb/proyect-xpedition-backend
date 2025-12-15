import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_STATUS } from '../domain/subscription.constants.js';

const prisma = new PrismaClient();

export default class SubscriptionRepository {
  async findActiveByUserIdAndPlanId(userId, planId) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        planId,
        status: {
          in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
        },
      },
    });
  }

  async findById(id) {
    return await prisma.subscription.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return await prisma.subscription.create({ data });
  }

  async updateStatus(id, newStatus) {
    return await prisma.subscription.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async updateEndDate(id, newEndDate) {
    return await prisma.subscription.update({
      where: { id },
      data: { endDate: newEndDate },
    });
  }

  async findWithPaginationAndFilter(skip, take, where) {
    const data = await prisma.subscription.findMany({
      skip: skip,
      take: take,
      where: where,
      orderBy: {
        startDate: 'desc',
      },
      include: {
        plan: true,
        user: true,
      },
    });

    const total = await prisma.subscription.count({
      where: where,
    });

    return { data, total };
  }

  async findExpiredActiveSubscriptions() {
    const today = new Date();

    return await prisma.subscription.findMany({
      where: {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        endDate: {
          lte: today,
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.subscription.update({
      where: { id },
      data: data,
    });
  }
}
