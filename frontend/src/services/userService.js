import api from "./api.js";

const registerUser = async (payload) => {
  const response = await api.post("/api/users/register", payload);
  return response.data.data;
};

const verifyUser = async (identifier) => {
  const response = await api.get(`/api/users/verify/${identifier}`);
  return response.data.data;
};

const loginUser = async (payload) => {
  const response = await api.post("/api/users/login", payload);
  return response.data.data;
};

export { registerUser, verifyUser, loginUser };
