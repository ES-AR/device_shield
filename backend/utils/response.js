const sendSuccess = (res, statusCode, data) => {
  res.status(statusCode).json({ success: true, data });
};

const sendError = (res, statusCode, message, details) => {
  res.status(statusCode).json({ success: false, message, details });
};

export { sendSuccess, sendError };
