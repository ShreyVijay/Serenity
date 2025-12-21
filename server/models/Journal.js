import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    culture: {
      type: String,enum: [
    "neutral",
    "indian",
    "western",
    "east-asian",
    "middle-eastern",
    "latin",
    "african"
  ],
      default: "neutral",
    },
    reflection: {
      type: String,
    },
    followUp: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
