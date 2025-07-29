import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { UsersCollection } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js'; // перевір правильний шлях

const { JWT_ACCESS_SECRET = 'access-secret' } = process.env;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Access token missing or malformed'));
  }

  try {
    const { userId } = jwt.verify(token, JWT_ACCESS_SECRET);

    const session = await Session.findOne({ userId, accessToken: token });
    if (!session) {
      return next(createError(401, 'Invalid or expired token'));
    }

    const user = await UsersCollection.findById(userId);
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }

    return next(createError(401, 'Invalid access token'));
  }
};
