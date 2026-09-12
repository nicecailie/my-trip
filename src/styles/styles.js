
// src/styles/styles.js - Modern Professional Design System

// ========== COLOR PALETTES ==========
export const THEME_COLORS = {
  sender: {
    primary: '#3b82f6', // Modern blue
    primaryHover: '#2563eb',
    primaryLight: '#dbeafe',
    primaryDark: '#1e40af',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    shadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
  },
  traveler: {
    primary: '#10b981', // Modern emerald
    primaryHover: '#059669',
    primaryLight: '#d1fae5',
    primaryDark: '#047857',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    shadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
  },
  neutral: {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    black: '#000000'
  },
  status: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe'
  }
};

// ========== SPACING SYSTEM ==========
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
};

// ========== TYPOGRAPHY ==========
const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
    xxxl: '24px',
    huge: '32px'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
};

// ========== SHADOWS ==========
const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  xxl: '0 25px 50px rgba(0, 0, 0, 0.15)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)'
};

// ========== ANIMATIONS ==========
const animations = {
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// ========== MODERN STYLES ==========
export const styles = {
  // ========== AUTH SCREENS ==========
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: spacing.lg,
    fontFamily: typography.fontFamily
  },
  authCard: {
    backgroundColor: THEME_COLORS.neutral.white,
    borderRadius: '24px',
    boxShadow: shadows.xxl,
    padding: spacing.xxl,
    maxWidth: '480px',
    width: '100%',
    animation: 'slideUp 0.5s ease-out'
  },
  authLogo: {
    fontSize: '64px',
    textAlign: 'center',
    marginBottom: spacing.md,
    animation: 'bounce 1s ease-in-out'
  },
  authTitle: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.extrabold,
    textAlign: 'center',
    margin: `0 0 ${spacing.sm} 0`,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  authSubtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    color: THEME_COLORS.neutral.gray500,
    margin: `0 0 ${spacing.xl} 0`,
    fontWeight: typography.fontWeight.medium
  },
  
  // ========== ROLE SELECTION ==========
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.lg
  },
  roleCard: {
    border: `3px solid ${THEME_COLORS.neutral.gray200}`,
    borderRadius: '20px',
    padding: spacing.xl,
    textAlign: 'center',
    cursor: 'pointer',
    background: THEME_COLORS.neutral.white,
    transition: `all ${animations.transition.base}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden'
  },
  roleCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: shadows.xl,
    borderColor: '#667eea'
  },
  roleIcon: {
    fontSize: '80px',
    marginBottom: spacing.md,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
  },
  roleTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    margin: `0 0 ${spacing.sm} 0`,
    color: THEME_COLORS.neutral.gray900
  },
  roleDescription: {
    fontSize: typography.fontSize.md,
    color: THEME_COLORS.neutral.gray600,
    margin: `0 0 ${spacing.lg} 0`,
    lineHeight: typography.lineHeight.relaxed
  },
  roleFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: typography.fontSize.base,
    textAlign: 'left',
    color: THEME_COLORS.neutral.gray700,
    lineHeight: typography.lineHeight.relaxed
  },

  // ========== FORMS ==========
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: THEME_COLORS.neutral.gray700,
    marginBottom: spacing.xs
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: typography.fontSize.base,
    border: `2px solid ${THEME_COLORS.neutral.gray200}`,
    borderRadius: '12px',
    boxSizing: 'border-box',
    backgroundColor: THEME_COLORS.neutral.white,
    outline: 'none',
    transition: `all ${animations.transition.fast}`,
    fontFamily: typography.fontFamily
  },
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  
  // ========== BUTTONS ==========
  button: {
    padding: '14px 24px',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: `all ${animations.transition.fast}`,
    fontFamily: typography.fontFamily,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: THEME_COLORS.neutral.white,
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  buttonPrimaryHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
  },
  buttonSecondary: {
    backgroundColor: THEME_COLORS.neutral.gray100,
    color: THEME_COLORS.neutral.gray700,
    border: `2px solid ${THEME_COLORS.neutral.gray200}`
  },

  // ========== HEADER ==========
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: `${spacing.lg} 0`,
    boxShadow: shadows.lg,
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLogo: {
    fontSize: typography.fontSize.xxl,
    margin: 0,
    color: THEME_COLORS.neutral.white,
    fontWeight: typography.fontWeight.extrabold,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  userName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: THEME_COLORS.neutral.white
  },
  userRole: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: typography.fontWeight.medium
  },
  switchButton: {
    padding: '10px 20px',
    fontSize: typography.fontSize.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: THEME_COLORS.neutral.white,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: typography.fontWeight.semibold,
    backdropFilter: 'blur(10px)',
    transition: `all ${animations.transition.fast}`
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: typography.fontSize.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    color: THEME_COLORS.neutral.white,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: typography.fontWeight.semibold,
    transition: `all ${animations.transition.fast}`
  },

  // ========== NAVIGATION ==========
  nav: {
    backgroundColor: THEME_COLORS.neutral.white,
    boxShadow: shadows.sm,
    marginBottom: spacing.xl,
    position: 'sticky',
    top: '72px',
    zIndex: 90
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`,
    display: 'flex',
    gap: spacing.xs
  },
  navButton: {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: THEME_COLORS.neutral.gray600,
    borderBottom: '3px solid transparent',
    transition: `all ${animations.transition.fast}`,
    position: 'relative'
  },
  activeNavButton: {
    color: '#667eea',
    borderBottomColor: '#667eea'
  },

  // ========== MAIN CONTENT ==========
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing.xl} ${spacing.xxl}`,
    minHeight: 'calc(100vh - 200px)'
  },

  // ========== FEED ==========
  feedContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xl
  },
  feedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.lg,
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  feedTitle: {
    margin: 0,
    fontSize: typography.fontSize.huge,
    color: THEME_COLORS.neutral.gray900,
    fontWeight: typography.fontWeight.extrabold,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  feedSubtitle: {
    margin: `${spacing.sm} 0 0 0`,
    fontSize: typography.fontSize.md,
    color: THEME_COLORS.neutral.gray600,
    fontWeight: typography.fontWeight.medium
  },
  feedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: spacing.lg
  },

  // ========== CARDS ==========
  feedCard: {
    backgroundColor: THEME_COLORS.neutral.white,
    borderRadius: '20px',
    border: `1px solid ${THEME_COLORS.neutral.gray200}`,
    padding: spacing.lg,
    boxShadow: shadows.sm,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    transition: `all ${animations.transition.base}`,
    cursor: 'pointer'
  },
  feedCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: shadows.lg
  },
  activityCard: {
    backgroundColor: THEME_COLORS.neutral.white,
    borderRadius: '16px',
    border: `1px solid ${THEME_COLORS.neutral.gray200}`,
    padding: spacing.lg,
    marginBottom: spacing.md,
    boxShadow: shadows.sm,
    transition: `all ${animations.transition.base}`
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'flex-start'
  },
  cardTitle: {
    margin: 0,
    fontSize: typography.fontSize.lg,
    color: THEME_COLORS.neutral.gray900,
    fontWeight: typography.fontWeight.bold
  },
  cardRoute: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    fontSize: typography.fontSize.base,
    color: THEME_COLORS.neutral.gray800,
    padding: spacing.md,
    backgroundColor: THEME_COLORS.neutral.gray50,
    borderRadius: '12px',
    border: `1px solid ${THEME_COLORS.neutral.gray200}`,
    fontWeight: typography.fontWeight.medium
  },
  arrow: {
    color: THEME_COLORS.neutral.gray400,
    fontWeight: typography.fontWeight.extrabold,
    fontSize: typography.fontSize.lg
  },

  // ========== STATUS BADGES ==========
  status: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs
  },
  statusPending: {
    backgroundColor: THEME_COLORS.status.warningLight,
    color: '#92400e'
  },
  statusActive: {
    backgroundColor: THEME_COLORS.status.infoLight,
    color: '#1e40af'
  },
  statusCompleted: {
    backgroundColor: THEME_COLORS.status.successLight,
    color: '#065f46'
  },

  // ========== TABS ==========
  tabs: {
    display: 'flex',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    borderBottom: `2px solid ${THEME_COLORS.neutral.gray200}`,
    overflowX: 'auto'
  },
  tab: {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    marginBottom: '-2px',
    color: THEME_COLORS.neutral.gray600,
    transition: `all ${animations.transition.fast}`,
    whiteSpace: 'nowrap'
  },
  activeTab: {
    color: '#667eea',
    borderBottomColor: '#667eea'
  },

  // ========== EMPTY STATES ==========
  emptyState: {
    gridColumn: '1 / -1',
    backgroundColor: THEME_COLORS.neutral.white,
    borderRadius: '20px',
    padding: spacing.xxxl,
    textAlign: 'center',
    border: `2px dashed ${THEME_COLORS.neutral.gray300}`
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: spacing.lg,
    filter: 'grayscale(100%) opacity(0.5)'
  },
  emptyTitle: {
    margin: `0 0 ${spacing.sm} 0`,
    color: THEME_COLORS.neutral.gray900,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold
  },
  emptyText: {
    margin: 0,
    color: THEME_COLORS.neutral.gray600,
    fontSize: typography.fontSize.base
  },

  // ========== MODALS ==========
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: THEME_COLORS.neutral.white,
    borderRadius: '24px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: shadows.xxl,
    padding: spacing.xl,
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideUp 0.3s ease-out'
  },
  modalTitle: {
    margin: `0 0 ${spacing.lg} 0`,
    fontSize: typography.fontSize.xxl,
    color: THEME_COLORS.neutral.gray900,
    fontWeight: typography.fontWeight.extrabold
  },

  // ========== DETAILS ==========
  details: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${THEME_COLORS.neutral.gray200}`
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: THEME_COLORS.neutral.gray500,
    fontWeight: typography.fontWeight.medium
  },
  detailValue: {
    fontSize: typography.fontSize.base,
    color: THEME_COLORS.neutral.gray900,
    fontWeight: typography.fontWeight.semibold
  },

  // Add container for consistency
  container: {
    fontFamily: typography.fontFamily
  }
};

