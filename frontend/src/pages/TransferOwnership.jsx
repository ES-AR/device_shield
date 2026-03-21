import { useEffect, useState } from "react";
import FormField from "../components/FormField.jsx";
import DeviceCard from "../components/DeviceCard.jsx";
import { listDevicesByOwner } from "../services/deviceService.js";
import {
  initiateTransfer,
  listTransfersByBuyer,
  acceptTransfer,
  rejectTransfer
} from "../services/transferService.js";

const TransferOwnership = () => {
  const [sellerEmail, setSellerEmail] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [status, setStatus] = useState(null);

  const loadSellerDevices = async () => {
    if (!sellerEmail) {
      setDevices([]);
      return;
    }
    const data = await listDevicesByOwner(sellerEmail);
    setDevices(data);
  };

  const loadBuyerTransfers = async () => {
    if (!buyerEmail) {
      setPendingTransfers([]);
      return;
    }
    const data = await listTransfersByBuyer(buyerEmail);
    setPendingTransfers(data);
  };

  useEffect(() => {
    loadSellerDevices();
  }, [sellerEmail]);

  useEffect(() => {
    loadBuyerTransfers();
  }, [buyerEmail]);

  const handleInitiate = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      await initiateTransfer({
        deviceId: selectedDeviceId,
        sellerEmail,
        buyerEmail
      });
      await loadSellerDevices();
      setStatus({ type: "success", message: "Transfer request sent." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to initiate transfer.";
      setStatus({ type: "error", message });
    }
  };

  const handleAccept = async (transferId) => {
    setStatus(null);
    try {
      await acceptTransfer(transferId);
      await loadBuyerTransfers();
      setStatus({ type: "success", message: "Transfer accepted." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to accept transfer.";
      setStatus({ type: "error", message });
    }
  };

  const handleReject = async (transferId) => {
    setStatus(null);
    try {
      await rejectTransfer(transferId);
      await loadBuyerTransfers();
      setStatus({ type: "success", message: "Transfer rejected." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to reject transfer.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <section className="section fade-up split-grid">
      <div className="panel">
        <h2 className="section__title">Seller: initiate transfer</h2>
        <form onSubmit={handleInitiate} className="form">
          <FormField
            label="Seller Email"
            name="sellerEmail"
            type="email"
            value={sellerEmail}
            onChange={(event) => setSellerEmail(event.target.value)}
            placeholder="seller@email.com"
            required
          />
          <FormField
            label="Buyer Email"
            name="buyerEmail"
            type="email"
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            placeholder="buyer@email.com"
            required
          />
          <label className="form-field">
            <span className="form-label">Select Device</span>
            <select
              className="form-select"
              value={selectedDeviceId}
              onChange={(event) => setSelectedDeviceId(event.target.value)}
              required
            >
              <option value="">Choose device</option>
              {devices.map((device) => (
                <option key={device._id} value={device._id}>
                  {device.name} ({device.imei})
                </option>
              ))}
            </select>
          </label>
          <button className="button button--primary">Transfer Ownership</button>
        </form>
      </div>
      <div>
        <h2 className="section__title">Buyer: respond to requests</h2>
        <p className="section__lead">Enter your email to see pending transfers.</p>
        <div>
          <FormField
            label="Buyer Email"
            name="buyerEmail"
            type="email"
            value={buyerEmail}
            onChange={(event) => setBuyerEmail(event.target.value)}
            placeholder="buyer@email.com"
            required
          />
        </div>
        <div className="feature-grid">
          {pendingTransfers.map((transfer) => (
            <div key={transfer._id} className="card">
              <DeviceCard device={transfer.deviceId} />
              <div className="button-row">
                <button
                  onClick={() => handleAccept(transfer._id)}
                  className="button button--primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(transfer._id)}
                  className="button button--outline"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {status ? (
        <div className={`alert ${status.type === "success" ? "alert--success" : "alert--error"}`}>
          {status.message}
        </div>
      ) : null}
    </section>
  );
};

export default TransferOwnership;
