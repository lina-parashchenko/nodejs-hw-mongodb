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

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Email or password is wrong');
  }

  await Session.findOneAndDelete({ uid: user._id });

  const payload = { uid: user._id };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  await Session.create({ uid: user._id, token: refreshToken });

  return { accessToken, refreshToken };
};
export const refreshSession = async (refreshToken) => {
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (createError) {
    throw createError(401, 'Invalid refresh token');
  }

  const existingSession = await Session.findOne({ refreshToken });

  if (!existingSession) {
    throw createError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(existingSession._id);

  const tokens = createTokens({ userId: payload.userId });

  await Session.create({
    userId: payload.userId,
    refreshToken: tokens.refreshToken,
  });

  return tokens.accessToken;
};
