import { Router } from 'express';
import SubscriptionController from '../controller/SubscriptionController.js';

const router = Router();

router.get('/', SubscriptionController.listSubscriptions); 
router.post('/', SubscriptionController.createSubscription);
router.post('/:id/cancel', SubscriptionController.cancelSubscription); 

export default router;