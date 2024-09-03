import { OAuth2Client } from 'google-auth-library';
import { readFile } from 'node:fs/promises';
import { OAuth } from '../constants/index.js';
import createHttpError from 'http-errors';

const oauthConfig = JSON.parse(await readFile(OAuth.jsonPath));

const googleOAuthClient = new OAuth2Client({
    clientId: OAuth.clientId,
    clientSecret: OAuth.clientSecret,
    redirectUri: oauthConfig.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
    googleOAuthClient.generateAuthUrl({
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    });

export const validateCode = async code => {
    const res = await googleOAuthClient.getToken(code);
    if (!res.tokens.id_token) throw createHttpError(401, 'Unauthorized');
    return await googleOAuthClient.verifyIdToken({
        idToken: res.tokens.id_token,
    });
};

export const getFullNameFromGoogleTokenPayload = ({
    given_name,
    family_name,
}) => {
    let fullName = 'Guest';

    if (given_name && family_name) {
        fullName = `${given_name}${family_name}`;
    } else if (given_name) {
        fullName = given_name;
    }
    return fullName;
};
