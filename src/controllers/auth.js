import createHttpError from 'http-errors';
import { ONE_DAY } from '../constants/index.js';
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshUsersSession,
    requestResetToken,
    resetPassword,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
    console.log('BODY', req.body);
    const user = await registerUser(req.body);

    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    console.log('SESSION', session);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: { accessToken: session.accessToken },
    });
};

export const logoutUserController = async (req, res) => {
    console.log(req.cookies);
    if (req.cookies.sessionId) await logoutUser(req.cookies.sessionId);

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
    const session = await refreshUsersSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken: session.accessToken },
    });
};

export const requestResetEmailController = async (req, res) => {
    const resetEmail = req.body.email;
    console.log(resetEmail);
    if (!resetEmail) {
        throw createHttpError(
            500,
            'Failed to send the email, please try again later.',
        );
    }

    await requestResetToken(resetEmail);

    res.json({
        message: 'Reset password email was successfully sent!',
        status: 200,
        data: {},
    });
};

export const resetPasswordController = async (req, res) => {
    const { password, token } = req.body;
    await resetPassword(password, token);

    res.json({
        status: 200,
        nessage: 'Password was successfully reset!',
        data: {},
    });
};
