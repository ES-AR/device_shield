const formatStatus = (status) => {
  const map = {
    active: "Safe",
    stolen: "Stolen",
    pending: "Pending Transfer"
  };
  return map[status] || status;
};

export { formatStatus };
