import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ChaggaLogo from "../common/ChaggaLogo";

const PasswordReset = () => {
  const { updatePassword, cancelRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <main className="reset-page">
      <section className="reset-card">
        <div className="brand-lockup reset-brand" aria-label="Chagga"><ChaggaLogo /></div>
        <span className="eyebrow">Account recovery</span>
        <h1>Choose a new password</h1>
        <p>Your new password must contain at least 8 characters.</p>

        {error && <div role="alert" className="notice notice-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field-label">
            New password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          <label className="field-label">
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              required
              minLength={8}
            />
          </label>
          <button type="submit" disabled={loading} className="primary-action">
            {loading ? "Updating…" : "Update password"}
          </button>
          <button type="button" onClick={cancelRecovery} className="text-button">
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
};

export default PasswordReset;
