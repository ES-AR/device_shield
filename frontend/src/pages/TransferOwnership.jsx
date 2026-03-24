import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import DeviceCard from "../components/DeviceCard.jsx";
import RecipientCard from "../components/RecipientCard.jsx";
import { listDevicesByOwner } from "../services/deviceService.js";
import { verifyUser } from "../services/userService.js";
import {
  initiateTransfer,
  listTransfersByBuyer,
  acceptTransfer,
  rejectTransfer
} from "../services/transferService.js";

const TransferOwnership = () => {
  const [buyerIdentifier, setBuyerIdentifier] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [status, setStatus] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [lookupStatus, setLookupStatus] = useState(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState("password");
  const [sellerPassword, setSellerPassword] = useState("");
  const [biometricVerified, setBiometricVerified] = useState(false);
  const { user } = useAuth();

  const loadSellerDevices = async () => {
    if (!user?.id) {
      setDevices([]);
      return;
    }
    const data = await listDevicesByOwner(user.id);
    setDevices(data);
  };

  const loadBuyerTransfers = async () => {
    if (!user?.id) {
      setPendingTransfers([]);
      return;
    }
    const data = await listTransfersByBuyer(user.id);
    setPendingTransfers(data);
  };

  useEffect(() => {
    loadSellerDevices();
  }, [user?.id]);

  useEffect(() => {
    loadBuyerTransfers();
  }, [user?.id]);

  useEffect(() => {
    setRecipient(null);
    setLookupStatus(null);
  }, [buyerIdentifier]);

  const handleLookup = async () => {
    if (!buyerIdentifier.trim()) {
      setRecipient(null);
      setLookupStatus(null);
      return;
    }

    setLookupStatus({ type: "loading", message: "Looking up recipient..." });
    try {
      const data = await verifyUser(buyerIdentifier);
      setRecipient(data);
      setLookupStatus({ type: "success", message: "Recipient verified." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to verify recipient.";
      setRecipient(null);
      setLookupStatus({ type: "error", message });
    }
  };

  const handleInitiate = async (event) => {
    event.preventDefault();
    setStatus(null);
    setChallengeOpen(true);
  };

  const handleChallengeSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    try {
      await initiateTransfer({
        deviceId: selectedDeviceId,
        sellerIdentifier: user?.id,
        buyerIdentifier,
        sellerPassword: authMethod === "password" ? sellerPassword : undefined,
        authMethod,
        biometricVerified
      });
      await loadSellerDevices();
      setChallengeOpen(false);
      setSellerPassword("");
      setBiometricVerified(false);
      setStatus({ type: "success", message: "Transfer request sent." });
    } catch (error) {
      const message = error.response?.data?.message || "Unable to initiate transfer.";
      setStatus({ type: "error", message });
    }
  };

  const handleBiometric = async () => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error("Biometric authentication not supported in this browser.");
      }
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required"
        }
      });
      setBiometricVerified(true);
    } catch (error) {
      setBiometricVerified(false);
      setStatus({ type: "error", message: error.message || "Biometric check failed." });
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
    <section className="fade-up split-grid">
      <div className="panel">
        <h2 className="section__title">Seller: initiate transfer</h2>
        <form onSubmit={handleInitiate} className="form">
          <div className="card">
            <p className="section__lead">Transferring as: {user?.fullName}</p>
          </div>
          <FormField
            label="Buyer NIN or Account ID"
            name="buyerIdentifier"
            value={buyerIdentifier}
            onChange={(event) => setBuyerIdentifier(event.target.value)}
            onBlur={handleLookup}
            placeholder="12345678901"
            hint="Account ID is 9 characters."
            required
          />
          <RecipientCard recipient={recipient} />
          {lookupStatus ? (
            <div
              className={`alert ${
                lookupStatus.type === "success"
                  ? "alert--success"
                  : lookupStatus.type === "loading"
                    ? "alert--info"
                    : "alert--error"
              }`}
            >
              {lookupStatus.message}
            </div>
          ) : null}
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
          <button
            className="button button--primary"
            disabled={!recipient || !selectedDeviceId || !user?.id}
          >
            Transfer Ownership
          </button>
        </form>
      </div>
      <div>
        <h2 className="section__title">Buyer: respond to requests</h2>
        <p className="section__lead">Pending transfers for your account.</p>
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
      {challengeOpen ? (
        <div className="modal">
          <div className="modal__backdrop" onClick={() => setChallengeOpen(false)} />
          <div className="modal__content">
            <h3 className="section__title">Security Challenge</h3>
            <p className="section__lead">
              Confirm your identity before sending the transfer request.
            </p>
            <form onSubmit={handleChallengeSubmit} className="form">
              <label className="form-field">
                <span className="form-label">Authentication Method</span>
                <select
                  className="form-select"
                  value={authMethod}
                  onChange={(event) => setAuthMethod(event.target.value)}
                >
                  <option value="password">Password</option>
                  <option value="biometric">Biometric (WebAuthn)</option>
                </select>
              </label>
              {authMethod === "password" ? (
                <FormField
                  label="Password"
                  name="sellerPassword"
                  type="password"
                  value={sellerPassword}
                  onChange={(event) => setSellerPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              ) : (
                <div className="card">
                  <p className="section__lead">Trigger your device biometric prompt.</p>
                  <button
                    type="button"
                    className="button button--outline"
                    onClick={handleBiometric}
                  >
                    Verify with biometrics
                  </button>
                  {biometricVerified ? (
                    <div className="alert alert--success">Biometric verified.</div>
                  ) : null}
                </div>
              )}
              <div className="button-row">
                <button type="submit" className="button button--primary">
                  Confirm transfer
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setChallengeOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default TransferOwnership;
