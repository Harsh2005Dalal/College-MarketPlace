import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<"available" | "sold" | "donated">("available");
  const [ngo, setNgo] = useState<{ name: string; email: string; phone: string; upi: string; note: string } | null>(null);

  const load = async () => {
    const data = await apiFetch("/products/me");
    setProducts(data.products || []);
  };

  useEffect(() => {
    load().catch(() => setProducts([]));
    apiFetch("/meta/ngo")
      .then((d) => setNgo(d.ngo || null))
      .catch(() => setNgo(null));
  }, []);

  const filtered = useMemo(() => products.filter((p) => p.status === tab), [products, tab]);

  const mark = async (id: string, status: "sold" | "donated") => {
    if (status === "donated") {
      await apiFetch(`/products/${id}/donate`, { method: "POST", body: JSON.stringify({}) });
    } else {
      await apiFetch(`/products/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    }
    await load();
  };

  const remove = async (id: string) => {
    await apiFetch(`/products/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="premium-shell py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">My Products</h1>
          <button onClick={() => onNavigate("add-product")} className="btn-primary">Add Product</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="premium-card p-4">
            <p className="text-sm text-slate-400">Available</p>
            <p className="text-2xl font-bold text-white">{products.filter((p) => p.status === "available").length}</p>
          </div>
          <div className="premium-card p-4">
            <p className="text-sm text-slate-400">Sold</p>
            <p className="text-2xl font-bold text-white">{products.filter((p) => p.status === "sold").length}</p>
          </div>
          <div className="premium-card p-4">
            <p className="text-sm text-slate-400">Donated</p>
            <p className="text-2xl font-bold text-white">{products.filter((p) => p.status === "donated").length}</p>
          </div>
        </div>
        <div className="premium-card mb-6 flex">
          {(["available", "sold", "donated"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 px-6 py-4 font-medium transition-colors ${tab === t ? "text-indigo-300 border-b-2 border-indigo-400" : "text-slate-400"}`}>{t.toUpperCase()}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
              {tab === "available" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => mark(product._id, "sold")} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5">Mark Sold</button>
                  <button onClick={() => mark(product._id, "donated")} className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5">Donate NGO</button>
                  <button onClick={() => remove(product._id)} className="rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white px-3 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {ngo && (
          <div className="mt-8 premium-card p-5">
            <h3 className="text-lg font-semibold mb-2 text-white">NGO Donation Contact</h3>
            <p className="text-sm text-slate-200">{ngo.name}</p>
            {ngo.email && <p className="text-sm text-slate-300">Email: {ngo.email}</p>}
            {ngo.phone && <p className="text-sm text-slate-300">Phone: {ngo.phone}</p>}
            {ngo.upi && <p className="text-sm text-slate-300">UPI: {ngo.upi}</p>}
            {ngo.note && <p className="text-sm text-slate-400 mt-2">{ngo.note}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
