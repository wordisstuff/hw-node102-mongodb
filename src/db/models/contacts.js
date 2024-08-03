import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        isFavorite: { type: Boolean, default: false },
        contactType: {
            type: String,
            required: true,
            enum: ['work', 'personal', 'home'],
            default: 'personal',
        },
    },
    { timestamps: true, versionKey: false },
);

export const Contact = model('contacts', contactsSchema);
