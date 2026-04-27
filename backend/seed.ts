import { prisma } from './config/db';

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Promotor Estrella',
    },
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  await prisma.monthlyGoal.create({
    data: {
      userId: user.id,
      month: currentMonth,
      year: currentYear,
      targetAmount: 10000,
    },
  });

  console.log(`✅ Datos creados. Usa este ID de usuario para probar: ${user.id}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
