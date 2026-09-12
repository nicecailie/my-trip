import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStorage } from "../../hooks/useStorage";
import { ITEM_TYPE_LABELS, SIZE_LABELS, ALL_CITIES } from "../../utils/constants";
import { styles} from '../../styles/styles';

const CreateTrip = ({ onClose, onCreate }) => {
  const { currentUser, getTheme } = useAuth();
  const { createTrip } = useStorage();
  const theme = getTheme();

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    travelDate: "",
    availableSpace: "",
    acceptedItems: [],
    deliveryArea: "",
  });

  const toggleItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      acceptedItems: prev.acceptedItems.includes(item)
        ? prev.acceptedItems.filter((i) => i !== item)
        : [...prev.acceptedItems, item],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trip = createTrip({
      ...formData,
      travelerId: currentUser.id,
      travelerName: currentUser.name,
    });

    onCreate?.(trip);
    onClose?.();
  };

  const isValid =
    formData.from &&
    formData.to &&
    formData.from !== formData.to &&
    formData.travelDate &&
    formData.availableSpace &&
    formData.acceptedItems.length > 0;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitle}>Post Your Trip</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
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
              <label style={styles.label}>Travel Date *</label>
              <input
                type="date"
                style={styles.input}
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Available Space *</label>
              <select
                style={styles.select}
                value={formData.availableSpace}
                onChange={(e) => setFormData({ ...formData, availableSpace: e.target.value })}
                required
              >
                <option value="">Select space</option>
                {Object.keys(SIZE_LABELS).map((key) => (
                  <option key={key} value={key}>
                    {SIZE_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Items You Can Carry *</label>
            <div style={styles.checkboxGroup}>
              {Object.keys(ITEM_TYPE_LABELS).map((key) => (
                <label key={key} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.acceptedItems.includes(key)}
                    onChange={() => toggleItem(key)}
                  />
                  <span style={{ marginLeft: 8 }}>{ITEM_TYPE_LABELS[key]}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Area (optional)</label>
            <input
              type="text"
              style={styles.input}
              value={formData.deliveryArea}
              onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
              placeholder="e.g., Central London only"
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
                ...styles.primaryButton,
                backgroundColor: theme.primary,
                opacity: isValid ? 1 : 0.5,
              }}
            >
              Post Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
