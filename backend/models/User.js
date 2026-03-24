import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    accountId: { type: String, required: true, unique: true, trim: true },
    nin: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    profilePicture: { type: String, default: "default-avatar.png" },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
