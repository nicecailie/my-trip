import React from "react";
import { StorageProvider } from "./contexts/StorageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import LoginSignup from "./components/auth/Login";
import PasswordReset from "./components/auth/PasswordReset";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

const AppRouter = () => {
  const { isAuthenticated, isLoading, recoveryMode } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (recoveryMode) return <PasswordReset />;
  return isAuthenticated ? <Layout /> : <LoginSignup />;
};

export default function AppRoot() {
  return (
    <AuthProvider>
      <StorageProvider>
        <AppRouter />
      </StorageProvider>
    </AuthProvider>
  );
}
