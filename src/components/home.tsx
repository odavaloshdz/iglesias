import React, { useState, useEffect } from "react";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./dashboard/Dashboard";
import { authService } from "@/services/authService";

interface HomeProps {
  isAuthenticated?: boolean;
  userName?: string;
  userRole?: string;
  defaultView?: string;
  defaultDocumentType?: string;
}

const Home = ({
  isAuthenticated = false,
  userName = "Admin Usuario",
  userRole = "Administrador",
  defaultView = "list",
  defaultDocumentType = "baptism",
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

    try {
      // Use the auth service to sign in
      const user = await authService.signIn(data.email, data.password);

      setAuthenticated(true);
      // Store user info in localStorage
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);
    } catch (error) {
      setLoginError("Error al iniciar sesión. Por favor, intente nuevamente.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await authService.signOut();
      setAuthenticated(false);
      localStorage.removeItem("authenticated");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
          defaultView={defaultView as any}
          defaultDocumentType={defaultDocumentType as any}
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