// ========== ANIMATIONS (Add to global CSS) ==========
export const globalAnimations = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f9fafb;
}

button:hover {
  transform: translateY(-2px);
}

input:focus, textarea:focus, select:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}
`;











// // ========== STYLES ==========
// const styles = {
//   // Auth container uses same name as app container in your snippet
//   container: {
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f5f7fa',
//     padding: '20px',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     padding: '40px',
//     maxWidth: '800px',
//     width: '100%'
//   },
//   authCard: {
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     padding: '40px',
//     maxWidth: '450px',
//     width: '100%'
//   },
//   logo: {
//     fontSize: '48px',
//     textAlign: 'center',
//     margin: '0 0 20px 0'
//   },
//   title: {
//     fontSize: '28px',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     margin: '0 0 10px 0',
//     color: '#1a1a1a'
//   },
//   subtitle: {
//     fontSize: '16px',
//     textAlign: 'center',
//     color: '#666',
//     margin: '0 0 40px 0'
//   },
//   authTitle: {
//     fontSize: '24px',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     margin: '0 0 8px 0',
//     color: '#1a1a1a'
//   },
//   authSubtitle: {
//     fontSize: '14px',
//     textAlign: 'center',
//     color: '#666',
//     margin: '0 0 30px 0'
//   },
//   roleGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
//     gap: '20px',
//     marginBottom: '30px'
//   },
//   roleCard: {
//     border: '2px solid #e0e0e0',
//     borderRadius: '12px',
//     padding: '30px',
//     textAlign: 'center',
//     cursor: 'pointer',
//     background: 'white',
//     transition: 'all 0.2s',
//     outline: 'none'
//   },
//   roleIcon: {
//     fontSize: '64px',
//     marginBottom: '15px'
//   },
//   roleTitle: {
//     fontSize: '22px',
//     fontWeight: 'bold',
//     margin: '0 0 10px 0'
//   },
//   roleDescription: {
//     fontSize: '15px',
//     color: '#666',
//     margin: '0 0 20px 0'
//   },
//   roleFeatures: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0,
//     fontSize: '14px',
//     textAlign: 'left',
//     color: '#374151',
//     lineHeight: 1.6
//   },
//   form: { marginTop: '20px' },
//   formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
//   formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' },
//   label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
//   input: {
//     width: '100%',
//     padding: '12px',
//     fontSize: '14px',
//     border: '1px solid #e0e0e0',
//     borderRadius: '6px',
//     boxSizing: 'border-box',
//     backgroundColor: 'white',
//     outline: 'none'
//   },
//   select: {
//     width: '100%',
//     padding: '12px',
//     fontSize: '14px',
//     border: '1px solid #e0e0e0',
//     borderRadius: '6px',
//     boxSizing: 'border-box',
//     backgroundColor: 'white'
//   },
//   checkboxGroup: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '10px',
//     padding: '10px',
//     border: '1px solid #e5e7eb',
//     borderRadius: '8px',
//     backgroundColor: '#fafafa'
//   },
//   checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', color: '#111827' },
//   button: {
//     padding: '12px 24px',
//     fontSize: '14px',
//     fontWeight: '600',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   authButton: {
//     width: '100%',
//     padding: '14px',
//     fontSize: '15px',
//     fontWeight: '600',
//     backgroundColor: '#2563eb',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     marginTop: '8px'
//   },
//   linkButton: {
//     background: 'none',
//     border: 'none',
//     color: '#2563eb',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '600',
//     padding: '4px'
//   },
//   authFooter: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' },
//   errorBanner: {
//     backgroundColor: '#fee2e2',
//     color: '#991b1b',
//     padding: '12px 16px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     marginBottom: '16px',
//     border: '1px solid #fecaca'
//   },

//   header: { padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' },
//   headerContent: {
//     maxWidth: '1200px',
//     margin: '0 auto',
//     padding: '0 20px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   headerLogo: { fontSize: '24px', margin: 0 },
//   userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
//   userDetails: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
//   userName: { fontSize: '15px', fontWeight: 'bold' },
//   userRole: { fontSize: '13px' },
//   switchButton: { padding: '8px 16px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
//   logoutButton: {
//     padding: '8px 16px',
//     fontSize: '13px',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: '600'
//   },

//   nav: { backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' },
//   navContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '8px' },
//   navButton: {
//     padding: '14px 20px',
//     fontSize: '15px',
//     fontWeight: '600',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     color: '#6b7280',
//     borderBottom: '3px solid transparent',
//     transition: 'all 0.2s'
//   },
//   activeNavButton: { borderBottom: '3px solid' },

//   mainContent: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px 24px' },

//   feedContainer: { display: 'flex', flexDirection: 'column', gap: '18px' },
//   feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' },
//   feedTitle: { margin: 0, fontSize: '22px', color: '#111827' },
//   feedSubtitle: { margin: '6px 0 0 0', fontSize: '14px', color: '#6b7280' },
//   feedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' },

//   emptyState: { gridColumn: '1 / -1', backgroundColor: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px dashed #d1d5db' },
//   emptyIcon: { fontSize: '40px', marginBottom: '10px' },
//   emptyTitle: { margin: '0 0 6px 0', color: '#111827' },
//   emptyText: { margin: 0, color: '#6b7280' },

//   feedCard: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '14px' },
//   activityCard: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
//   cardHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' },
//   cardTitle: { margin: 0, fontSize: '16px', color: '#111827' },
//   cardUser: { marginTop: '6px', fontSize: '13px', color: '#6b7280' },
//   cardRating: { marginTop: '6px', fontSize: '13px', color: '#6b7280' },
//   cardDate: { fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '6px 10px', borderRadius: '999px', whiteSpace: 'nowrap' },
//   cardSize: { fontSize: '12px', color: '#111827', padding: '6px 10px', borderRadius: '999px', whiteSpace: 'nowrap' },
//   cardRoute: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '14px', color: '#111827', padding: '10px 12px', backgroundColor: '#f9fafb', borderRadius: '10px', border: '1px solid #f1f5f9' },
//   arrow: { color: '#6b7280', fontWeight: 700 },
//   cardDetails: { display: 'flex', flexDirection: 'column', gap: '8px' },
//   cardDetail: { display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '13px', color: '#111827' },
//   detailLabel: { color: '#6b7280', fontWeight: 600, minWidth: '90px' },

//   tabs: { display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e5e7eb' },
//   tab: { padding: '12px 24px', fontSize: '15px', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-2px', color: '#6b7280', transition: 'all 0.2s' },
//   activeTab: { borderBottom: '2px solid' },

//   status: { padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
//   statusPending: { backgroundColor: '#fef3c7', color: '#92400e' },
//   statusActive: { backgroundColor: '#dbeafe', color: '#1e40af' },
//   statusCompleted: { backgroundColor: '#d1fae5', color: '#065f46' },

//   details: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' },
//   detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
//   detailValue: { fontSize: '14px', color: '#111827' },

//   chatContainer: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', height: 'calc(100vh - 250px)' },
//   conversationList: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
//   conversationHeader: { padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
//   conversationTitle: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' },
//   conversationItem: { padding: '16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.2s', backgroundColor: 'white' },
//   conversationItemActive: { backgroundColor: '#eff6ff' },
//   conversationUser: { fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' },
//   conversationPreview: { fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

//   chatArea: { backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
//   chatHeader: { padding: '16px 20px', borderBottom: '1px solid #e5e7eb' },
//   chatTitle: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#111827' },
//   chatSubtitle: { margin: 0, fontSize: '13px', color: '#6b7280' },

//   messagesContainer: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' },
//   message: { maxWidth: '70%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5' },
//   myMessage: { alignSelf: 'flex-end', color: 'white' },
//   theirMessage: { alignSelf: 'flex-start', backgroundColor: '#f3f4f6', color: '#111827' },

//   messageInput: { padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' },
//   sendButton: { padding: '12px 24px', fontSize: '14px', fontWeight: '600', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },

//   chatEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px' },

//   modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 50 },
//   modal: { backgroundColor: 'white', borderRadius: '14px', width: '100%', maxWidth: '720px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', padding: '22px', maxHeight: '90vh', overflowY: 'auto' },
//   modalTitle: { margin: 0, fontSize: '18px', color: '#111827', marginBottom: '20px' },
//   modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
//   cancelButton: { padding: '12px 18px', fontSize: '14px', fontWeight: '600', backgroundColor: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '8px', cursor: 'pointer' }
// };

// export { styles };