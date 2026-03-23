import {
  registerDevice,
  getDeviceByImei,
  getDeviceById,
  listDevicesByOwner,
  reportStolen,
  recoverDevice
} from "../services/deviceService.js";
import { sendSuccess } from "../utils/response.js";

const registerDeviceHandler = async (req, res, next) => {
  try {
    const device = await registerDevice(req.body);
    sendSuccess(res, 201, device);
  } catch (error) {
    next(error);
  }
};

const verifyDeviceHandler = async (req, res, next) => {
  try {
    const device = await getDeviceByImei(req.params.imei);
    const statusMap = {
      active: "Safe",
      stolen: "Stolen",
      pending: "Pending Transfer"
    };
    sendSuccess(res, 200, {
      imei: device.imei,
      status: device.status,
      label: statusMap[device.status],
      ownerName: device.ownerId?.fullName || "",
      stolenContactNumber: device.status === "stolen" ? device.stolenContactNumber || "" : ""
    });
  } catch (error) {
    next(error);
  }
};

const getDeviceByIdHandler = async (req, res, next) => {
  try {
    const device = await getDeviceById(req.params.id);
    sendSuccess(res, 200, device);
  } catch (error) {
    next(error);
  }
};

const listDevicesHandler = async (req, res, next) => {
  try {
    const { ownerIdentifier } = req.query;
    if (!ownerIdentifier) {
      return sendSuccess(res, 200, []);
    }
    const devices = await listDevicesByOwner(ownerIdentifier);
    sendSuccess(res, 200, devices);
  } catch (error) {
    next(error);
  }
};

const reportStolenHandler = async (req, res, next) => {
  try {
    const device = await reportStolen(req.params.id, req.body?.contactNumber);
    sendSuccess(res, 200, device);
  } catch (error) {
    next(error);
  }
};

const recoverDeviceHandler = async (req, res, next) => {
  try {
    const device = await recoverDevice(req.params.id);
    sendSuccess(res, 200, device);
  } catch (error) {
    next(error);
  }
};

export {
  registerDeviceHandler,
  verifyDeviceHandler,
  getDeviceByIdHandler,
  listDevicesHandler,
  reportStolenHandler,
  recoverDeviceHandler
};
