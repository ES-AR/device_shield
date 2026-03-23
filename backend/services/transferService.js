import Device from "../models/Device.js";
import Transfer from "../models/Transfer.js";
import { isValidObjectId } from "../utils/validators.js";
import { findUserByIdentifier, verifyUserPassword } from "./userService.js";

const initiateTransfer = async (payload) => {
  const {
    deviceId,
    sellerIdentifier,
    buyerIdentifier,
    sellerPassword,
    authMethod,
    biometricVerified
  } = payload;

  if (!deviceId || !sellerIdentifier || !buyerIdentifier) {
    const error = new Error("deviceId, sellerIdentifier, and buyerIdentifier are required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidObjectId(deviceId)) {
    const error = new Error("Invalid deviceId");
    error.statusCode = 400;
    throw error;
  }

  const seller = await findUserByIdentifier(sellerIdentifier);
  if (!seller) {
    const error = new Error("Seller account not found");
    error.statusCode = 404;
    throw error;
  }

  const buyer = await findUserByIdentifier(buyerIdentifier);
  if (!buyer) {
    const error = new Error("Buyer account not found");
    error.statusCode = 404;
    throw error;
  }

  const device = await Device.findById(deviceId);
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  if (device.status === "stolen") {
    const error = new Error("Stolen devices cannot be transferred");
    error.statusCode = 400;
    throw error;
  }

  if (device.ownerId.toString() !== seller._id.toString()) {
    const error = new Error("Seller does not match device owner");
    error.statusCode = 403;
    throw error;
  }

  if (authMethod === "biometric") {
    if (!biometricVerified) {
      const error = new Error("Biometric verification required");
      error.statusCode = 401;
      throw error;
    }
  } else {
    await verifyUserPassword(seller, sellerPassword);
  }

  const existingPending = await Transfer.findOne({ deviceId, status: "pending" });
  if (existingPending) {
    const error = new Error("A pending transfer already exists for this device");
    error.statusCode = 409;
    throw error;
  }

  const transfer = await Transfer.create({
    deviceId,
    sellerId: seller._id,
    buyerId: buyer._id,
    status: "pending"
  });

  device.status = "pending";
  await device.save();

  return transfer;
};

const listPendingTransfersForBuyer = async (buyerIdentifier) => {
  const buyer = await findUserByIdentifier(buyerIdentifier);
  if (!buyer) {
    const error = new Error("Buyer account not found");
    error.statusCode = 404;
    throw error;
  }

  return Transfer.find({ buyerId: buyer._id, status: "pending" })
    .populate("deviceId")
    .sort({ createdAt: -1 });
};

const acceptTransfer = async (transferId) => {
  const transfer = await Transfer.findById(transferId);
  if (!transfer) {
    const error = new Error("Transfer not found");
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== "pending") {
    const error = new Error("Transfer has already been processed");
    error.statusCode = 400;
    throw error;
  }

  transfer.status = "accepted";
  await transfer.save();

  const device = await Device.findById(transfer.deviceId);
  if (device) {
    device.ownerId = transfer.buyerId;
    device.status = "active";
    await device.save();
  }

  return transfer;
};

const rejectTransfer = async (transferId) => {
  const transfer = await Transfer.findById(transferId);
  if (!transfer) {
    const error = new Error("Transfer not found");
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== "pending") {
    const error = new Error("Transfer has already been processed");
    error.statusCode = 400;
    throw error;
  }

  transfer.status = "rejected";
  await transfer.save();

  const device = await Device.findById(transfer.deviceId);
  if (device && device.status === "pending") {
    device.status = "active";
    await device.save();
  }

  return transfer;
};

export {
  initiateTransfer,
  listPendingTransfersForBuyer,
  acceptTransfer,
  rejectTransfer
};
