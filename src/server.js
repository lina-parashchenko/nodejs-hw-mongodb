import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRouter.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import sessionRouter from './routes/sessionRouter.js';
import authRouter from './routes/authRouter.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();

const logger = pino({
  transport: { target: 'pino-pretty' },
});

export function setupServer() {
  const app = express();

  app.use('/api-docs', ...swaggerDocs());
  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);
  app.use('/session', sessionRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
