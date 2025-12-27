import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  assignEmployeeToCategory,
  removeEmployeeFromCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Company admin only routes
router.post('/', authorize('COMPANY_ADMIN'), createCategory);
router.put('/:id', authorize('COMPANY_ADMIN'), updateCategory);
router.delete('/:id', authorize('COMPANY_ADMIN'), deleteCategory);
router.post('/:id/assign', authorize('COMPANY_ADMIN'), assignEmployeeToCategory);
router.delete('/:id/assign/:employeeId', authorize('COMPANY_ADMIN'), removeEmployeeFromCategory);

// All authenticated users can view categories
router.get('/', getCategories);
router.get('/:id', getCategoryById);

export default router;

