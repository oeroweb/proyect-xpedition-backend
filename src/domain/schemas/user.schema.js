import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser un formato válido.',
    'any.required': 'El campo email es requerido.',
  }),
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'El nombre no puede estar vacío.',
    'string.min': 'El nombre debe tener al menos 3 caracteres.',
    'any.required': 'El campo nombre es requerido.',
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().min(3).max(100),
}).min(1);
