import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import { loginUser } from "../services/userService.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const user = await loginUser({ identifier, password });
      login(user);
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Login failed.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section fade-up narrow">
      <h2 className="section__title">Welcome back</h2>
      <p className="section__lead">Log in to manage your devices securely.</p>
      <form onSubmit={handleSubmit} className="form">
        <FormField
          label="Email, NIN, or Account ID"
          name="identifier"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="you@email.com"
          required
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
          required
        />
        <button type="submit" disabled={loading} className="button button--primary">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      {status ? <div className="alert alert--error">{status.message}</div> : null}
      <p className="section__lead">
        New here? <Link to="/account">Create an account</Link>
      </p>
    </section>
  );
};

export default Login;
