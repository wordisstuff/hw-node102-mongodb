import express from 'express';

export const pinoSettings = {
    transport: {
        target: 'pino-pretty',
    },
};

export const jsonParser = express.json();

export const schemaObjectString = { type: String, required: true };
