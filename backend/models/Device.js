import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    imei: { type: String, required: true, unique: true, trim: true },
    ownerEmail: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["active", "stolen", "pending"],
      default: "active"
    }
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
