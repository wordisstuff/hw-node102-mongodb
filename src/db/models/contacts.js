import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        isFavourite: { type: Boolean, default: false },
        contactType: {
            type: String,
            enum: ['work', 'personal', 'home'],
            default: 'personal',
        },
    },
    { timestamps: true, versionKey: false },
);

export const Contact = model('contact', contactsSchema);
