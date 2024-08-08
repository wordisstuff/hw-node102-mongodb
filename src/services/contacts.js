import { Contact } from '../db/models/contacts.js';
import {calculatePaginationData} from '../utils/calculatePaginationData.js'
 
export const getContacts = ({page,perPage}) => {
        const skip = (page-1)*perPage;

       const contactsQuery = Contact.find();
       const contactsCount = Contact.find().merge(contactsQuery).countDocuments();
       const contacts = contactsQuery.skip(skip).limit(perPage).exec();
       const paginationData = calculatePaginationData(contactsCount,page,perPage);

       return {data:contacts,...paginationData};
    };
export const getContactById = id => Contact.findById(id);
export const postContact = body => Contact.create(body);
export const patchContact = (id, body) =>
    Contact.findByIdAndUpdate(id, body, { new: true });
export const deleteContact = id => Contact.findByIdAndDelete(id);
