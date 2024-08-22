import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import randomToken from '../utils/randomToken.js';

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

    return await SessionsCollection.create({
        userId: user._id,
        accessToken: randomToken(30, 'base64'),
        refreshToken: randomToken(30, 'base64'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
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

    return await SessionsCollection.create({
        userId: session.userId,
        accessToken: randomToken(30, 'base64'),
        refreshToken: randomToken(30, 'base64'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};
