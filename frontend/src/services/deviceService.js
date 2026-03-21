import api from "./api.js";

const registerDevice = async (payload) => {
  const response = await api.post("/api/devices/register", payload);
  return response.data.data;
};

const verifyDevice = async (imei) => {
  const response = await api.get(`/api/devices/${imei}`);
  return response.data.data;
};

const listDevicesByOwner = async (ownerEmail) => {
  const response = await api.get("/api/devices", {
    params: { ownerEmail }
  });
  return response.data.data;
};

const reportStolen = async (deviceId) => {
  const response = await api.put(`/api/devices/report-stolen/${deviceId}`);
  return response.data.data;
};

export { registerDevice, verifyDevice, listDevicesByOwner, reportStolen };
