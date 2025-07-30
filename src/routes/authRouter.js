import express from 'express';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/authController.js';

import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema } from '../validation/authValidation.js';

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

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
