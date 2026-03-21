import express from "express";
import {
  registerDeviceHandler,
  verifyDeviceHandler,
  listDevicesHandler,
  reportStolenHandler
} from "../controllers/deviceController.js";

const router = express.Router();

router.post("/register", registerDeviceHandler);
router.get("/", listDevicesHandler);
router.get("/:imei", verifyDeviceHandler);
router.put("/report-stolen/:id", reportStolenHandler);

export default router;
