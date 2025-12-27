import express from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} from "../controllers/requestController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.route("/")
  .post(createRequest)
  .get(getRequests);

router.get("/dashboard-stats", getDashboardStats);

router.route("/:id")
  .get(getRequestById)
  .put(updateRequest)
  .delete(deleteRequest);

export default router;
