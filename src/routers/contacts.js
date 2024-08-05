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

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));
contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));
contactsRouter.post('/', jsonParser, ctrlWrapper(createContactController));
contactsRouter.patch('/:id', jsonParser, ctrlWrapper(updateContactController));
contactsRouter.delete('/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;
