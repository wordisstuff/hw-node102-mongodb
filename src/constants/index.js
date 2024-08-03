import { env } from '../utils/env.js';

const VARS = {
    PORT: 'PORT',
    USER: 'MONGODB_USER',
    PASSWORD: 'MONGODB_PASSWORD',
    URL: 'MONGODB_URL',
    DB: 'MONGODB_DB',
};

export const authDb = {
    port: env(VARS.PORT, 3000),
    user: env(VARS.USER),
    pwd: env(VARS.PASSWORD),
    url: env(VARS.URL),
    db: env(VARS.DB),
};
