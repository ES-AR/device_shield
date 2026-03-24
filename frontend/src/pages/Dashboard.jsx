import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeviceCard from "../components/DeviceCard.jsx";
import { listDevicesByOwner } from "../services/deviceService.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  const loadDevices = async () => {
    setStatus(null);
    try {
      const data = await listDevicesByOwner(user?.id);
      setDevices(data);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load devices.";
      setStatus({ type: "error", message });
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDevices();
    }
  }, [user?.id]);

  return (
    <section className="fade-up">
      <div className="panel narrow">
        <h2 className="section__title">Your dashboard</h2>
        <p className="section__lead">Welcome back, {user?.fullName}.</p>
        <div className="panel__meta">
          <p className="device-card__meta">Account ID: {user?.accountId || "-"}</p>
          <p className="device-card__meta">NIN: {user?.nin || "-"}</p>
        </div>
        <div className="button-row">
          <Link className="button button--primary" to="/register">
            Add device
          </Link>
          <button className="button button--outline" onClick={loadDevices}>
            Refresh list
          </button>
        </div>
        {status ? (
          <div className={`alert ${status.type === "success" ? "alert--success" : "alert--error"}`}>
            {status.message}
          </div>
        ) : null}
      </div>

      <div className="feature-grid">
        {devices.map((device) => (
          <DeviceCard key={device._id} device={device} showDetails />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
