import jwt from 'jsonwebtoken';
import createError from 'http-errors';

const { ACCESS_SECRET = 'access-secret' } = process.env;

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Access token missing or malformed'));
  }

  try {
    const user = jwt.verify(token, ACCESS_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }

    return next(createError(401, 'Invalid access token'));
  }
};
