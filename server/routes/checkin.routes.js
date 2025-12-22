import express from "express";
import { upsertCheckin, getCheckins } from "../controllers/checkin.controller.js";

const router = express.Router();

router.post("/", upsertCheckin);
router.get("/", getCheckins);

export default router;
