import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import randomToken from './randomToken.js';

const createSession = async user => {
    return await SessionsCollection.create({
        userId: user.userId,
        accessToken: randomToken(30, 'base64'),
        refreshToken: randomToken(30, 'base64'),
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

export default createSession;
