import Device from "../models/Device.js";
import { isValidImei, isValidObjectId } from "../utils/validators.js";
import { findUserByIdentifier } from "./userService.js";

const registerDevice = async (payload) => {
  const { name, nickname, imei, ownerIdentifier } = payload;

  if (!name || !imei || !ownerIdentifier) {
    const error = new Error("name, imei, and ownerIdentifier are required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidImei(imei)) {
    const error = new Error("Invalid imei");
    error.statusCode = 400;
    throw error;
  }

  const owner = await findUserByIdentifier(ownerIdentifier);
  if (!owner) {
    const error = new Error("Owner account not found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await Device.findOne({ imei: imei.trim() });
  if (existing) {
    const error = new Error("Device with this IMEI already exists");
    error.statusCode = 409;
    throw error;
  }

  const device = await Device.create({
    name: name.trim(),
    nickname: nickname?.trim() || "",
    imei: imei.trim(),
    ownerId: owner._id,
    status: "active"
  });

  return device;
};

const getDeviceByImei = async (imei) => {
  if (!isValidImei(imei)) {
    const error = new Error("Invalid imei");
    error.statusCode = 400;
    throw error;
  }

  const device = await Device.findOne({ imei: imei.trim() }).populate("ownerId", "fullName");
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return device;
};

const getDeviceById = async (deviceId) => {
  if (!isValidObjectId(deviceId)) {
    const error = new Error("Invalid device id");
    error.statusCode = 400;
    throw error;
  }

  const device = await Device.findById(deviceId);
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return device;
};

const listDevicesByOwner = async (ownerIdentifier) => {
  const owner = await findUserByIdentifier(ownerIdentifier);
  if (!owner) {
    const error = new Error("Owner account not found");
    error.statusCode = 404;
    throw error;
  }

  return Device.find({ ownerId: owner._id }).sort({ createdAt: -1 });
};

const reportStolen = async (deviceId, contactNumber) => {
  const device = await Device.findById(deviceId);
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  if (!contactNumber || !contactNumber.trim()) {
    const error = new Error("Contact number is required");
    error.statusCode = 400;
    throw error;
  }

  device.status = "stolen";
  device.stolenContactNumber = contactNumber.trim();
  await device.save();

  return device;
};

const recoverDevice = async (deviceId) => {
  const device = await Device.findById(deviceId);
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  device.status = "active";
  device.stolenContactNumber = "";
  await device.save();

  return device;
};

export {
  registerDevice,
  getDeviceByImei,
  getDeviceById,
  listDevicesByOwner,
  reportStolen,
  recoverDevice
};
