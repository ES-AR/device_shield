const statusLabel = {
  active: "Active",
  stolen: "Stolen",
  pending: "Pending"
};

const StatusBadge = ({ status }) => {
  return (
    <div>
    <span className={`status-badge status-badge--${status || "active"}`}>
      {statusLabel[status] || status}
    </span>
    </div>
  );
};

export default StatusBadge;
