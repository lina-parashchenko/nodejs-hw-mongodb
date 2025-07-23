import { Session } from '../models/sessionModel.js';

export const createSession = async (sessionData) => {
  const newSession = await Session.create(sessionData);
  return newSession;
};
