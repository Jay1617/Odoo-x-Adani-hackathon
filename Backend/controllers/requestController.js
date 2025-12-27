import MaintenanceRequest from "../Models/request.model.js";
import Equipment from "../Models/equipment.model.js";

export const createRequest = async (req, res) => {
  try {
    // Determine equipment details if not fully provided, but frontend usually provides equipmentId
    // If requestType is preventive, might need scheduledDate
    
    const request = new MaintenanceRequest({
      ...req.body,
      companyId: req.user.companyId,
      requestedBy: req.user._id,
    });
    await request.save();
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, equipmentId, assignedTo, type, maintenanceTeamId } = req.query;
    let query = {};

    if (req.user.role !== 'PLATFORM_ADMIN') {
         if (!req.user.companyId) {
             return res.status(400).json({ success: false, message: "Company ID missing for non-admin user" });
        }
        query.companyId = req.user.companyId;
    }

    if (status) query.status = status;
    if (equipmentId) query.equipmentId = equipmentId;
    if (assignedTo) query.assignedTo = assignedTo;
    if (type) query.requestType = type;
    if (maintenanceTeamId) query.maintenanceTeamId = maintenanceTeamId;

    const requests = await MaintenanceRequest.find(query)
      .populate("equipmentId", "name serialNumber defaultMaintenanceCategory")
      .populate("assignedTo", "name email")
      .populate("requestedBy", "name email")
      .populate("maintenanceTeamId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findOne({ _id: req.params.id, companyId: req.user.companyId })
            .populate("equipmentId")
            .populate("assignedTo")
            .populate("requestedBy")
            .populate("maintenanceTeamId");
        
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateRequest = async (req, res) => {
  try {
    const { status, duration } = req.body;
    
    // Check if moving to scrap
    if (status === "SCRAP") {
        const currentRequest = await MaintenanceRequest.findById(req.params.id);
        if (currentRequest) {
             await Equipment.findOneAndUpdate(
                { _id: currentRequest.equipmentId },
                { status: "SCRAPPED" }
            );
        }
    }

    // Logic: moving to REPAIRED usually requires duration. 
    // Moving directly to In Progress assigns the user if not assigned?
    // "Assignment: A manager or technician assigns themselves to the ticket... stage moves to In Progress"
    
    let updateData = { ...req.body };
    
    // Auto-assign if status changes to IN_PROGRESS and no one is assigned
    if (status === "IN_PROGRESS" && !req.body.assignedTo) {
        // Find current request
         const current = await MaintenanceRequest.findById(req.params.id);
         if (!current.assignedTo) {
             updateData.assignedTo = req.user._id;
         }
    }

    const request = await MaintenanceRequest.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      updateData,
      { new: true, runValidators: true }
    )
    .populate("equipmentId")
    .populate("assignedTo")
    .populate("requestedBy")
    .populate("maintenanceTeamId");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
        if (!request) return res.status(404).json({ success: false, message: "Request not found" });
        res.status(200).json({ success: true, message: "Request deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const companyId = req.user.companyId;

        let stats = {};

        if (role === 'MAINTENANCE_TEAM') {
             // For Maintenance Team: active tasks, team unclaimed, history
             const maintenanceTeamId = req.user.maintenanceTeamId; // Assuming populated or ID? Logic needs to be safe.
             // But wait, req.user from auth middleware might not populate if not requested.
             // Middleware usually: const user = await User.findById(decoded.id).select('-password');
             // It does NOT populate by default in typical auth middleware unless specified.
             // We should query using the ID we have.

             const myTasks = await MaintenanceRequest.countDocuments({ assignedTo: userId, status: { $nin: ['REPAIRED', 'SCRAP'] } });
             const completedByMe = await MaintenanceRequest.countDocuments({ assignedTo: userId, status: 'REPAIRED' });
             
             let teamUnassigned = 0;
             let activeTaskList = [];
             
             if (maintenanceTeamId) {
                  // Normalize ID if it's an object (though usually auth middleware returns doc which behaves like object but has _id)
                  // But if it wasn't populated in auth middleware, it is an ObjectId.
                  teamUnassigned = await MaintenanceRequest.countDocuments({ maintenanceTeamId: maintenanceTeamId, assignedTo: null });
                  
                  // Get top 5 active tasks
                  activeTaskList = await MaintenanceRequest.find({
                      $or: [
                          { assignedTo: userId },
                          { maintenanceTeamId: maintenanceTeamId, assignedTo: null }
                      ],
                      status: { $nin: ['REPAIRED', 'SCRAP'] }
                  })
                  .sort({ priority: -1, createdAt: -1 }) // High priority first
                  .limit(5)
                  .populate("equipmentId", "name");
             } else {
                 // Fallback if no team assigned
                  activeTaskList = await MaintenanceRequest.find({ assignedTo: userId, status: { $nin: ['REPAIRED', 'SCRAP'] } })
                  .sort({ priority: -1, createdAt: -1 })
                  .limit(5)
                  .populate("equipmentId", "name");
             }

             stats = {
                 assignedToMe: myTasks,
                 teamUnassigned,
                 completedByMe,
                 activeTasks: activeTaskList
             };

        } else {
            // For Normal Employee: My Submitted Requests
             const totalSubmitted = await MaintenanceRequest.countDocuments({ requestedBy: userId });
             const openSubmitted = await MaintenanceRequest.countDocuments({ requestedBy: userId, status: { $nin: ['REPAIRED', 'SCRAP'] } });
             const completedSubmitted = await MaintenanceRequest.countDocuments({ requestedBy: userId, status: { $in: ['REPAIRED', 'SCRAP'] } });

             stats = {
                 myRequests: totalSubmitted,
                 openRequests: openSubmitted,
                 completedRequests: completedSubmitted
             };
        }

        res.status(200).json({ success: true, data: stats });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
