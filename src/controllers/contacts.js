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
import saveFileToUploads from '../utils/saveFileToUploads.js';
import { cloudApi } from '../constants/index.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';

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
    const ids = { _id: req.params.id, userId: req.user._id };

    const contact = await getContactById(ids);

    if (!contact) {
        next(createHttpError(404, 'Contact not found! or... ;)'));
        return;
    }

    res.json({
        status: 200,
        message: `Successfully found contact ${ids._id} `,
        data: contact,
    });
};

export const createContactController = async (req, res, next) => {
    const { email } = req.body;
    const photo = req.file;
    let photoUrl = null;

    const usedEmail = await findContactByEmail(email);
    if (usedEmail) {
        next(createHttpError(409, 'Email in use!'));
        return;
    }
    if (photo) {
        if (cloudApi.enable === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploads(photo);
        }
    }

    const contact = await postContact({
        ...req.body,
        userId: req.user._id,
        photo: photoUrl,
    });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: contact,
    });
};

export const updateContactController = async (req, res, next) => {
    const ids = { _id: req.params.id, userId: req.user._id.toString() };
    const photo = req.file;
    let photoUrl;
    const contact = await getContactById(ids);

    if (
        contact === null ||
        contact.userId === null ||
        contact.userId.toString() !== req.user._id.toString()
    ) {
        next(createHttpError(403, 'Contact not allowed!'));
        return;
    }

    if (photo) {
        if (cloudApi.enable === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploads(photo);
        }
    }

    const updatedContact = await patchContact(ids, {
        ...req.body,
        photo: photoUrl,
    });

    if (!updatedContact) {
        next(createHttpError(404, 'Contact not found'));
        res.json({ data: { message: 'Contact not found' } });
        return;
    }
    res.json({
        status: 200,
        message: `Successfully updated contact with id ${ids._id}!`,
        data: updatedContact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const ids = { _id: req.params.id, userId: req.user._id };

    const data = await getContactById(ids);

    if (
        data !== null || data.userId
            ? data.userId.toString() !== req.user._id.toString()
            : null
    ) {
        next(createHttpError(403, 'Contact not allowed!!!'));
        return;
    }

    const contact = await deleteContact(ids);

    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }
    res.status(204).send();
};
