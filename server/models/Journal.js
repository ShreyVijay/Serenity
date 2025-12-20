import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    culture: {
      type: String,
      enum: ["neutral", "indian", "western"],
      default: "neutral"
    },
    reflection: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
