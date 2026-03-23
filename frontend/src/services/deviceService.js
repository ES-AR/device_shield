import api from "./api.js";

const registerDevice = async (payload) => {
  const response = await api.post("/api/devices/register", payload);
  return response.data.data;
};

const verifyDevice = async (imei) => {
  const response = await api.get(`/api/devices/${imei}`);
  return response.data.data;
};

const getDeviceById = async (deviceId) => {
  const response = await api.get(`/api/devices/id/${deviceId}`);
  return response.data.data;
};

const listDevicesByOwner = async (ownerIdentifier) => {
  const response = await api.get("/api/devices", {
    params: { ownerIdentifier }
  });
  return response.data.data;
};

const reportStolen = async (deviceId, contactNumber) => {
  const response = await api.put(`/api/devices/report-stolen/${deviceId}`, {
    contactNumber
  });
  return response.data.data;
};

const recoverDevice = async (deviceId) => {
  const response = await api.put(`/api/devices/recover/${deviceId}`);
  return response.data.data;
};

export {
  registerDevice,
  verifyDevice,
  getDeviceById,
  listDevicesByOwner,
  reportStolen,
  recoverDevice
};
