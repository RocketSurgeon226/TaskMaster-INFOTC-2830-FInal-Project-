import express from "express";
import { getRewards } from "../controllers/rewardController.js";

const router = express.Router();
router.get("/:userID", getRewards);
export default router;