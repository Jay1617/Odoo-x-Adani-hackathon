import MaintenanceTeam from "../Models/maintenanceTeam.model.js";

export const createTeam = async (req, res) => {
  try {
    const team = new MaintenanceTeam({
      ...req.body,
      companyId: req.user.companyId,
      createdBy: req.user._id,
    });
    await team.save();
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find({ companyId: req.user.companyId })
      .populate("members", "name email");
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeamById = async (req, res) => {
    try {
      const team = await MaintenanceTeam.findOne({ _id: req.params.id, companyId: req.user.companyId })
        .populate("members", "name email");
      if (!team) return res.status(404).json({ success: false, message: "Team not found" });
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTeam = async (req, res) => {
    try {
      const team = await MaintenanceTeam.findOneAndUpdate(
        { _id: req.params.id, companyId: req.user.companyId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!team) return res.status(404).json({ success: false, message: "Team not found" });
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
};
