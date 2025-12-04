import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

// User routes
router.post('/users', controller.createUser);
router.get('/users', controller.getAllUsers);
router.get('/users/regions', controller.getRegions);
router.get('/users/departments', controller.getDepartments);
router.get('/users/:id', controller.getUserById);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

export default router;

