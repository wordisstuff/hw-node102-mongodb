import { Router } from 'express';
import validateBody from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    loginUserSchema,
    registerUserSchema,
    requestResetEmailSchema,
    resetPasswordSchema,
    confirmOAuthSchema,
} from '../validation/auth.js';
import {
    getGoogleOAuthUrlController,
    loginUserController,
    logoutUserController,
    refreshUserSessionController,
    registerUserController,
    requestResetEmailController,
    resetPasswordController,
    confirmOAuthController,
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

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
    '/confirm-oauth',
    jsonParser,
    validateBody(confirmOAuthSchema),
    ctrlWrapper(confirmOAuthController),
);

export default router;
