import { model, Schema } from 'mongoose';
// import { schemaObjectString } from '../../constants/constants.js';

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = () => {
    const object = this.toObject();
    delete object.password;
    return object;
};

export const UserCollection = model('users', userSchema);
