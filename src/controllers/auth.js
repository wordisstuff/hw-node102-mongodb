import { registerUser } from '../services/auth.js';

export const registerUserController = (req, res) => {
    const user = registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};
