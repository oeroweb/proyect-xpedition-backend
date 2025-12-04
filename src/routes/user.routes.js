import { Router } from 'express';
import UserController from '../controller/UserController.js';
import { validateBody } from '../middleware/validator.middleware.js';
import { createUserSchema, updateUserSchema } from '../domain/schemas/user.schema.js';

const router = Router();

router.get('/', UserController.listUsers);
router.get('/:id', UserController.getUser);

router.post('/', validateBody(createUserSchema), UserController.createUser);
router.put('/:id', validateBody(updateUserSchema), UserController.updateUser);

router.delete('/:id', UserController.deleteUser);

export default router;
