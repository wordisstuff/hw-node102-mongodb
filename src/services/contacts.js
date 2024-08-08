import { Contact } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
// import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({ page, perPage, sortOrder, sortBy }) => {
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find();
    const contactsCount = await Contact.find()
        .merge(contactsQuery)
        .countDocuments();
    const contacts = await contactsQuery
        .skip(skip)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder })
        .exec();
    const paginationData = calculatePaginationData(
        contactsCount,
        page,
        perPage,
    );

    return { data: contacts, ...paginationData };
};
export const getContactById = id => Contact.findById(id);
export const postContact = body => Contact.create(body);
export const patchContact = (id, body) =>
    Contact.findByIdAndUpdate(id, body, { new: true });
export const deleteContact = id => Contact.findByIdAndDelete(id);
