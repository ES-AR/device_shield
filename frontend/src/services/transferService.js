import api from "./api.js";

const initiateTransfer = async (payload) => {
  const response = await api.post("/api/transfers/initiate", payload);
  return response.data.data;
};

const listTransfersByBuyer = async (buyerEmail) => {
  const response = await api.get("/api/transfers", {
    params: { buyerEmail }
  });
  return response.data.data;
};

const acceptTransfer = async (transferId) => {
  const response = await api.put(`/api/transfers/accept/${transferId}`);
  return response.data.data;
};

const rejectTransfer = async (transferId) => {
  const response = await api.put(`/api/transfers/reject/${transferId}`);
  return response.data.data;
};

export { initiateTransfer, listTransfersByBuyer, acceptTransfer, rejectTransfer };
