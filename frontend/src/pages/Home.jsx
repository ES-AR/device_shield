import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero fade-up">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">Nigeria Ready & Secure</p>
          <h2 className="hero__title">Protect your devices. Prove ownership fast.</h2>
          <p className="hero__lead">
            DeviceShield lets you register devices, verify IMEIs, report theft, and
            transfer ownership without friction.
          </p>
          <div className="hero__actions">
            <Link
              to="/verify"
              className="button button--primary"
            >
              Check Device
            </Link>
            <Link
              to="/register"
              className="button button--ghost"
            >
              Register Device
            </Link>
          </div>
        </div>
        <div className="feature-grid">
          {[
            {
              title: "Instant Verification",
              body: "Check if a device is safe, stolen, or pending transfer."
            },
            {
              title: "Trusted Transfers",
              body: "Move ownership between verified NIN accounts securely."
            },
            {
              title: "Theft Reporting",
              body: "Mark stolen devices in one click."
            },
            {
              title: "Ownership Dashboard",
              body: "View your devices and their status at a glance."
            }
          ].map((item) => (
            <article key={item.title} className="card feature-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
