import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { pinoSettings } from './constants/constants.js';
import { authDb } from './constants/index.js';

export const setupServer = () => {

    const app = express();

    app.use(pino(pinoSettings));
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    const PORT = authDb.port;
    app.listen(PORT , () => {
        console.log('Server started on port 3000');
    });
};
