import { useState } from "react";
import { LogOut, Menu, Package, Plus, Shield, Store, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

type HeaderProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("marketplace")}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">IIT Ropar</h1>
              <p className="text-xs text-gray-600">Marketplace</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {["marketplace", "dashboard", "add-product"].map((page) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  currentPage === page ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page === "marketplace" && <Store className="w-4 h-4" />}
                {page === "dashboard" && <Package className="w-4 h-4" />}
                {page === "add-product" && <Plus className="w-4 h-4" />}
                {page === "dashboard" ? "My Products" : page === "add-product" ? "Add Product" : "Marketplace"}
              </button>
            ))}
            {user.isAdmin && (
              <button
                onClick={() => onNavigate("admin")}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  currentPage === "admin" ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <button onClick={() => signOut()} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setShowMobileMenu((s) => !s)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
