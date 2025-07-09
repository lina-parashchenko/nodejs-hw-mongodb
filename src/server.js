import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRouter.js';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}
