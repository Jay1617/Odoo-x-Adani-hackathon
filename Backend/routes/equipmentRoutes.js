import express from "express";
import {
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} from "../controllers/equipmentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate); // Protect all routes

router.route("/")
  .post(createEquipment)
  .get(getEquipments);

router.route("/:id")
  .get(getEquipmentById)
  .put(updateEquipment)
  .delete(deleteEquipment);

export default router;
