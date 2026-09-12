import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS, SIZE_LABELS, ALL_CITIES } from "../../utils/constants";

const CreateRequest = ({ onClose, onCreate }) => {
  const { currentUser, getTheme } = useAuth();
  const { createRequest } = useStorage();
  const theme = getTheme();

  const [formData, setFormData] = useState({
    itemType: "",
    from: "",
    to: "",
    neededBy: "",
    size: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const request = createRequest({
      ...formData,
      senderId: currentUser.id,
      senderName: currentUser.name,
    });

    onCreate?.(request);
    onClose?.();
  };

  const isValid =
    formData.itemType &&
    formData.from &&
    formData.to &&
    formData.from !== formData.to &&
    formData.neededBy &&
    formData.size;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Post a Delivery Request</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>What needs to be delivered? *</label>
            <select
              style={styles.select}
              value={formData.itemType}
              onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
              required
            >
              <option value="">Select item type</option>
              {Object.keys(ITEM_TYPE_LABELS).map((key) => (
                <option key={key} value={key}>
                  {ITEM_TYPE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>From *</label>
              <select
                style={styles.select}
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                required
              >
                <option value="">Select city</option>
                {ALL_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>To *</label>
              <select
                style={styles.select}
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                required
              >
                <option value="">Select city</option>
                {ALL_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Needed By *</label>
              <input
                type="date"
                style={styles.input}
                value={formData.neededBy}
                onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Size *</label>
              <select
                style={styles.select}
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              >
                <option value="">Select size</option>
                {Object.keys(SIZE_LABELS).map((key) => (
                  <option key={key} value={key}>
                    {SIZE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description (optional)</label>
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional details..."
            />
          </div>

          <div style={styles.modalActions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid}
              style={{
                ...styles.button,
                backgroundColor: theme.primary,
                color: "white",
                opacity: isValid ? 1 : 0.5,
              }}
            >
              Post Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;

/**
 * NOTE:
 * You can either:
 *  - import shared styles from a central file, OR
 *  - keep local styles here
 * For now I’m assuming you keep the same styles object available.
 */
const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 50,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 14,
    width: "100%",
    maxWidth: 720,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    padding: 22,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalTitle: { margin: 0, fontSize: 18, color: "#111827", marginBottom: 20 },
  form: { marginTop: 0 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  formGroup: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 14,
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    boxSizing: "border-box",
    backgroundColor: "white",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: 12,
    fontSize: 14,
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    boxSizing: "border-box",
    backgroundColor: "white",
  },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  cancelButton: {
    padding: "12px 18px",
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  },
  button: { padding: "12px 24px", fontSize: 14, fontWeight: 600, border: "none", borderRadius: 8, cursor: "pointer" },
};
