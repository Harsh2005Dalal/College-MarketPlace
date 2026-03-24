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
    return <div className="p-8"><p className="text-red-600 mb-4">Access denied.</p><button className="text-blue-600" onClick={() => onNavigate("marketplace")}>Go to marketplace</button></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-white rounded-xl shadow-sm mb-6 flex">
        {(["products", "users", "donations"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-4 ${tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 overflow-auto">
        {tab === "products" && products.map((p) => (
          <div key={p._id} className="py-2 border-b flex items-center justify-between">
            <span>{p.title} - Rs {p.price}</span>
            <button onClick={async () => { await apiFetch(`/admin/products/${p._id}`, { method: "DELETE" }); await load(); }} className="text-red-600">Delete</button>
          </div>
        ))}
        {tab === "users" && users.map((u) => (
          <div key={u.id} className="py-2 border-b flex items-center justify-between">
            <span>{u.fullName} ({u.email}) {u.isAdmin ? "[ADMIN]" : ""}</span>
            <button onClick={async () => { await apiFetch(`/admin/users/${u.id}/toggle-admin`, { method: "PATCH" }); await load(); }} className="text-blue-600">Toggle Admin</button>
          </div>
        ))}
        {tab === "donations" && donations.map((d) => (
          <div key={d._id} className="py-2 border-b">
            {d.product?.title} donated by {d.donorName} ({d.donorEmail})
          </div>
        ))}
      </div>
    </div>
  );
}
