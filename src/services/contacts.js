import { Contact } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
// import { SORT_ORDER } from '../constants/index.js';

export const findContactByEmail = email => Contact.findOne({ email });
export const getContacts = async ({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
}) => {
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find();
    if (filter.isFavourite)
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    if (filter.contactType)
        contactsQuery.where('contactType').equals(filter.contactType);

    contactsQuery.where('userId').equals(userId);

    const [contactsCount, contacts] = await Promise.all([
        Contact.find().merge(contactsQuery).countDocuments(),
        Contact.find()
            .merge(contactsQuery)
            .skip(skip)
            .limit(perPage)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(
        contactsCount,
        page,
        perPage,
    );

    return { data: contacts, ...paginationData };
};
export const getContactById = ids => Contact.findById(ids._id);

export const postContact = body => Contact.create(body);

export const patchContact = (ids, body) =>
    Contact.findOneAndUpdate(ids, body, { new: true });

export const deleteContact = ids => Contact.findOneAndDelete(ids);
