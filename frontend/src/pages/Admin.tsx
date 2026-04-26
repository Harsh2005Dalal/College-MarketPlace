import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../lib/api";
import type { Donation, Product, UserProfile } from "../types";

export default function Admin({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"products" | "users" | "donations">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  const load = async () => {
    if (tab === "products") setProducts((await apiFetch("/admin/products")).products || []);
    if (tab === "users") setUsers((await apiFetch("/admin/users")).users || []);
    if (tab === "donations") setDonations((await apiFetch("/admin/donations")).donations || []);
  };

  useEffect(() => {
    if (user?.isAdmin) load().catch(() => {});
  }, [tab, user]);

  if (!user?.isAdmin) {
    return <div className="premium-shell p-8"><p className="text-red-400 mb-4">Access denied.</p><button className="text-indigo-300 hover:text-violet-300 transition-colors" onClick={() => onNavigate("marketplace")}>Go to marketplace</button></div>;
  }

  return (
    <div className="premium-shell p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Panel</h1>
      <div className="premium-card mb-6 flex">
        {(["products", "users", "donations"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-4 font-medium transition-colors ${tab === t ? "text-indigo-300 border-b-2 border-indigo-400" : "text-slate-400"}`}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="premium-card p-4 overflow-auto">
        {tab === "products" && products.map((p) => (
          <div key={p._id} className="py-2 border-b border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-200">{p.title} - Rs {p.price}</span>
            <button onClick={async () => { await apiFetch(`/admin/products/${p._id}`, { method: "DELETE" }); await load(); }} className="text-red-600 hover:text-red-700 transition-colors">Delete</button>
          </div>
        ))}
        {tab === "users" && users.map((u) => (
          <div key={u.id} className="py-2 border-b border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-200">{u.fullName} ({u.email}) {u.isAdmin ? "[ADMIN]" : ""}</span>
            <button onClick={async () => { await apiFetch(`/admin/users/${u.id}/toggle-admin`, { method: "PATCH" }); await load(); }} className="text-indigo-600 hover:text-violet-600 transition-colors">Toggle Admin</button>
          </div>
        ))}
        {tab === "donations" && donations.map((d) => (
          <div key={d._id} className="py-2 border-b border-slate-200/70 text-slate-200">
            {d.product?.title} donated by {d.donorName} ({d.donorEmail})
          </div>
        ))}
      </div>
    </div>
  );
}
