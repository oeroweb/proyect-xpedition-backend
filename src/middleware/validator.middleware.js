import Joi from 'joi';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400; // Bad Request
  }
}

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new ValidationError(message));
  }

  next();
};