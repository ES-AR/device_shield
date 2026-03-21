import Device from "../models/Device.js";
import Transfer from "../models/Transfer.js";
import { isValidEmail } from "../utils/validators.js";

const initiateTransfer = async (payload) => {
  const { deviceId, sellerEmail, buyerEmail } = payload;

  if (!deviceId || !sellerEmail || !buyerEmail) {
    const error = new Error("deviceId, sellerEmail, and buyerEmail are required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidEmail(sellerEmail) || !isValidEmail(buyerEmail)) {
    const error = new Error("Invalid sellerEmail or buyerEmail");
    error.statusCode = 400;
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

  if (device.ownerEmail !== sellerEmail.trim().toLowerCase()) {
    const error = new Error("Seller email does not match device owner");
    error.statusCode = 403;
    throw error;
  }

  const existingPending = await Transfer.findOne({ deviceId, status: "pending" });
  if (existingPending) {
    const error = new Error("A pending transfer already exists for this device");
    error.statusCode = 409;
    throw error;
  }

  const transfer = await Transfer.create({
    deviceId,
    sellerEmail: sellerEmail.trim().toLowerCase(),
    buyerEmail: buyerEmail.trim().toLowerCase(),
    status: "pending"
  });

  device.status = "pending";
  await device.save();

  return transfer;
};

const listPendingTransfersForBuyer = async (buyerEmail) => {
  if (!isValidEmail(buyerEmail)) {
    const error = new Error("Invalid buyerEmail");
    error.statusCode = 400;
    throw error;
  }

  return Transfer.find({ buyerEmail: buyerEmail.trim().toLowerCase(), status: "pending" })
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
    device.ownerEmail = transfer.buyerEmail;
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
