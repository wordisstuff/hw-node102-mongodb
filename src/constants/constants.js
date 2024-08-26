import express from 'express';
import path from 'node:path';

export const pinoSettings = {
    transport: {
        target: 'pino-pretty',
    },
};

export const jsonParser = express.json();

export const schemaObjectString = { type: String, required: true };

export const TEMP_UPLOAD_DIR = path.resolve('./src/temp');
