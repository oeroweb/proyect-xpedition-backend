import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class PlanRepository {
  async findAll() {
    return await prisma.plan.findMany();
  }

  async findById(id) {
    return await prisma.plan.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return await prisma.plan.create({
      data: data,
    });
  }

  async update(id, data) {
    return await prisma.plan.update({
      where: { id },
      data: data,
    });
  }

  async delete(id) {
    return await prisma.plan.delete({
      where: { id },
    });
  }
}
