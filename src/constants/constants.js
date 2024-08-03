import express from 'express';

export const pinoSettings = {
    transport: {
        target: 'pino-pretty',
    },
};

export const jsonParser = express.json();
