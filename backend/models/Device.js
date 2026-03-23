import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    imei: { type: String, required: true, unique: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "stolen", "pending"],
      default: "active"
    },
    stolenContactNumber: { type: String, trim: true }
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
