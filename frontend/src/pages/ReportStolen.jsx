import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard.jsx";
import FormField from "../components/FormField.jsx";
import { listDevicesByOwner, reportStolen, recoverDevice } from "../services/deviceService.js";
import { useAuth } from "../context/AuthContext.jsx";

const ReportStolen = () => {
  const [devices, setDevices] = useState([]);
  const [status, setStatus] = useState(null);
  const [contactNumber, setContactNumber] = useState("");
  const { user } = useAuth();

  const loadDevices = async () => {
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

  const handleReport = async (device) => {
    setStatus(null);
    try {
      if (!contactNumber.trim()) {
        setStatus({ type: "error", message: "Enter a contact number before reporting." });
        return;
      }
      await reportStolen(device._id, contactNumber);
      await loadDevices();
      setStatus({ type: "success", message: "Device marked as stolen." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to report device.";
      setStatus({ type: "error", message });
    }
  };

  const handleRecover = async (device) => {
    setStatus(null);
    try {
      await recoverDevice(device._id);
      await loadDevices();
      setStatus({ type: "success", message: "Device marked as recovered." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to recover device.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <section className="fade-up">
      <div className="panel narrow">
        <h2 className="section__title">Report stolen</h2>
        <p className="section__lead">Choose a device and mark it as stolen.</p>
        <FormField
          label="Contact number to call"
          name="contactNumber"
          value={contactNumber}
          onChange={(event) => setContactNumber(event.target.value)}
          placeholder="0803 000 0000"
          required
        />
        <button className="button button--primary" onClick={loadDevices}>
          Refresh list
        </button>
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
            actionLabel={device.status === "stolen" ? "Mark recovered" : "Mark as stolen"}
            onAction={device.status === "stolen" ? handleRecover : handleReport}
          />
        ))}
      </div>
    </section>
  );
};

export default ReportStolen;
