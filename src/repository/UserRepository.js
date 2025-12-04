import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data) {
    return prisma.user.create({
      data: data,
    });
  }
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data: data,
    });
  }
  async delete(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
