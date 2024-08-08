import { Router } from 'express';

import {
    createContactController,
    deleteContactController,
    getAllContactsController,
    getContactByIdController,
    updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { jsonParser } from '../constants/constants.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../middlewares/validateBody.js';

import { createContactSchema,updateContactSchema } from '../validation/contactValidateSchemas.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id',isValidId, ctrlWrapper(getContactByIdController));
contactsRouter.post('/', jsonParser,validateBody(createContactSchema), ctrlWrapper(createContactController));
contactsRouter.patch('/:id',isValidId, jsonParser,validateBody(updateContactSchema), ctrlWrapper(updateContactController));
contactsRouter.delete('/:id',isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
