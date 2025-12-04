import { ValidationError } from "./validator.middleware.js";
import { BusinessRuleError } from "../domain/errors/BusinessRuleError.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Error interno del servidor.";

  if (err instanceof BusinessRuleError || err instanceof ValidationError) {
    statusCode = err.statusCode || 400;
    message = err.message;
  } else if (err.code && err.code.startsWith("P")) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = `El registro ya existe (Conflicto en ${err.meta.target.join(
        ", "
      )}).`;
    } else {
      statusCode = 500;
      message = "Error de base de datos no manejado.";
      console.error("PRISMA ERROR:", err);
    }
  } else {
    console.error("SERVER ERROR:", err.stack);
    statusCode = 500;
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};

export default errorHandler;
