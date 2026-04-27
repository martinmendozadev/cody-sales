import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import salesRoutes from './routes/sales.routes';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', salesRoutes);
app.use('/api', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
