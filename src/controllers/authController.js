import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import createError from 'http-errors';
import { logoutUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userWithoutPassword,
  });
};

export const loginUserController = async (req, res) => {
  const accessToken = await loginUser(req.body);

  res.cookie('refreshToken', accessToken.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in an user!',
    data: {
      accessToken: accessToken.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }

  const accessToken = await refreshSession(refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
