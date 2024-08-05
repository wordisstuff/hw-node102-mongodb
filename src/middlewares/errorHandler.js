import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
    if (error instanceof HttpError) {
        res.status(error.status).json({
            message: error.name,
            data: error,
        });
        return;
    }
    res.status(500).json({
        message: 'Somthing went wrong',
        data: { message: error.message },
    });
};
