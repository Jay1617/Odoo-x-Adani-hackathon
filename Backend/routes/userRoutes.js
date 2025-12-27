import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);

// Protected routes
router.post('/logout', authenticate, logoutUser);
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

// Admin only routes
router.get('/', authenticate, authorize('PLATFORM_ADMIN'), getAllUsers); // Platform admin only? Or Company admin needs to see their employees?

// Route for Company Admin to update employee role/team
router.put('/:id/role', authenticate, authorize('COMPANY_ADMIN'), updateUserRole);

export default router;