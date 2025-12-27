import MaintenanceCategory from "../Models/maintenanceCategory.model.js";
import User from "../Models/user.model.js";

// @desc    Create maintenance category
// @route   POST /api/v1/categories
// @access  Private (COMPANY_ADMIN)
export const createCategory = async (req, res) => {
  try {
    const { name, description, maxEmployees } = req.body;
    const companyId = req.user.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "User must be associated with a company",
      });
    }

    // Check if category name already exists for this company
    const existingCategory = await MaintenanceCategory.findOne({
      companyId,
      name,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await MaintenanceCategory.create({
      companyId,
      name,
      description,
      maxEmployees: maxEmployees || 0,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating category",
    });
  }
};

// @desc    Get all categories for a company
// @route   GET /api/v1/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.query.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const categories = await MaintenanceCategory.find({ companyId, isActive: true })
      .populate("assignedEmployees", "name email_id role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching categories",
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/v1/categories/:id
// @access  Private
export const getCategoryById = async (req, res) => {
  try {
    const category = await MaintenanceCategory.findById(req.params.id)
      .populate("assignedEmployees", "name email_id role phone");

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching category",
    });
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (COMPANY_ADMIN)
export const updateCategory = async (req, res) => {
  try {
    const { name, description, maxEmployees, isActive } = req.body;

    const category = await MaintenanceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Verify company admin owns this category
    if (category.companyId.toString() !== req.user.companyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this category",
      });
    }

    const updatedCategory = await MaintenanceCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, maxEmployees, isActive },
      { new: true, runValidators: true }
    ).populate("assignedEmployees", "name email_id");

    res.json({
      success: true,
      message: "Category updated successfully",
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating category",
    });
  }
};

// @desc    Assign employee to category
// @route   POST /api/v1/categories/:id/assign
// @access  Private (COMPANY_ADMIN)
export const assignEmployeeToCategory = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const category = await MaintenanceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Verify company admin owns this category
    if (category.companyId.toString() !== req.user.companyId?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check if employee exists and is MAINTENANCE_TEAM
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "MAINTENANCE_TEAM") {
      return res.status(400).json({
        success: false,
        message: "Employee must be a maintenance team member",
      });
    }

    // Check if already assigned
    if (category.assignedEmployees.includes(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Employee already assigned to this category",
      });
    }

    // Check max employees limit
    if (category.maxEmployees > 0 && category.assignedEmployees.length >= category.maxEmployees) {
      return res.status(400).json({
        success: false,
        message: "Maximum employees limit reached for this category",
      });
    }

    category.assignedEmployees.push(employeeId);
    await category.save();

    // Update employee's maintenanceTeamId
    employee.maintenanceTeamId = category._id;
    await employee.save();

    const updatedCategory = await MaintenanceCategory.findById(req.params.id)
      .populate("assignedEmployees", "name email_id role");

    res.json({
      success: true,
      message: "Employee assigned successfully",
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error("Assign employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error assigning employee",
    });
  }
};

// @desc    Remove employee from category
// @route   DELETE /api/v1/categories/:id/assign/:employeeId
// @access  Private (COMPANY_ADMIN)
export const removeEmployeeFromCategory = async (req, res) => {
  try {
    const category = await MaintenanceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.assignedEmployees = category.assignedEmployees.filter(
      (id) => id.toString() !== req.params.employeeId
    );
    await category.save();

    // Update employee
    await User.findByIdAndUpdate(req.params.employeeId, {
      maintenanceTeamId: null,
    });

    res.json({
      success: true,
      message: "Employee removed successfully",
    });
  } catch (error) {
    console.error("Remove employee error:", error);
    res.status(500).json({
      success: false,
      message: "Server error removing employee",
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (COMPANY_ADMIN)
export const deleteCategory = async (req, res) => {
  try {
    const category = await MaintenanceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await MaintenanceCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting category",
    });
  }
};

