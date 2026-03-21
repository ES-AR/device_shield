import express from "express";
import {
  initiateTransferHandler,
  listTransfersHandler,
  acceptTransferHandler,
  rejectTransferHandler
} from "../controllers/transferController.js";

const router = express.Router();

router.post("/initiate", initiateTransferHandler);
router.get("/", listTransfersHandler);
router.put("/accept/:id", acceptTransferHandler);
router.put("/reject/:id", rejectTransferHandler);

export default router;
