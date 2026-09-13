// import React from "react";

// const ChaggaLogo = ({ compact = false, light = false }) => (
//   <span className={`chagga-logo${compact ? " compact" : ""}${light ? " light" : ""}`}>
//     <svg className="chagga-symbol" viewBox="0 0 48 48" aria-hidden="true">
//       <circle cx="20" cy="10" r="4" fill="currentColor" />
//       <path d="M19 16c3 0 5 2 6 5l3 8 7 4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M21 20l-5 10-7 8M24 29l-2 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
//       <g className="chagga-bag">
//         <rect x="29" y="15" width="13" height="14" rx="3" fill="var(--clay)" />
//         <path d="M32 15v-2a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="var(--clay)" strokeWidth="2.5" strokeLinecap="round" />
//       </g>
//       <path d="M8 41h34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".2" />
//     </svg>
//     {!compact && <span className="chagga-wordmark">chagga<span>.</span></span>}
//   </span>
// );

// export default ChaggaLogo;
import React from "react";

const ChaggaLogo = ({ compact = false }) => (
  <img
    src={compact
      ? "/assets/chagga-icon.png"
      : "/assets/chagga-logo.png"
    }
    className={compact ? "chagga-logo-icon" : "chagga-logo-image"}
    alt="Chagga"
  />
);

export default ChaggaLogo;