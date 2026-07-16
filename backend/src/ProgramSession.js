import mongoose from "mongoose";

const programSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    suitableFor: { type: String, required: true, trim: true },
    schedule: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    image: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ProgramSession =
  mongoose.models.ProgramSession || mongoose.model("ProgramSession", programSessionSchema);
