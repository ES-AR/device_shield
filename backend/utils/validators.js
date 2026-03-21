const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidImei = (imei) => {
  if (!imei || typeof imei !== "string") {
    return false;
  }
  return /^[0-9A-Za-z-]{8,30}$/.test(imei.trim());
};

export { isValidEmail, isValidImei };
