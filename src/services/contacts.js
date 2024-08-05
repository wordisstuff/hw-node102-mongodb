import { Contact } from '../db/models/contacts.js';

export const getContacts = () => Contact.find();
export const getContactById = id => Contact.findById(id);
export const postContact = body => Contact.create(body);
export const patchContact = (id, body) =>
    Contact.findByIdAndUpdate(id, body, { new: true });
export const deleteContact = id => Contact.findByIdAndDelete(id);
