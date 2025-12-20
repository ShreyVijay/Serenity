import express from "express";
import { createJournal, getJournals } from "../controllers/journal.controller.js";

const router = express.Router();

router.post("/", createJournal);
router.get("/", getJournals);

export default router;
