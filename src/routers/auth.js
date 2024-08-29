import { Router } from 'express';
import validateBody from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    loginUserSchema,
    registerUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema,
} from '../validation/auth.js';
import {
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    registerUserController,
    requestResetEmailController,
    resetPasswordController,
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
    '/send-reset-email',
    jsonParser,
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);
router.post(
    '/reset-pwd',
    jsonParser,
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController),
);

export default router;
