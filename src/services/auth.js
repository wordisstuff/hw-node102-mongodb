import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/Session.js';

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

    if (!user) throw createHttpError(404, 'User not found!');

    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) throw createHttpError(401, 'Unauthorized');

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now + ONE_DAY),
    });
};
