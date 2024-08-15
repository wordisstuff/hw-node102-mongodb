import { Router } from "express";
import contactsRouter from './contacts.js';
import registerRouter from './auth.js';

const router = Router();

router.use('/contacts',contactsRouter);
router.use('/auth',registerRouter);

export default router;