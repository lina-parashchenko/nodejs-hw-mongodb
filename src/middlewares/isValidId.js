import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  console.log('Checking ID:', id);

  if (!isValidObjectId(id)) {
    console.log('Invalid ID');
    return next(createError(400, 'Invalid contact ID'));
  }

  console.log('Valid ID');
  next();
};
