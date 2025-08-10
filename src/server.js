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
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const logger = pino({
  transport: { target: 'pino-pretty' },
});

const swaggerDocument = YAML.load(
  path.resolve(process.cwd(), 'docs', 'openapi.yaml'),
);

export function setupServer() {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
