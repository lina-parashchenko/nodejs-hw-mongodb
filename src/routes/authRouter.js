import express from 'express';
import { registerUserController } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

export default router;
