import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { smtp, tps, authDb } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import randomToken from '../utils/randomToken.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import templateMaker from '../utils/templateMaker.js';
import {
    getFullNameFromGoogleTokenPayload,
    validateCode,
} from '../utils/googleOAuth2.js';
import createSession from '../utils/createSession.js';

export const registerUser = async payload => {
    console.log('payload', payload);
    const user = await UserCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use!');

    const cryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UserCollection.create({
        ...payload,
        password: cryptedPassword,
    });
};

export const loginUser = async payload => {
    const user = await UserCollection.findOne({ email: payload.email });
    console.log('1', user);

    if (!user) throw createHttpError(404, 'User not found!');

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) throw createHttpError(401, 'Unauthorized');

    await SessionsCollection.deleteOne({ userId: user._id });

    const newSession = await createSession({ userId: user._id });
    return await SessionsCollection.create(newSession);
};

export const logoutUser = async sessionId => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) throw createHttpError(401, 'Session not found');

    if (new Date() > new Date(session.refreshTokenValidUntil))
        throw createHttpError(401, 'Session token expired');

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    const newSession = await createSession({ userId: session.userId });
    return await SessionsCollection.create(newSession);
};
export const requestResetToken = async email => {
    const user = await UserCollection.findOne({ email });
    console.log(user);

    if (!user) throw createHttpError(404, 'User not found!');

    const resetToken = jwt.sign({ sub: user._id, email }, smtp.smtpJwtSecret, {
        expiresIn: '5m',
    });

    const html = templateMaker({
        name: user.name,
        link: `${tps.domain}${authDb.port}/reset-pwd?token=${resetToken}`,
    });
    console.log('HTML', html);

    await sendEmail({
        from: smtp.from,
        to: email,
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async (pass, token) => {
    try {
        const { sub, email } = jwt.verify(token, smtp.smtpJwtSecret);
        const user = await UserCollection.findOne({ _id: sub, email });
        if (!user) throw createHttpError(404, 'User no found');

        const hashedPassword = await bcrypt.hash(pass, 10);
        await UserCollection.findOneAndUpdate(
            { _id: user._id },
            { password: hashedPassword },
        );
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, err.message);
        throw err;
    }
};

export const loginOrSignupWithGoogle = async code => {
    const loginTicket = await validateCode(code);
    console.log(loginTicket);
    const payload = loginTicket.getPayload();
    console.log(payload);
    if (!payload) throw createHttpError(401);

    const user = await UserCollection.findOne({ email: payload.email });
    if (!user) {
        const password = await bcrypt.hash(randomToken(10, 'base64'), 10);
        const newUser = await UserCollection.create({
            email: payload.email,
            name: getFullNameFromGoogleTokenPayload(payload),
            password,
        });
        const session = await createSession({ userId: newUser._id });
        return await SessionsCollection.create(session);
    }
    await SessionsCollection.deleteOne({ userId: user._id });
    const session = await createSession({ userId: user._id });
    return await SessionsCollection.create(session);
};
