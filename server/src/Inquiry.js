import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    childName: { type: String, required: true, trim: true },
    childAge: { type: Number, min: 3, max: 25 },
    program: { type: String, required: true, trim: true },
    message: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
