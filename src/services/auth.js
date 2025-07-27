import { UsersCollection } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Session } from '../models/sessionModel.js';
import { createTokens } from '../helpers/createTokens.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ userId: user._id });
  const tokens = createTokens({ userId: user._id });

  const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: accessTokenExpiresAt,
    refreshTokenValidUntil: refreshTokenExpiresAt,
  });

  return tokens;
};

export const refreshSession = async (refreshToken) => {
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (createError) {
    throw createError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({ refreshToken });

  if (!existingSession) {
    throw createError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(existingSession._id);

  const tokens = createTokens({ userId: payload.userId });

  const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: payload.userId,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessTokenValidUntil: accessTokenExpiresAt,
    refreshTokenValidUntil: refreshTokenExpiresAt,
  });

  return tokens.accessToken;
};

export const logoutUser = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};
