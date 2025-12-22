import express from "express";
import { clearSession } from "../controllers/session.controller.js";

const router = express.Router();

router.delete("/:sessionId", clearSession);

export default router;
