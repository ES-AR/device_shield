import express from "express";
import {
	registerUserHandler,
	verifyUserHandler,
	loginUserHandler
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserHandler);
router.post("/login", loginUserHandler);
router.get("/verify/:identifier", verifyUserHandler);

export default router;
