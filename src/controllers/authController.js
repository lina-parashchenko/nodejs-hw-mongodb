import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userWithoutPassword,
  });
};
