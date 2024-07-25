import express, { Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware';
import authRoutes from './routes/auth.routes';
import itemRoutes from './routes/items.routes';

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/item', itemRoutes);
app.use(
  '/api',
  Router().get('/', (_req, res) => {
    res.json({ message: 'API Working' });
  })
);

app.use(errorHandler);
app.use(notFoundHandler);

const globalErrorHandler = function (err: Error): void {
  console.error('Uncaught Exception', err);
};

process.on('unhandledRejection', globalErrorHandler);
process.on('uncaughtException', globalErrorHandler);

export default app;
