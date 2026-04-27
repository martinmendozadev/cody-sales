import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Aquí agregaremos las rutas pronto
// app.use('/api', routes);

// Middleware de manejo de errores global
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
