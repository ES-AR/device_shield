import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const DeviceCard = ({ device, actionLabel, onAction, showDetails }) => {
  return (
    <div className="card device-card">
      <div className="device-card__header">
        <div>
          <h3 className="device-card__title">{device.name}</h3>
          <p className="device-card__meta">{device.nickname || "No nickname"}</p>
          <p className="device-card__imei">IMEI: {device.imei}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>
      {showDetails ? (
        <Link to={`/devices/${device._id}`} className="button button--outline button--block">
          View details
        </Link>
      ) : null}
      {actionLabel ? (
        <button
          onClick={() => onAction?.(device)}
          className="button button--primary button--block"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default DeviceCard;
