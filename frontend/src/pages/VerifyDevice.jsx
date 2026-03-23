import { useState } from "react";
import FormField from "../components/FormField.jsx";
import { verifyDevice } from "../services/deviceService.js";
import { statusLabels } from "../utils/constants.js";

const VerifyDevice = () => {
  const [imei, setImei] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await verifyDevice(imei);
      setResult({ type: "success", data });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to verify device.";
      setResult({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section fade-up narrow">
      <h2 className="section__title">Verify a device</h2>
      <p className="section__lead">Check if a device is safe before purchase.</p>
      <form onSubmit={handleSubmit} className="form">
        <FormField
          label="IMEI / Serial"
          name="imei"
          value={imei}
          onChange={(event) => setImei(event.target.value)}
          placeholder="356868012345678"
          required
        />
        <button type="submit" disabled={loading} className="button button--primary">
          {loading ? "Checking..." : "Check Device"}
        </button>
      </form>
      {result?.type === "success" ? (
        <div className="card">
          <p className="device-card__meta">IMEI: {result.data.imei}</p>
          <p className="device-card__title">{statusLabels[result.data.status]}</p>
          {result.data.status === "stolen" ? (
            <div>
              <p className="device-card__meta">Owner: {result.data.ownerName || "Unknown"}</p>
              <p className="device-card__meta">
                Contact number: {result.data.stolenContactNumber || "Not provided"}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
      {result?.type === "error" ? (
        <div className="alert alert--error">{result.message}</div>
      ) : null}
    </section>
  );
};

export default VerifyDevice;
