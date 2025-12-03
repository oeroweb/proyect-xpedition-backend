import { ValidationError } from './validator.middleware.js'; 

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Error interno del servidor.';

  if (err.name === 'ValidationError' || err.statusCode === 400) {
    statusCode = 400;
    message = err.message;
  } 
  else if (err.statusCode === 404) {
    statusCode = 404;
    message = err.message || 'Recurso no encontrado.';
  }
  else {
    console.error('SERVER ERROR:', err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
};

export default errorHandler;