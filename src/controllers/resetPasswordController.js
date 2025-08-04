import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { UsersCollection } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const { JWT_SECRET } = process.env;

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (createError) {
      throw createError(401, 'Token is expired or invalid.');
    }

    const { email } = payload;
    const user = await UsersCollection.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
