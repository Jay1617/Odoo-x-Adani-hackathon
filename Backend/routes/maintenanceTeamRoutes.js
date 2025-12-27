import express from "express";
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
} from "../controllers/maintenanceTeamController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.route("/")
  .post(createTeam)
  .get(getTeams);

router.route("/:id")
  .get(getTeamById)
  .put(updateTeam);

export default router;
