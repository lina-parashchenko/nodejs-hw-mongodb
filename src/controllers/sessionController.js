import createError from 'http-errors';
import { createSession } from '../services/session.js';

export const createSessionController = async (req, res) => {
  const session = await createSession(req.body);

  if (!session) {
    throw createError(500, 'Failed to create session');
  }

  res.status(201).json({
    status: 201,
    message: 'Session created successfully',
    data: session,
  });
};
