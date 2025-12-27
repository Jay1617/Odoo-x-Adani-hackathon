import express from 'express';
import {
  getEmployees,
  createEmployee,
  updateEmployeeRole,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and company admin role
router.use(authenticate);
router.use(authorize('COMPANY_ADMIN'));

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.put('/:id/role', updateEmployeeRole);
router.delete('/:id', deleteEmployee);

export default router;

