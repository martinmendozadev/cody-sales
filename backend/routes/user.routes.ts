import { Router } from 'express';
import { prisma } from '../config/db';

const router = Router();

router.get('/usuarios', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

export default router;
