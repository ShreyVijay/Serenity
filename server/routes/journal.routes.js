import express from "express";
import { createJournal, addFollowUp, getJournals } from "../controllers/journal.controller.js";

const router = express.Router();

router.post("/", createJournal);
router.get("/", getJournals);
router.post("/:journalId/followup", addFollowUp);

export default router;
