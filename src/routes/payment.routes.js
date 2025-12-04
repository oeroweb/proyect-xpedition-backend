import { Router } from 'express';
import PaymentController from '../controller/PaymentController.js';
import { validateBody } from '../middleware/validator.middleware.js';
import { registerPaymentSchema } from '../domain/schemas/subscription.schema.js';

const router = Router();

router.post('/', validateBody(registerPaymentSchema), PaymentController.registerPayment);

export default router;
