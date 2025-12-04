import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.uuid': 'El userId debe ser un UUID válido.',
    'any.required': 'El userId es requerido.',
  }),
  planId: Joi.string().uuid().required().messages({
    'string.uuid': 'El planId debe ser un UUID válido.',
    'any.required': 'El planId es requerido.',
  }),
});

export const registerPaymentSchema = Joi.object({
  subscriptionId: Joi.string().uuid().required(),
  amount: Joi.number().precision(2).positive().required(),
});
