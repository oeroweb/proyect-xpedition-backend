import { Router } from 'express';
import PlanController from '../controller/PlanController.js';

const router = Router();

router.get('/', PlanController.listPlans);
router.post('/', PlanController.createPlan);
router.put('/:id', PlanController.updatePlan);
router.delete('/:id', PlanController.deletePlan);

export default router;
