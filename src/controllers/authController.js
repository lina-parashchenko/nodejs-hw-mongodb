import createError from 'http-errors';
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
} from '../services/auth.js';

// РЕЄСТРАЦІЯ
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: userWithoutPassword,
  });
};

// ЛОГІН
export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None', // важливо для frontend на іншому домені
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in a user!',
    data: {
      accessToken,
    },
  });
};

// ОНОВЛЕННЯ СЕСІЇ
export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createError(401, 'Refresh token is missing');
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await refreshSession(refreshToken);

  // Перезаписуємо куку
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newAccessToken,
    },
  });
};

// ЛОГАУТ
export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  res.status(204).send();
};
