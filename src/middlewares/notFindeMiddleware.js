// import { Httperror } from 'http-errors';

export const notFindeMiddleware = (req, res) => {
    res.status(404).send({ message: 'Not found' });
};
