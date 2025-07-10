import 'reflect-metadata';
import express from 'express';
import userRouter from './application/user/interfaces/routes/user.router';
import { AppDataSource } from './infrastructure/database';
import authRouter from './application/auth/interfaces/routes/auth.router';

const app = express();
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos', err);
  });
