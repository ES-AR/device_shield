const statusLabel = {
  active: "Active",
  stolen: "Stolen",
  pending: "Pending"
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`status-badge status-badge--${status || "active"}`}>
      {statusLabel[status] || status}
    </span>
  );
};

export default StatusBadge;
