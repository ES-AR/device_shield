import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import connectDb from "../config/db.js";
import User from "../models/User.js";

const ACCOUNT_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACCOUNT_ID_BODY_LENGTH = 8;

const computeAccountIdCheckChar = (value) => {
  let sum = 0;
  for (let index = 0; index < value.length; index += 1) {
    const charIndex = ACCOUNT_ID_ALPHABET.indexOf(value[index]);
    if (charIndex < 0) {
      return null;
    }
    sum = (sum + charIndex * (index + 1)) % ACCOUNT_ID_ALPHABET.length;
  }
  return ACCOUNT_ID_ALPHABET[sum];
};

const createAccountId = () => {
  let body = "";
  for (let index = 0; index < ACCOUNT_ID_BODY_LENGTH; index += 1) {
    const nextIndex = crypto.randomInt(0, ACCOUNT_ID_ALPHABET.length);
    body += ACCOUNT_ID_ALPHABET[nextIndex];
  }
  const checkChar = computeAccountIdCheckChar(body);
  return `${body}${checkChar}`;
};

const generateUniqueAccountId = async () => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const accountId = createAccountId();
    const existing = await User.findOne({ accountId });
    if (!existing) {
      return accountId;
    }
  }

  throw new Error("Unable to generate account id");
};

const run = async () => {
  await connectDb();

  const users = await User.find({
    $or: [{ accountId: { $exists: false } }, { accountId: null }, { accountId: "" }]
  }).select("_id");

  let updated = 0;
  for (const user of users) {
    const accountId = await generateUniqueAccountId();
    await User.updateOne({ _id: user._id }, { $set: { accountId } }, { runValidators: false });
    updated += 1;
  }

  console.log(`Backfill complete. Updated ${updated} users.`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Backfill failed:", error.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
