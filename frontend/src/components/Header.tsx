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
    <header className="sticky top-0 z-40 px-3 pt-3">
      <div className="premium-card max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("marketplace")}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/40">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">IIT Ropar</h1>
              <p className="text-xs text-slate-300">Campus Marketplace</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {["marketplace", "dashboard", "add-product"].map((page) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                    : "text-slate-200 hover:bg-slate-800/70"
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
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === "admin"
                    ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30"
                    : "text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.fullName}</p>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
            <button aria-label="Sign out" onClick={() => signOut()} className="p-2 text-slate-300 hover:bg-slate-800/80 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setShowMobileMenu((s) => !s)} className="md:hidden p-2 text-slate-300 hover:bg-slate-800/80 rounded-xl transition-all">
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-700/60 py-3 space-y-2">
            {["marketplace", "dashboard", "add-product"].map((page) => (
              <button
                key={page}
                onClick={() => {
                  onNavigate(page);
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  currentPage === page ? "bg-indigo-500/20 text-indigo-200" : "text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                {page === "dashboard" ? "My Products" : page === "add-product" ? "Add Product" : "Marketplace"}
              </button>
            ))}
            {user.isAdmin && (
              <button
                onClick={() => {
                  onNavigate("admin");
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  currentPage === "admin" ? "bg-rose-500/20 text-rose-200" : "text-slate-200 hover:bg-slate-800/70"
                }`}
              >
                Admin
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
