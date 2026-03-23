import mongoose from "mongoose";

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

export { isValidEmail, isValidImei, isValidNin, isValidObjectId };
