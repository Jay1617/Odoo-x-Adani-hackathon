import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";

// @desc    Get all employees for a company
// @route   GET /api/v1/employees
// @access  Private (COMPANY_ADMIN)
export const getEmployees = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "User must be associated with a company",
      });
    }

    const employees = await User.find({
      companyId,
      role: { $in: ["EMPLOYEE", "MAINTENANCE_TEAM"] },
    })
      .select("-password")
      .populate("maintenanceTeamId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { employees },
    });
  } catch (error) {
    console.error("Get employees error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching employees",
    });
  }
};

// @desc    Create employee
// @route   POST /api/v1/employees
// @access  Private (COMPANY_ADMIN)
export const createEmployee = async (req, res) => {
  try {
    const { name, email_id, password, role, phone } = req.body;
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "User must be associated with a company",
      });
    }

    // Validate role
    if (!["EMPLOYEE", "MAINTENANCE_TEAM"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be EMPLOYEE or MAINTENANCE_TEAM",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email_id });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create employee
    const employee = await User.create({
      name,
      email_id,
      password: hashedPassword,
      role,
      companyId,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          email_id: employee.email_id,
          role: employee.role,
          companyId: employee.companyId,
          phone: employee.phone,
          isActive: employee.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Create employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating employee",
    });
  }
};

// @desc    Update employee role (change between EMPLOYEE and MAINTENANCE_TEAM)
// @route   PUT /api/v1/employees/:id/role
// @access  Private (COMPANY_ADMIN)
export const updateEmployeeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const companyId = req.user.companyId;

    if (!["EMPLOYEE", "MAINTENANCE_TEAM"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be EMPLOYEE or MAINTENANCE_TEAM",
      });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Verify employee belongs to same company
    if (employee.companyId?.toString() !== companyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this employee",
      });
    }

    // If changing from MAINTENANCE_TEAM to EMPLOYEE, remove from category
    if (employee.role === "MAINTENANCE_TEAM" && role === "EMPLOYEE") {
      employee.maintenanceTeamId = null;
    }

    employee.role = role;
    await employee.save();

    res.json({
      success: true,
      message: "Employee role updated successfully",
      data: {
        employee: {
          id: employee._id,
          name: employee.name,
          role: employee.role,
          maintenanceTeamId: employee.maintenanceTeamId,
        },
      },
    });
  } catch (error) {
    console.error("Update employee role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating employee role",
    });
  }
};

// @desc    Update employee
// @route   PUT /api/v1/employees/:id
// @access  Private (COMPANY_ADMIN)
export const updateEmployee = async (req, res) => {
  try {
    const { name, phone, isActive } = req.body;
    const companyId = req.user.companyId;

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Verify employee belongs to same company
    if (employee.companyId?.toString() !== companyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this employee",
      });
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: { employee: updatedEmployee },
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating employee",
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/v1/employees/:id
// @access  Private (COMPANY_ADMIN)
export const deleteEmployee = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Verify employee belongs to same company
    if (employee.companyId?.toString() !== companyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this employee",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting employee",
    });
  }
};

