import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { pinoSettings } from './constants/constants.js';
import { authDb } from './constants/index.js';
import { getContactById, getContacts } from './services/contacts.js';
import { notFindeMiddleware } from './middlewares/notFindeMiddleware.js';

export const setupServer = () => {
    const app = express();

    app.use(pino(pinoSettings));
    app.use(cors());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/contacts', async (req, res) => {
        const contacts = await getContacts();
        res.status(200).send({ data: contacts });
    });

    app.get('/contacts/:id', async (req, res) => {
        const { id } = req.params;
        const contact = await getContactById(id);

        if (!contact)
            return res.status(404).send({ message: `Not found ${id}` });

        res.status(200).send({ data: contact });
    });

    app.use(notFindeMiddleware);

    const PORT = authDb.port;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};
