import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import ChaggaLogo from '../common/ChaggaLogo';
import Icon from '../common/Icon';

const BrandMark = () => (
  <div className="brand-lockup" aria-label="Chagga"><ChaggaLogo /></div>
);

const AuthShell = ({ children }) => (
  <main className="auth-shell">
    <section className="auth-story" aria-label="About Chagga">
      <img className="auth-story-image" src="/assets/accra-traveler.jpg" alt="Traveler moving through Accra airport with luggage" />
      <div className="auth-story-shade" />
      <div className="auth-story-top"><BrandMark /></div>
      <div className="auth-story-copy">
        <span className="eyebrow eyebrow-light">Peer-to-peer delivery</span>
        <h1>Your journey can carry something meaningful.</h1>
        <p>Connect with verified people already traveling between Africa and Europe.</p>
        <div className="trust-row" aria-label="Platform benefits">
          <span>Identity-led profiles</span><span>Direct messaging</span><span>Delivery tracking</span>
        </div>
      </div>
      <a className="photo-credit" href="https://unsplash.com/photos/a-man-standing-next-to-a-cart-filled-with-luggage-Dr_Wr7w6CXM" target="_blank" rel="noreferrer">Photo: Kagou Dicko</a>
    </section>
    <section className="auth-workspace">{children}</section>
  </main>
);

const LoginSignup = () => {
  const { signup, login, requestPasswordReset, resendSignupConfirmation, isAuthConfigured } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const clearNotices = () => { setError(''); setMessage(''); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearNotices();
    setLoading(true);
    if (isLogin) {
      const result = await login(form.email, form.password);
      if (!result.success) setError(result.error);
    } else {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill all required fields.'); setLoading(false); return;
      }
      if (!selectedRole) {
        setError('Choose how you want to use Chagga.'); setLoading(false); return;
      }
      if (form.password.length < 8) {
        setError('Use at least 8 characters for your password.'); setLoading(false); return;
      }
      const result = await signup({ ...form, role: selectedRole });
      if (!result.success) setError(result.error);
      else if (result.requiresEmailConfirmation) {
        setMessage('Check your email to confirm your account, then return here to sign in.');
        setPendingConfirmationEmail(result.email || form.email.trim().toLowerCase());
        setIsLogin(true);
        setSelectedRole(null);
        setForm((current) => ({ ...current, password: '' }));
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault(); clearNotices(); setLoading(true);
    const result = await requestPasswordReset(form.email);
    setLoading(false);
    if (!result.success) setError(result.error);
    else setMessage('A secure reset link is on its way to your inbox.');
  };

  const handleResendConfirmation = async () => {
    clearNotices(); setLoading(true);
    const result = await resendSignupConfirmation(pendingConfirmationEmail || form.email);
    setLoading(false);
    if (!result.success) setError(result.error);
    else setMessage('Confirmation email resent. Check your inbox and spam folder.');
  };

  const switchAuthMode = () => {
    setIsLogin((current) => !current); setSelectedRole(null); clearNotices();
  };

  if (isForgotPassword) {
    return (
      <AuthShell>
        <div className="auth-panel compact-panel">
          <div className="mobile-brand"><BrandMark /></div>
          <button className="text-button back-link" onClick={() => { setIsForgotPassword(false); clearNotices(); }}>← Back to sign in</button>
          <span className="eyebrow">Account recovery</span>
          <h2>Reset your password</h2>
          <p className="auth-intro">Enter the email you use for Chagga. We’ll send you a secure reset link.</p>
          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {message && <div className="notice notice-success" role="status">{message}</div>}
          <form onSubmit={handlePasswordReset} className="auth-form">
            <label className="field-label">Email address
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <button className="primary-action" type="submit" disabled={loading || !isAuthConfigured}>{loading ? 'Sending…' : 'Send reset link'}</button>
          </form>
        </div>
      </AuthShell>
    );
  }

  if (!isLogin && !selectedRole) {
    return (
      <AuthShell>
        <div className="auth-panel role-panel">
          <div className="mobile-brand"><BrandMark /></div>
          <span className="eyebrow">Create an account</span>
          <h2>How will you use Chagga?</h2>
          <p className="auth-intro">Choose a starting mode. You can switch at any time.</p>
          <div className="role-options">
            <button className="role-option" onClick={() => setSelectedRole(ROLES.SENDER)}>
              <span className="role-glyph" aria-hidden="true"><Icon name="box" /></span>
              <span className="role-copy"><strong>Send an item</strong><small>Find someone already traveling your route.</small></span>
              <span className="role-arrow" aria-hidden="true">→</span>
            </button>
            <button className="role-option" onClick={() => setSelectedRole(ROLES.TRAVELER)}>
              <span className="role-glyph traveler" aria-hidden="true"><Icon name="bag" /></span>
              <span className="role-copy"><strong>Travel with space</strong><small>Earn a little by carrying approved items.</small></span>
              <span className="role-arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <p className="auth-switch">Already a member? <button className="text-button" onClick={() => setIsLogin(true)}>Sign in</button></p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="auth-panel compact-panel">
        <div className="mobile-brand"><BrandMark /></div>
        <span className="eyebrow">{isLogin ? 'Welcome back' : selectedRole === ROLES.SENDER ? 'Sender account' : 'Traveler account'}</span>
        <h2>{isLogin ? 'Sign in to Chagga' : 'Create your account'}</h2>
        <p className="auth-intro">{isLogin ? 'Pick up where you left off.' : 'Your next connection starts with a trusted profile.'}</p>
        {error && <div className="notice notice-error" role="alert">{error}</div>}
        {message && <div className="notice notice-success" role="status">{message}</div>}
        {pendingConfirmationEmail && (
          <button type="button" className="resend-button" onClick={handleResendConfirmation} disabled={loading}>
            {loading ? 'Sending…' : 'Resend confirmation email'}
          </button>
        )}
        {!isAuthConfigured && <div className="notice notice-error" role="alert">Authentication setup is incomplete. Add your Supabase URL and publishable key.</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && <label className="field-label">Full name
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" autoComplete="name" required />
          </label>}
          <label className="field-label">Email address
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" required />
          </label>
          <label className="field-label">Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'} autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={isLogin ? undefined : 8} required />
          </label>
          {!isLogin && <label className="field-label">Phone number <span>Optional</span>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 712 345 678" autoComplete="tel" />
          </label>}
          {isLogin && <button type="button" className="text-button forgot-link" onClick={() => { setIsForgotPassword(true); clearNotices(); }}>Forgot password?</button>}
          <button className="primary-action" type="submit" disabled={loading || !isAuthConfigured}>{loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}</button>
        </form>
        {!isLogin && <button className="text-button back-link centered" onClick={() => setSelectedRole(null)}>← Change account type</button>}
        <p className="auth-switch">{isLogin ? 'New to Chagga?' : 'Already a member?'} <button className="text-button" onClick={switchAuthMode}>{isLogin ? 'Create an account' : 'Sign in'}</button></p>
        <p className="terms-note">By continuing, you agree to carry only inspected and permitted items.</p>
      </div>
    </AuthShell>
  );
};

export default LoginSignup;
