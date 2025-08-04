import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { UsersCollection } from '../models/userModel.js';
import { sendEmail } from '../helpers/sendEmail.js';

const { JWT_SECRET, APP_DOMAIN } = process.env;

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });

  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;
  const subject = 'Reset Your Password';
  const html = `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

  try {
    await sendEmail({
      to: email,
      subject,
      html,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};
