import createHttpError from 'http-errors';
import {
    getContacts,
    getContactById,
    postContact,
    patchContact,
    deleteContact,
    findContactByEmail,
} from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res, next) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortOrder, sortBy } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id,
    });
    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { id } = req.params;

    const contact = await getContactById(id);
    console.log('contact', contact);
    if (!contact) {
        next(createHttpError(404, 'Contact not found.'));
        return;
    }

    if (
        contact.userId !== undefined
            ? contact.userId.toString()
            : null !== req.user._id.toString()
    ) {
        next(createHttpError(403, 'Contact not allowed!'));
        return;
    }

    res.json({
        status: 200,
        message: `Successfully found contact ${id} `,
        data: contact,
    });
};

export const createContactController = async (req, res, next) => {
    const { email } = req.body;
    const usedEmail = await findContactByEmail(email);
    if (usedEmail) {
        next(createHttpError(409, 'Email in use!'));
        return;
    }

    const contact = await postContact({ ...req.body, userId: req.user._id });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};

export const updateContactController = async (req, res, next) => {
    const { id } = req.params;

    const contact = await patchContact(id, req.body);

    if (contact.userId.toString() !== req.user._id.toString()) {
        next(createHttpError(403, 'Contact not allowed!'));
        return;
    }

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        res.json({ data: { message: 'Contact not found' } });
        return;
    }
    res.json({
        status: 200,
        message: `Successfully updated contact with id ${id}!`,
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { id } = req.params;
    const data = await getContactById(id);
    if (
        data !== null
            ? data.userId.toString()
            : null !== req.user._id.toString()
    ) {
        next(createHttpError(403, 'Contact not allowed!!!'));
        return;
    }

    const contact = await deleteContact(id);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send();
};
