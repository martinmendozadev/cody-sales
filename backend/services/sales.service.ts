import { prisma } from '../config/db';

export class SalesService {

  static async registerSale(userId: string, amount: number) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const goal = await prisma.monthlyGoal.findUnique({
      where: {
        userId_month_year: { userId, month: currentMonth, year: currentYear },
      },
    });

    if (!goal) {
      throw { statusCode: 404, message: 'Meta mensual no encontrada para este usuario' };
    }

    const newSale = await prisma.sale.create({
      data: { userId, amount },
    });

    const allSalesThisMonth = await prisma.sale.aggregate({
      where: {
        userId,
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
      _sum: { amount: true },
    });

    const totalSold = allSalesThisMonth._sum.amount || 0;
    const progressPercentage = (totalSold / goal.targetAmount) * 100;

    const milestonesToGibe = [];
    if (progressPercentage >= 50) milestonesToGibe.push('50_PERCENT');
    if (progressPercentage >= 80) milestonesToGibe.push('80_PERCENT');
    if (progressPercentage >= 100) milestonesToGibe.push('100_PERCENT');

    const newlyUnlocked = [];

    for (const type of milestonesToGibe) {
      const existing = await prisma.milestone.findUnique({
        where: { userId_type: { userId, type } },
      });

      if (!existing) {
        const milestone = await prisma.milestone.create({
          data: { userId, type },
        });
        newlyUnlocked.push(milestone);
      }
    }

    return {
      sale: newSale,
      progressPercentage,
      newlyUnlocked,
    };
  }

  static async getProgress(userId: string) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) throw { statusCode: 404, message: 'Usuario no encontrado' };

    const goal = await prisma.monthlyGoal.findUnique({
      where: { userId_month_year: { userId, month: currentMonth, year: currentYear } },
    });

    if (!goal) throw { statusCode: 404, message: 'Meta mensual no encontrada' };

    const salesSum = await prisma.sale.aggregate({
      where: {
        userId,
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        },
      },
      _sum: { amount: true },
    });

    const totalSold = salesSum._sum.amount || 0;
    const milestones = await prisma.milestone.findMany({ where: { userId } });

    return {
      name: user.name,
      target: goal.targetAmount,
      current: totalSold,
      percentage: Math.min((totalSold / goal.targetAmount) * 100, 100),
      milestones,
    };
  }

  static async getSalesHistory(userId: string) {
    return await prisma.sale.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }
}
