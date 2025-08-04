import express from 'express';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/authController.js';
import { sendResetEmailController } from '../controllers/sendResetEmailController.js';
import { resetPasswordController } from '../controllers/resetPasswordController.js';

import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema } from '../validation/authValidation.js';
import { sendResetEmailSchema } from '../validation/sendResetEmailSchema.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';

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

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmailController,
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default router;
