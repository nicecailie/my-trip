import React from "react";

const paths = {
  bag: <><path d="M7 9V7a5 5 0 0 1 10 0v2"/><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 13h8M12 9v11"/></>,
  box: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
  route: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  scale: <><path d="M5 21h14M12 3v18M6 6h12M6 6l-3 7h6L6 6ZM18 6l-3 7h6l-3-7Z"/></>,
  shield: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>,
  send: <><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
  inbox: <><path d="M4 4h16v16H4z"/><path d="M4 14h5l2 3h2l2-3h5"/></>,
};

const Icon = ({ name, size = 20, className = "", title }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : "true"}
    role={title ? "img" : undefined}
  >
    {title && <title>{title}</title>}
    {paths[name] || paths.bag}
  </svg>
);

export default Icon;
