import { useState } from "react";
import FormField from "../components/FormField.jsx";
import DeviceCard from "../components/DeviceCard.jsx";
import { listDevicesByOwner, reportStolen } from "../services/deviceService.js";

const ReportStolen = () => {
  const [ownerEmail, setOwnerEmail] = useState("");
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState(null);

  const loadDevices = async () => {
    const data = await listDevicesByOwner(ownerEmail);
    setDevices(data);
  };

  const handleFetch = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      await loadDevices();
      setStatus({ type: "success", message: "Select a device to mark as stolen." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load devices.";
      setStatus({ type: "error", message });
    }
  };

  const handleReport = async (device) => {
    setStatus(null);
    try {
      await reportStolen(device._id);
      await loadDevices();
      setStatus({ type: "success", message: "Device marked as stolen." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to report device.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <section className="section fade-up">
      <div className="panel narrow">
        <h2 className="section__title">Report stolen</h2>
        <p className="section__lead">Choose a device and mark it as stolen.</p>
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
          <DeviceCard
            key={device._id}
            device={device}
            actionLabel="Mark as stolen"
            onAction={handleReport}
          />
        ))}
      </div>
    </section>
  );
};

export default ReportStolen;
