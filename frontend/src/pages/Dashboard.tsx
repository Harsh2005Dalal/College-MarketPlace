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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Products</h1>
          <button onClick={() => onNavigate("add-product")} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Add Product</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm mb-6 flex">
          {(["available", "sold", "donated"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 px-6 py-4 ${tab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}>{t.toUpperCase()}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
              {tab === "available" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => mark(product._id, "sold")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm">Mark Sold</button>
                  <button onClick={() => mark(product._id, "donated")} className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm">Donate NGO</button>
                  <button onClick={() => remove(product._id)} className="bg-red-600 text-white px-3 rounded-lg text-sm">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {ngo && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold mb-2">NGO Donation Contact</h3>
            <p className="text-sm text-gray-700">{ngo.name}</p>
            {ngo.email && <p className="text-sm text-gray-600">Email: {ngo.email}</p>}
            {ngo.phone && <p className="text-sm text-gray-600">Phone: {ngo.phone}</p>}
            {ngo.upi && <p className="text-sm text-gray-600">UPI: {ngo.upi}</p>}
            {ngo.note && <p className="text-sm text-gray-500 mt-2">{ngo.note}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
