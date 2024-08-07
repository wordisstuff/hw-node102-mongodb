import Joi from 'joi';

export const createContactSchema = Joi.object({
    name:Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    isFavorite: Joi.boolean().default(false),
    conactType: Joi.string().valid('work', 'personal', 'home').default('personal').required()
})

export const updateContactSchema = Joi.object({
    name:Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    isFavorite: Joi.boolean().default(false),
    conactType: Joi.string().valid('work', 'personal', 'home').default('personal')
})