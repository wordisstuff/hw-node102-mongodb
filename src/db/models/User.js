import { model, Schema } from 'mongoose';
import { schemaObjectString } from '../../constants/constants.js';

const userSchema = new Schema(
    {
        name: schemaObjectString,
        email: { ...schemaObjectString, unique: true },
        password: schemaObjectString,
    },
    { timestamps: true, versionKey: false },
);

export const UserCollection = model('users', userSchema);
