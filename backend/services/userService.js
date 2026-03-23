import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { isValidEmail, isValidNin, isValidObjectId } from "../utils/validators.js";

const normalizeIdentifier = (identifier) => identifier?.trim();

const findUserByIdentifier = async (identifier) => {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) {
    const error = new Error("User identifier is required");
    error.statusCode = 400;
    throw error;
  }

  if (isValidNin(normalized)) {
    return User.findOne({ nin: normalized });
  }

  if (isValidObjectId(normalized)) {
    return User.findById(normalized);
  }

  const error = new Error("Invalid user identifier");
  error.statusCode = 400;
  throw error;
};

const findUserForLogin = async (identifier) => {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) {
    const error = new Error("Login identifier is required");
    error.statusCode = 400;
    throw error;
  }

  if (isValidEmail(normalized)) {
    return User.findOne({ email: normalized.toLowerCase() });
  }

  if (isValidNin(normalized)) {
    return User.findOne({ nin: normalized });
  }

  if (isValidObjectId(normalized)) {
    return User.findById(normalized);
  }

  const error = new Error("Invalid login identifier");
  error.statusCode = 400;
  throw error;
};

const registerUser = async (payload) => {
  const { fullName, nin, email, phoneNumber, profilePicture, password } = payload;

  if (!fullName || !nin || !email || !phoneNumber || !password) {
    const error = new Error("fullName, nin, email, phoneNumber, and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidNin(nin)) {
    const error = new Error("Invalid nin");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidEmail(email)) {
    const error = new Error("Invalid email");
    error.statusCode = 400;
    throw error;
  }

  if (password.trim().length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.statusCode = 400;
    throw error;
  }

  const existingNin = await User.findOne({ nin: nin.trim() });
  if (existingNin) {
    const error = new Error("NIN is already registered");
    error.statusCode = 409;
    throw error;
  }

  const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingEmail) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);

  const user = await User.create({
    fullName: fullName.trim(),
    nin: nin.trim(),
    email: email.trim().toLowerCase(),
    phoneNumber: phoneNumber.trim(),
    profilePicture: profilePicture?.trim() || "default-avatar.png",
    password: hashedPassword
  });

  return user;
};

const verifyUserPreview = async (identifier) => {
  const user = await findUserByIdentifier(identifier);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    fullName: user.fullName,
    profilePicture: user.profilePicture
  };
};

const verifyUserPassword = async (user, password) => {
  if (!password) {
    const error = new Error("Password is required");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) {
    const error = new Error("Security challenge failed");
    error.statusCode = 401;
    throw error;
  }
};

const loginUser = async (payload) => {
  const { identifier, password } = payload;
  const user = await findUserForLogin(identifier);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await verifyUserPassword(user, password);

  return {
    id: user._id,
    fullName: user.fullName,
    nin: user.nin,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture
  };
};

export {
  registerUser,
  verifyUserPreview,
  findUserByIdentifier,
  verifyUserPassword,
  loginUser
};
