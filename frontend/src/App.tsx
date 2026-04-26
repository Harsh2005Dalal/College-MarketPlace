import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Admin from "./pages/Admin";

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("marketplace");

  useEffect(() => {
    if (window.location.pathname.includes("reset-password")) {
      setCurrentPage("reset-password");
    }
  }, []);

  if (loading) return <div className="premium-shell p-10 text-center text-slate-700">Loading...</div>;

  if (!user) {
    if (currentPage === "signup") return <Signup onNavigate={setCurrentPage} />;
    if (currentPage === "forgot-password") return <ForgotPassword onNavigate={setCurrentPage} />;
    if (currentPage === "reset-password") return <ResetPassword onNavigate={setCurrentPage} />;
    return <Login onNavigate={setCurrentPage} />;
  }

  return (
    <div className="premium-shell">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === "marketplace" && <Marketplace />}
      {currentPage === "dashboard" && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === "add-product" && <AddProduct onNavigate={setCurrentPage} />}
      {currentPage === "admin" && <Admin onNavigate={setCurrentPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
