import Equipment from "../Models/equipment.model.js";
import MaintenanceRequest from "../Models/request.model.js";

export const createEquipment = async (req, res) => {
  try {
    const equipment = new Equipment({
      ...req.body,
      companyId: req.user.companyId, // Assuming auth middleware adds user
      createdBy: req.user._id,
    });
    await equipment.save();
    res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEquipments = async (req, res) => {
  try {
    const { department, assignedTo } = req.query;
    let query = {};
    
    if (req.user.role !== 'PLATFORM_ADMIN') {
        if (!req.user.companyId) {
             return res.status(400).json({ success: false, message: "Company ID missing for non-admin user" });
        }
        query.companyId = req.user.companyId;
    }
    
    if (department) query.department = department;
    if (assignedTo) query.assignedTo = assignedTo;

    const equipments = await Equipment.find(query)
      .populate("assignedTo", "name email")
      .populate("maintenanceTeamId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: equipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
    .populate("assignedTo", "name email")
    .populate("maintenanceTeamId", "name");

    if (!equipment) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }
    
    // Get open request count for the smart button
    const requestCount = await MaintenanceRequest.countDocuments({
        equipmentId: equipment._id,
        status: { $in: ["NEW", "IN_PROGRESS"] }
    });

    res.status(200).json({ success: true, data: { ...equipment.toObject(), openRequestCount: requestCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!equipment) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }
    res.status(200).json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId,
    });
    if (!equipment) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }
    res.status(200).json({ success: true, message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
