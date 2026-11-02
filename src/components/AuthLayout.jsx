
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthLayout({
  children,
  authentication = true,
}) {
  const authStatus = useSelector((state) => state.auth.status);

  // Protected page: redirect guests to login.
  if (authentication && !authStatus) {
    return <Navigate to="/login" replace />;
  }

  // Login/signup page: redirect authenticated users home.
  if (!authentication && authStatus) {
    return <Navigate to="/" replace />;
  }

  return children;
}
