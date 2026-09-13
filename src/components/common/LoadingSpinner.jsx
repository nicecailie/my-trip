// src/components/common/LoadingSpinner.jsx
export const LoadingSpinner = () => (
  <div style={{
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #1f766b',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }} />
);
