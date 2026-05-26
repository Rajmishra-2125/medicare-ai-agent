import mongoose, { Schema } from "mongoose";

const chatSessionSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Flexible mixed array to natively preserve the Gemini chat history structure,
    // including text messages, function calls, and function responses.
    history: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
