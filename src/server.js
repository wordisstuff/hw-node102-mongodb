import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { pinoSettings } from './constants/constants.js';
import { authDb } from './constants/index.js';
import { notFindeMiddleware } from './middlewares/notFindeMiddleware.js';

import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
    const app = express();

    app.use(pino(pinoSettings));
    app.use(cors());

    app.get('/', (req,res)=> res.send('Hello! it is home work 4 from Wordisstuff'));
    app.use('/contacts', contactsRouter);

    app.use(notFindeMiddleware);
    app.use(errorHandler);

    const PORT = authDb.port;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};
