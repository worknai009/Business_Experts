import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    programImages: { type: Object, default: {} },
    programBrand: { type: Object, default: {} },
    programConcept: { type: Object, default: {} },
    admissionsCta: { type: Object, default: {} },
    heroStats: { type: Array, default: [] }
  },
  { timestamps: true, minimize: false }
);

export const SiteContent =
  mongoose.models.SiteContent || mongoose.model("SiteContent", siteContentSchema);
