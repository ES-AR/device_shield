import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import { registerUser } from "../services/userService.js";
import useForm from "../hooks/useForm.js";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterAccount = () => {
  const { values, handleChange, reset, setValues } = useForm({
    fullName: "",
    nin: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    password: ""
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const user = await registerUser(values);
      login(user);
      setStatus({ type: "success", message: `Account created for ${user.fullName}.` });
      reset();
      setPreview("");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Account creation failed.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setPreview(result);
      setStatus(null);
      setValues((prev) => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="section fade-up narrow">
      <h2 className="section__title">Create your account</h2>
      <p className="section__lead">Register your NIN to unlock secure device transfers.</p>
      <form onSubmit={handleSubmit} className="form">
        <FormField
          label="Full Name"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
        <FormField
          label="NIN"
          name="nin"
          value={values.nin}
          onChange={handleChange}
          placeholder="12345678901"
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          placeholder="you@email.com"
          required
        />
        <FormField
          label="Phone Number"
          name="phoneNumber"
          value={values.phoneNumber}
          onChange={handleChange}
          placeholder="08012345678"
          required
        />
        <label className="form-field">
          <span className="form-label">Profile Picture</span>
          <input className="form-input" type="file" accept="image/*" onChange={handleProfileUpload} />
          <span className="form-hint">Upload a clear photo for identity verification.</span>
        </label>
        {preview ? (
          <div className="card profile-preview">
            <img src={preview} alt="Profile preview" />
          </div>
        ) : null}
        <FormField
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />
        <button type="submit" disabled={loading} className="button button--primary">
          {loading ? "Saving..." : "Create Account"}
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

export default RegisterAccount;
