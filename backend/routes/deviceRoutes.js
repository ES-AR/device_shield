import express from "express";
import {
  registerDeviceHandler,
  verifyDeviceHandler,
  getDeviceByIdHandler,
  listDevicesHandler,
  reportStolenHandler,
  recoverDeviceHandler
} from "../controllers/deviceController.js";

const router = express.Router();

router.post("/register", registerDeviceHandler);
router.get("/", listDevicesHandler);
router.get("/id/:id", getDeviceByIdHandler);
router.get("/:imei", verifyDeviceHandler);
router.put("/report-stolen/:id", reportStolenHandler);
router.put("/recover/:id", recoverDeviceHandler);

export default router;
