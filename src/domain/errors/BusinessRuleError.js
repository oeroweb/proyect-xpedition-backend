import { AppError } from "./AppError.js";

export class BusinessRuleError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}
