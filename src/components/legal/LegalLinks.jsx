import React, { useState } from "react";
import LegalModal from "./LegalModal";

const LegalLinks = ({ compact = false }) => {
  const [openPolicy, setOpenPolicy] = useState(null);

  return (
    <>
      <nav className={compact ? "legal-links compact" : "legal-links"} aria-label="Legal information">
        <button type="button" onClick={() => setOpenPolicy("terms")}>Terms</button>
        <span aria-hidden="true">·</span>
        <button type="button" onClick={() => setOpenPolicy("privacy")}>Privacy</button>
        <span aria-hidden="true">·</span>
        <button type="button" onClick={() => setOpenPolicy("safety")}>Safety</button>
      </nav>
      {openPolicy && <LegalModal policy={openPolicy} onClose={() => setOpenPolicy(null)} />}
    </>
  );
};

export default LegalLinks;
