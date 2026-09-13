import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ROLES, THEME_COLORS } from "../utils/constants";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const AuthContext = createContext(null);

const profileFallback = (user) => ({
  id: user.id,
  email: user.email,
  name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Chagga member",
  phone: user.user_metadata?.phone || "",
  role: user.user_metadata?.role || ROLES.SENDER,
  rating: 5,
  completedDeliveries: 0,
  verificationStatus: "unverified",
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [recoveryMode, setRecoveryMode] = useState(false);

  const hydrateUser = useCallback(async (authUser) => {
    if (!authUser || !supabase) {
      setCurrentUser(null);
      return;
    }

    const [{ data: profile }, { data: contact }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle(),
      supabase.from("profile_contacts").select("phone").eq("user_id", authUser.id).maybeSingle(),
    ]);

    const fallback = profileFallback(authUser);
    setCurrentUser({
      ...fallback,
      name: profile?.full_name || fallback.name,
      phone: contact?.phone || fallback.phone,
      role: profile?.active_role || fallback.role,
      rating: Number(profile?.rating ?? fallback.rating),
      completedDeliveries: profile?.completed_deliveries ?? fallback.completedDeliveries,
      verificationStatus: profile?.verification_status || fallback.verificationStatus,
    });
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      hydrateUser(data.session?.user).finally(() => active && setIsLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      window.setTimeout(() => {
        if (active) hydrateUser(session?.user).finally(() => active && setIsLoading(false));
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [hydrateUser]);

  const signup = async (userData) => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };

    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.name.trim(),
          phone: userData.phone?.trim() || "",
          role: userData.role,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) return { success: false, error: error.message };
    if (!data.user) {
      return { success: false, error: "Supabase did not create the account. Please try again." };
    }

    // With email confirmation enabled, Supabase may hide an existing account by
    // returning an obfuscated user with no identities instead of an error.
    if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        success: false,
        error: "This email may already have an account. Try signing in or resetting your password.",
      };
    }

    if (data.session) await hydrateUser(data.user);
    return {
      success: true,
      userId: data.user.id,
      email: data.user.email,
      requiresEmailConfirmation: !data.session,
    };
  };

  const resendSignupConfirmation = async (email) => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return { success: false, error: "Enter your email address first." };

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: normalizedEmail,
      options: { emailRedirectTo: window.location.origin },
    });

    return error ? { success: false, error: error.message } : { success: true };
  };

  const login = async (email, password) => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) return { success: false, error: error.message };
    await hydrateUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    setCurrentUser(null);
    return { success: true };
  };

  const switchRole = async (newRole) => {
    if (!supabase || !currentUser) return { success: false, error: "You must be signed in." };
    if (![ROLES.SENDER, ROLES.TRAVELER].includes(newRole)) {
      return { success: false, error: "Invalid account role." };
    }

    const previousRole = currentUser.role;
    setCurrentUser((user) => ({ ...user, role: newRole }));

    const { error } = await supabase
      .from("profiles")
      .update({ active_role: newRole })
      .eq("id", currentUser.id);

    if (error) {
      setCurrentUser((user) => ({ ...user, role: previousRole }));
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const requestPasswordReset = async (email) => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin,
    });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const updatePassword = async (password) => {
    if (!supabase) return { success: false, error: "Authentication is not configured yet." };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };
    setRecoveryMode(false);
    return { success: true };
  };

  const isSender = () => currentUser?.role === ROLES.SENDER;
  const isTraveler = () => currentUser?.role === ROLES.TRAVELER;
  const getTheme = () => isSender() ? THEME_COLORS.sender : THEME_COLORS.traveler;

  const value = useMemo(() => ({
    currentUser,
    signup,
    login,
    logout,
    switchRole,
    requestPasswordReset,
    resendSignupConfirmation,
    updatePassword,
    cancelRecovery: () => setRecoveryMode(false),
    recoveryMode,
    isLoading,
    isAuthConfigured: isSupabaseConfigured,
    isSender,
    isTraveler,
    getTheme,
    isAuthenticated: Boolean(currentUser),
  }), [currentUser, isLoading, recoveryMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
