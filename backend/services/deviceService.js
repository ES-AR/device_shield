import Device from "../models/Device.js";
import { isValidEmail, isValidImei } from "../utils/validators.js";

const registerDevice = async (payload) => {
  const { name, nickname, imei, ownerEmail } = payload;

  if (!name || !imei || !ownerEmail) {
    const error = new Error("name, imei, and ownerEmail are required");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidEmail(ownerEmail)) {
    const error = new Error("Invalid ownerEmail");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidImei(imei)) {
    const error = new Error("Invalid imei");
    error.statusCode = 400;
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
    ownerEmail: ownerEmail.trim().toLowerCase(),
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

  const device = await Device.findOne({ imei: imei.trim() });
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  return device;
};

const listDevicesByOwner = async (ownerEmail) => {
  if (!isValidEmail(ownerEmail)) {
    const error = new Error("Invalid ownerEmail");
    error.statusCode = 400;
    throw error;
  }

  return Device.find({ ownerEmail: ownerEmail.trim().toLowerCase() }).sort({ createdAt: -1 });
};

const reportStolen = async (deviceId) => {
  const device = await Device.findById(deviceId);
  if (!device) {
    const error = new Error("Device not found");
    error.statusCode = 404;
    throw error;
  }

  device.status = "stolen";
  await device.save();

  return device;
};

export { registerDevice, getDeviceByImei, listDevicesByOwner, reportStolen };
