import React, { useState } from "react";
import { useStorage } from "../../hooks/useStorage";
import { AFRICAN_CITIES, EUROPEAN_CITIES, ITEM_TYPE_LABELS, SIZE_LABELS } from "../../utils/constants";
import Icon from "../common/Icon";

const CityOptions = () => <>
  <optgroup label="Africa">{AFRICAN_CITIES.map((city) => <option key={city}>{city}</option>)}</optgroup>
  <optgroup label="Europe — priority corridors">{EUROPEAN_CITIES.map((city) => <option key={city}>{city}</option>)}</optgroup>
</>;

const CreateRequest = ({ onClose, onCreate }) => {
  const { createRequest } = useStorage();
  const [formData, setFormData] = useState({ itemType: "", from: "", to: "", neededBy: "", size: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const setField = (field, value) => setFormData((previous) => ({ ...previous, [field]: value }));
  const isValid = formData.itemType && formData.from && formData.to && formData.from !== formData.to && formData.neededBy && formData.size;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const request = await createRequest(formData);
      onCreate?.(request);
      onClose?.();
    } catch (submitError) {
      setError(submitError.message || "Your delivery request could not be posted.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="market-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="market-modal" role="dialog" aria-modal="true" aria-labelledby="request-modal-title">
        <header className="market-modal-header">
          <span className="modal-icon"><Icon name="box" size={24} /></span>
          <div><span className="eyebrow">Send it with care</span><h2 id="request-modal-title">Post a delivery request</h2><p>Share enough detail for the right traveler to offer help.</p></div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>

        <form className="market-form" onSubmit={handleSubmit}>
          <fieldset className="form-section"><legend><Icon name="box" /> What are you sending?</legend>
            <div className="choice-grid">{Object.entries(ITEM_TYPE_LABELS).map(([key, label]) => <label className={formData.itemType === key ? "choice-card selected" : "choice-card"} key={key}><input type="radio" name="itemType" value={key} checked={formData.itemType === key} onChange={(e) => setField("itemType", e.target.value)} /><Icon name={key === "documents" ? "send" : "box"} /><span>{label}</span><Icon name="check" className="choice-check" /></label>)}</div>
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="route" /> Delivery route</legend>
            <div className="form-grid two-columns">
              <label className="market-field">From<select value={formData.from} onChange={(e) => setField("from", e.target.value)} required><option value="">Choose a city</option><CityOptions /></select></label>
              <label className="market-field">To<select value={formData.to} onChange={(e) => setField("to", e.target.value)} required><option value="">Choose a city</option><CityOptions /></select></label>
            </div>
            {formData.from && formData.from === formData.to && <p className="field-error">Choose two different cities.</p>}
          </fieldset>

          <fieldset className="form-section"><legend><Icon name="calendar" /> Timing and size</legend>
            <div className="form-grid two-columns">
              <label className="market-field">Needed by<input type="date" value={formData.neededBy} onChange={(e) => setField("neededBy", e.target.value)} min={new Date().toISOString().split("T")[0]} required /></label>
              <label className="market-field">Package size<select value={formData.size} onChange={(e) => setField("size", e.target.value)} required><option value="">Choose a size</option>{Object.entries(SIZE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            </div>
          </fieldset>

          <label className="market-field">Item details <small>Optional, but recommended</small><textarea maxLength="600" value={formData.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the exact contents, packaging, and whether the traveler can inspect it." /><span className="character-count">{formData.description.length}/600</span></label>
          <div className="form-safety"><Icon name="shield" /><span>Do not post cash, unknown sealed packages, dangerous goods, or restricted items.</span></div>
          {error && <p className="form-submit-error" role="alert">{error}</p>}
          <footer className="market-modal-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancel</button><button type="submit" className="primary-action" disabled={!isValid || isSubmitting}>{isSubmitting ? "Posting…" : "Post request"}</button></footer>
        </form>
      </section>
    </div>
  );
};

export default CreateRequest;
