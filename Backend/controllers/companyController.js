import Company from "../Models/company.model.js";
import User from "../Models/user.model.js";

// @desc    Create company (by main admin or during company admin registration)
// @route   POST /api/v1/companies
// @access  Private (PLATFORM_ADMIN) or Public (during registration)
export const createCompany = async (req, res) => {
  try {
    const { name, email, phone, address, createdBy } = req.body;

    // Check if company name already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with this name already exists",
      });
    }

    const company = await Company.create({
      name,
      email,
      phone,
      address,
      createdBy: createdBy || req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: { company },
    });
  } catch (error) {
    console.error("Create company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating company",
    });
  }
};

// @desc    Get all companies (main admin only)
// @route   GET /api/v1/companies
// @access  Private (PLATFORM_ADMIN)
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("createdBy", "name email_id")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { companies },
    });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching companies",
    });
  }
};

// @desc    Get company by ID
// @route   GET /api/v1/companies/:id
// @access  Private
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "name email_id"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      data: { company },
    });
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching company",
    });
  }
};

// @desc    Update company
// @route   PUT /api/v1/companies/:id
// @access  Private (PLATFORM_ADMIN or COMPANY_ADMIN of that company)
export const updateCompany = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check permissions
    if (req.user.role !== "PLATFORM_ADMIN" && req.user.companyId?.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this company",
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Company updated successfully",
      data: { company: updatedCompany },
    });
  } catch (error) {
    console.error("Update company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating company",
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/v1/companies/:id
// @access  Private (PLATFORM_ADMIN only)
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting company",
    });
  }
};

