import { Router } from 'express';
import SubscriptionController from '../controller/SubscriptionController.js';
import { validateBody } from '../middleware/validator.middleware.js';
import { createSubscriptionSchema } from '../domain/schemas/subscription.schema.js';

const router = Router();

router.get('/', SubscriptionController.listSubscriptions);

router.post('/', validateBody(createSubscriptionSchema), SubscriptionController.createSubscription);
router.post('/:id/cancel', SubscriptionController.cancelSubscription);

export default router;
