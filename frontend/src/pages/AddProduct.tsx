import { useState } from "react";
import { apiFetch } from "../lib/api";

const categories = ["Electronics", "Books", "Furniture", "Clothing", "Sports", "Other"];
const conditions = ["new", "like-new", "good", "fair", "poor"];

export default function AddProduct({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "good",
    category: "Electronics",
    imageUrl: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await apiFetch("/products", { method: "POST", body: JSON.stringify({ ...formData, price: Number(formData.price) }) });
      onNavigate("dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-shell py-12 px-4">
      <div className="max-w-3xl mx-auto premium-card p-8">
        <p className="text-indigo-200 text-sm mb-2">Create Campus Listing</p>
        <h1 className="text-3xl font-bold mb-2 text-white">List Your Product</h1>
        <p className="text-slate-300 mb-6">Add clear details so other students can quickly discover your item.</p>
        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input name="title" className="premium-input" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <textarea name="description" className="premium-input min-h-28" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <input name="price" type="number" min="0" className="premium-input" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <select aria-label="Product category" className="premium-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{categories.map((x) => <option key={x}>{x}</option>)}</select>
          <select aria-label="Product condition" className="premium-select" value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })}>{conditions.map((x) => <option key={x}>{x}</option>)}</select>
          <input name="imageUrl" className="premium-input" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
          <div className="flex gap-4">
            <button type="button" onClick={() => onNavigate("dashboard")} className="btn-secondary flex-1">Cancel</button>
            <button disabled={loading} className="btn-primary flex-1">{loading ? "Adding..." : "List Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
