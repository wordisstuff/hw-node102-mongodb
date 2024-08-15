import { model, Schema } from 'mongoose';
// import { schemaObjectString } from '../../constants/constants.js';

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = () => {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserCollection = model('users', userSchema);
