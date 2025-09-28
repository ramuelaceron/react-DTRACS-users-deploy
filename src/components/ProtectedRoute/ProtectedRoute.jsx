// src/components/ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";
import config from "../../config";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = sessionStorage.getItem("authToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      // Valid access token → authenticated
      if (accessToken && !isTokenExpired(accessToken)) {
        setIsAuthenticated(true);
        return;
      }

      // Try to refresh if possible
      if (refreshToken) {
        try {
          const response = await fetch(`${config.API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${refreshToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.access_token;

            if (newAccessToken) {
              sessionStorage.setItem("authToken", newAccessToken);

              // Optional: validate with profile fetch
              const profileRes = await fetch(`${config.API_BASE_URL}/auth/get/current/user`, {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              });

              if (profileRes.ok) {
                setIsAuthenticated(true);
                return;
              }
            }
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }

      // Clean up and mark as unauthenticated
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  // While checking: render nothing (no loading UI)
  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;