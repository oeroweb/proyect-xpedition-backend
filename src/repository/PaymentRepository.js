import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class PaymentRepository {
  async create(data) {
    return prisma.payment.create({ data });
  }
}