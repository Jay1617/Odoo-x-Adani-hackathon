import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register new user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email_id, password, role, companyId, maintenanceTeamId, phone, companyDetails } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email_id });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // If COMPANY_ADMIN, require company details
    if (role === 'COMPANY_ADMIN' && !companyDetails) {
      return res.status(400).json({
        success: false,
        message: 'Company details are required for company admin registration'
      });
    }

    // Hash password first
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user first (without companyId for COMPANY_ADMIN)
    const user = await User.create({
      name,
      email_id,
      password: hashedPassword,
      role,
      companyId: role === 'COMPANY_ADMIN' ? null : (companyId || null), // Will set after company creation
      maintenanceTeamId: maintenanceTeamId || null,
      phone
    });

    let finalCompanyId = companyId;

    // If COMPANY_ADMIN, create company after user is created
    if (role === 'COMPANY_ADMIN' && companyDetails) {
      const Company = (await import('../Models/company.model.js')).default;
      
      // Check if company name already exists
      const existingCompany = await Company.findOne({ name: companyDetails.name });
      if (existingCompany) {
        // Delete the user we just created since company creation failed
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Company with this name already exists'
        });
      }

      // Create company with user's ID as createdBy
      const company = await Company.create({
        name: companyDetails.name,
        email: companyDetails.email,
        phone: companyDetails.phone,
        address: companyDetails.address,
        createdBy: user._id, // Set user ID as createdBy
      });

      finalCompanyId = company._id;

      // Update user with companyId
      user.companyId = finalCompanyId;
      await user.save();
    }

    // Refresh user to get updated companyId if it was set
    const updatedUser = await User.findById(user._id).select('-password');

    // Generate token
    const token = generateToken(updatedUser._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email_id: updatedUser.email_id,
          role: updatedUser.role,
          companyId: updatedUser.companyId,
          maintenanceTeamId: updatedUser.maintenanceTeamId,
          phone: updatedUser.phone,
          isActive: updatedUser.isActive
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email_id }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email_id: user.email_id,
          role: user.role,
          companyId: user.companyId,
          maintenanceTeamId: user.maintenanceTeamId,
          phone: user.phone,
          isActive: user.isActive,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('companyId', 'name')
      .populate('maintenanceTeamId', 'name');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the token. However, we can track logout on server-side
    // and optionally blacklist tokens for enhanced security.
    
    // Update user's last logout time (optional)
    await User.findByIdAndUpdate(req.user.id, {
      lastLogout: new Date()
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .populate('companyId', 'name')
      .populate('maintenanceTeamId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};