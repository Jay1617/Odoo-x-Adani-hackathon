import express from 'express';
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getPublicCompanies
} from '../controllers/companyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicCompanies);

// All routes require authentication
router.use(authenticate);

// Main admin only routes
router.get('/', authorize('PLATFORM_ADMIN'), getAllCompanies);
router.post('/', authorize('PLATFORM_ADMIN'), createCompany);
router.delete('/:id', authorize('PLATFORM_ADMIN'), deleteCompany);

// Company admin can view/update their own company
router.get('/:id', getCompanyById);
router.put('/:id', updateCompany);

export default router;

