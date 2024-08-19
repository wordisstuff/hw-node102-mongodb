import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(
            createHttpError(401, 'Please provide Authorization header'),
        );
    }
    const [bearer, accessToken] = authorization.split(' ');

    if (bearer !== 'Bearer' || !accessToken) {
        next(createHttpError(401, 'Auth header should be of type Bearer'));
        return;
    }
    const session = await SessionsCollection.findOne({ accessToken });

    if (!session) {
        next(createHttpError(401, 'Session not found'));
        return;
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
        next(createHttpError(401, 'Access token expired'));
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
        next(createHttpError(401, 'Session not found!'));
    }
    req.user = user;
    next();
};
