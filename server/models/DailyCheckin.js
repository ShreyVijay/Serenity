import mongoose from "mongoose";

const dailyCheckinSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD (local)
    emotion: { type: String, required: true }, // from EMOTIONS keys
    energy: { type: Number, min: 1, max: 5, required: true },
    openness: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("DailyCheckin", dailyCheckinSchema);
