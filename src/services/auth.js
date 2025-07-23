import { UsersCollection } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};
