import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDeviceById, reportStolen, recoverDevice } from "../services/deviceService.js";
import FormField from "../components/FormField.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState(null);
  const [contactNumber, setContactNumber] = useState("");

  const loadDevice = async () => {
    setStatus(null);
    try {
      const data = await getDeviceById(id);
      setDevice(data);
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load device details.";
      setStatus({ type: "error", message });
    }
  };

  useEffect(() => {
    loadDevice();
  }, [id]);

  const handleReport = async () => {
    setStatus(null);
    try {
      if (!contactNumber.trim()) {
        setStatus({ type: "error", message: "Enter a contact number before reporting." });
        return;
      }
      await reportStolen(device._id, contactNumber);
      await loadDevice();
      setStatus({ type: "success", message: "Device marked as stolen." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to report device.";
      setStatus({ type: "error", message });
    }
  };

  const handleRecover = async () => {
    setStatus(null);
    try {
      await recoverDevice(device._id);
      await loadDevice();
      setStatus({ type: "success", message: "Device marked as recovered." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to recover device.";
      setStatus({ type: "error", message });
    }
  };

  if (!device && status?.type === "error") {
    return (
      <section className="section fade-up narrow">
          <button className="button button--ghost" onClick={() => navigate("/dashboard")}>
            Back to dashboard
          </button>
        <div className="panel">
          <p className="section__lead">{status.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section fade-up narrow">
      <Link className="#" to="/dashboard">
            Back
      </Link>
      <div className="panel">
        <div className="device-card__header">
          <div>
            <h2 className="section__title">{device?.name || "Device details"}</h2>
            <p className="device-card__meta">{device?.nickname || "No nickname"}</p>
            <p className="device-card__imei">IMEI: {device?.imei}</p>
          </div>
          <StatusBadge status={device?.status} />
        </div>

        {device?.status !== "stolen" ? (
          <FormField
            label="Contact number to call if stolen"
            name="contactNumber"
            value={contactNumber}
            onChange={(event) => setContactNumber(event.target.value)}
            placeholder="0803 000 0000"
            required
          />
        ) : null}

        <div className="button-row">
          {device?.status !== "stolen" ? (
            <button className="button button--primary" onClick={handleReport}>
              Report stolen
            </button>
          ) : (
            <button className="button button--primary" onClick={handleRecover}>
              Mark recovered
            </button>
          )}

          {status ? (
          <div className={`alert ${status.type === "success" ? "alert--success" : "alert--error"}`}>
            {status.message}
          </div>
        ) : null}
        </div>
        
      </div>
    </section>
  );
};

export default DeviceDetails;
