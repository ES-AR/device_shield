import { useState } from "react";
import FormField from "../components/FormField.jsx";
import { registerDevice } from "../services/deviceService.js";
import useForm from "../hooks/useForm.js";

const RegisterDevice = () => {
  const { values, handleChange, reset } = useForm({
    name: "",
    nickname: "",
    imei: "",
    ownerEmail: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const device = await registerDevice(values);
      setStatus({ type: "success", message: `Registered ${device.name}.` });
      reset();
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section fade-up narrow">
      <h2 className="section__title">Register a device</h2>
      <p className="section__lead">Save your device and keep proof of ownership.</p>
      <form onSubmit={handleSubmit} className="form">
        <FormField
          label="Device Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="iPhone 11"
          required
        />
        <FormField
          label="Nickname"
          name="nickname"
          value={values.nickname}
          onChange={handleChange}
          placeholder="My Phone"
        />
        <FormField
          label="IMEI / Serial"
          name="imei"
          value={values.imei}
          onChange={handleChange}
          placeholder="356868012345678"
          required
        />
        <FormField
          label="Owner Email"
          name="ownerEmail"
          type="email"
          value={values.ownerEmail}
          onChange={handleChange}
          placeholder="owner@email.com"
          required
        />
        <button type="submit" disabled={loading} className="button button--primary">
          {loading ? "Saving..." : "Register Device"}
        </button>
      </form>
      {status ? (
        <div className={`alert ${status.type === "success" ? "alert--success" : "alert--error"}`}>
          {status.message}
        </div>
      ) : null}
    </section>
  );
};

export default RegisterDevice;
