import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// POST routes
router.post("/signup", authController.registration);
router.post("/verify-mobile", authController.verifyMobile);

// GET routes
router.get("/verify-email", authController.verifyEmail);

// Add more routes here as needed

export default router;