import express from 'express';
import { registerUserController } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserController } from '../controllers/authController.js';
import { loginUserSchema } from '../validation/authValidation.js';
import { refreshSessionController } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

export default router;
