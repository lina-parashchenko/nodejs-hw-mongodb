import jwt from 'jsonwebtoken';
import { Session } from '../models/sessionModel.js';
import createError from 'http-errors';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw createError(401, 'No access token');
    }

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);

    const session = await Session.findOne({ accessToken });

    if (!session) {
      throw createError(401, 'Invalid session');
    }

    req.user = {
      id: payload.id,
      sessionId: session._id,
    };

    next();
  } catch (error) {
    next(error);
  }
};
