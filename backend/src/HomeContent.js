import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: String,
    copy: String,
    icon: String,
    image: String
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: String,
    label: String
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    stats: [statSchema],
    services: [serviceSchema]
  },
  { timestamps: true }
);

export const HomeContent = mongoose.model("HomeContent", homeContentSchema);
