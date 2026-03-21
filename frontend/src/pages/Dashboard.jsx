import { useState } from "react";
import FormField from "../components/FormField.jsx";
import DeviceCard from "../components/DeviceCard.jsx";
import { listDevicesByOwner } from "../services/deviceService.js";

const Dashboard = () => {
  const [ownerEmail, setOwnerEmail] = useState("");
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState(null);

  const handleFetch = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      const data = await listDevicesByOwner(ownerEmail);
      setDevices(data);
      setStatus({ type: "success", message: `Found ${data.length} devices.` });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load devices.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <section className="section fade-up">
      <div className="panel narrow">
        <h2 className="section__title">Your dashboard</h2>
        <p className="section__lead">Enter your email to view your devices.</p>
        <form onSubmit={handleFetch} className="form">
          <FormField
            label="Owner Email"
            name="ownerEmail"
            type="email"
            value={ownerEmail}
            onChange={(event) => setOwnerEmail(event.target.value)}
            placeholder="owner@email.com"
            required
          />
          <button className="button button--primary">Load Devices</button>
        </form>
        {status ? (
          <div className={`alert ${status.type === "success" ? "alert--success" : "alert--error"}`}>
            {status.message}
          </div>
        ) : null}
      </div>

      <div className="feature-grid">
        {devices.map((device) => (
          <DeviceCard key={device._id} device={device} />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
