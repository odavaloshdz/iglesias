import React, { useState, useEffect } from "react";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./dashboard/Dashboard";

interface HomeProps {
  isAuthenticated?: boolean;
  userName?: string;
  userRole?: string;
}

const Home = ({
  isAuthenticated = false,
  userName = "Admin Usuario",
  userRole = "Administrador",
}: HomeProps) => {
  // Use localStorage to persist authentication state
  const [authenticated, setAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem("authenticated");
    return savedAuth ? JSON.parse(savedAuth) : isAuthenticated;
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Save authentication state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("authenticated", JSON.stringify(authenticated));
  }, [authenticated]);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError("");

    // Simulate API call
    try {
      // In a real app, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, accept any credentials
      // In a real app, you would validate credentials against your backend
      setAuthenticated(true);
      // Store user info in localStorage
      localStorage.setItem("userName", userName);
      localStorage.setItem("userRole", userRole);
    } catch (error) {
      setLoginError("Error al iniciar sesión. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  // Get user info from localStorage if available
  const storedUserName = localStorage.getItem("userName") || userName;
  const storedUserRole = localStorage.getItem("userRole") || userRole;

  return (
    <div className="min-h-screen bg-gray-50">
      {authenticated ? (
        <Dashboard
          userName={storedUserName}
          userRole={storedUserRole}
          onLogout={handleLogout}
        />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={loginError}
        />
      )}
    </div>
  );
};

export default Home;
