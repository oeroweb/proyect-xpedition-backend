// prisma/seed.js
import { PrismaClient } from '@prisma/client';

// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // 1. Limpiar la base de datos (opcional, pero buena práctica)
  // await prisma.subscription.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.plan.deleteMany();

  // 2. Crear un Plan (por si no lo has creado por API)
  const basicPlan = await prisma.plan.create({
    data: {
      name: 'Plan Básico',
      cost: 9.99,
      durationDays: 30,
    },
  });

  // 3. Crear un Usuario de prueba
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