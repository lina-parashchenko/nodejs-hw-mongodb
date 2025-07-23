import express from 'express';
import { createSessionController } from '../controllers/sessionController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sessionSchema } from '../validation/sessionValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/',
  validateBody(sessionSchema),
  ctrlWrapper(createSessionController),
);

export default router;
