import { model, Schema } from 'mongoose';
import { schemaObjectString } from '../../constants/constants.js';

const sessionSchema = new Schema(
    {
        userId: schemaObjectString,
        accessToken: schemaObjectString,
        refreshToken: schemaObjectString,
    },
    { timestamps: true, versionKey: false },
);

export const SessionCollection = model('session', sessionSchema);
