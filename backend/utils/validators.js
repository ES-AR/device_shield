import mongoose from "mongoose";

const ACCOUNT_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACCOUNT_ID_REGEX = /^[A-HJ-NP-Z2-9]{9}$/;

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

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidImei = (imei) => {
  if (!imei || typeof imei !== "string") {
    return false;
  }
  return /^[0-9A-Za-z-]{8,30}$/.test(imei.trim());
};

const isValidNin = (nin) => {
  if (!nin || typeof nin !== "string") {
    return false;
  }
  return /^\d{11}$/.test(nin.trim());
};

const isValidObjectId = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }
  return mongoose.Types.ObjectId.isValid(value.trim());
};

const isValidAccountId = (accountId) => {
  if (!accountId || typeof accountId !== "string") {
    return false;
  }
  const normalized = accountId.trim().toUpperCase();
  if (!ACCOUNT_ID_REGEX.test(normalized)) {
    return false;
  }
  const body = normalized.slice(0, -1);
  const checkChar = normalized.slice(-1);
  const expected = computeAccountIdCheckChar(body);
  return Boolean(expected && checkChar === expected);
};

export { isValidEmail, isValidImei, isValidNin, isValidObjectId, isValidAccountId };
