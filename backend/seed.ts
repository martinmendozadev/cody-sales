import { prisma } from './config/db';
import { faker } from '@faker-js/faker';

const USERS_TO_CREATE = 14;
const SALES_MIN = 0;
const SALES_MAX = 10;

const MILESTONES = [
  { threshold: 50, type: '50_PERCENT' },
  { threshold: 80, type: '80_PERCENT' },
  { threshold: 100, type: '100_PERCENT' },
];

async function main() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  await prisma.milestone.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.monthlyGoal.deleteMany();
  await prisma.user.deleteMany();

  const createdUsers: { id: string; name: string }[] = [];

  for (let i = 0; i < USERS_TO_CREATE; i += 1) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
      },
    });
    createdUsers.push({ id: user.id, name: user.name });

    const targetAmount = faker.number.int({ min: 1000, max: 15000 });
    await prisma.monthlyGoal.create({
      data: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
        targetAmount,
      },
    });

    const salesCount = faker.number.int({ min: SALES_MIN, max: SALES_MAX });
    const salesData = Array.from({ length: salesCount }, () => ({
      userId: user.id,
      amount: faker.number.int({ min: 300, max: 4000 }),
      date: faker.date.between({
        from: new Date(currentYear, currentMonth - 1, 1),
        to: new Date(currentYear, currentMonth, 0, 23, 59, 59),
      }),
    }));

    await prisma.sale.createMany({ data: salesData });

    const totalSold = salesData.reduce((sum, sale) => sum + sale.amount, 0);
    const percentage = (totalSold / targetAmount) * 100;
    const milestonesData = MILESTONES.filter(({ threshold }) => percentage >= threshold).map(
      ({ type }) => ({ userId: user.id, type }),
    );

    if (milestonesData.length > 0) {
      await prisma.milestone.createMany({ data: milestonesData });
    }
  }

  console.log(`✅ Seed generado para ${createdUsers.length} promotores.`);
  for (const user of createdUsers) {
    console.log(`- ${user.name} (${user.id})`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
