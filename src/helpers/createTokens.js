import jwt from 'jsonwebtoken';

export const createTokens = ({ userId }) => {
  const accessTokenExpiresIn = 15 * 60 * 1000; // 15 хв
  const refreshTokenExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30 днів

  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + accessTokenExpiresIn),
    refreshTokenValidUntil: new Date(Date.now() + refreshTokenExpiresIn),
  };
};
