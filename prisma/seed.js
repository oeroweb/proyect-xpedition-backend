// prisma/seed.js
import { PrismaClient } from '@prisma/client';

// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Plan Básico',
      cost: 9.99,
      durationDays: 30,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'usuario.prueba@example.com',
      name: 'Usuario Test',
    },
  });

  console.log(`Plan creado con ID: ${basicPlan.id}`);
  console.log(`Usuario creado con ID: ${testUser.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
