import { Router } from 'express';
import validateBody from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    loginUserSchema,
    registerUserSchema,
    requestResetEmailSchema,
} from '../validation/auth.js';
import {
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    registerUserController,
    requestResetEmailController,
} from '../controllers/auth.js';
import { jsonParser } from '../constants/constants.js';

const router = Router();

router.post(
    '/register',
    jsonParser,
    validateBody(registerUserSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/login',
    jsonParser,
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);
router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post(
    '/request-reset-email',
    jsonParser,
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);

export default router;
