import { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import { apiFetch } from "../lib/api";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Electronics", "Books", "Furniture", "Clothing", "Sports", "Other"];
const conditions = ["All", "new", "like-new", "good", "fair", "poor"];

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    apiFetch(`/products?search=${encodeURIComponent(search)}&category=${category}&condition=${condition}&sortBy=${sortBy}`)
      .then((d) => setProducts(d.products))
      .catch(() => setProducts([]));
  }, [search, category, condition, sortBy]);

  return (
    <div className="premium-shell">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="premium-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm mb-2">IIT Ropar Student Community</p>
              <h1 className="section-title">Discover Deals Across Campus</h1>
              <p className="text-slate-300 mt-2">Buy, sell, and exchange essentials with trusted students.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-64">
              <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3">
                <p className="text-xs text-slate-400">Live Listings</p>
                <p className="text-xl font-bold text-white">{products.length}</p>
              </div>
              <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3">
                <p className="text-xs text-slate-400">Campus Scope</p>
                <p className="text-xl font-bold text-white">Hostels + Dept</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">Books & Notes</span>
            <span className="chip">Electronics</span>
            <span className="chip">Cycle & Furniture</span>
            <span className="chip">Hostel Essentials</span>
          </div>
        </div>
        <div className="premium-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input className="premium-input pl-12" placeholder="Search for products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters((v) => !v)} className="btn-secondary flex items-center gap-2"><Filter className="w-5 h-5" /> Filters</button>
          </div>
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200/70 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select aria-label="Filter by category" className="premium-select" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select>
              <select aria-label="Filter by condition" className="premium-select" value={condition} onChange={(e) => setCondition(e.target.value)}>{conditions.map((x) => <option key={x}>{x}</option>)}</select>
              <select aria-label="Sort products" className="premium-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">{products.length} Products Available</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
      </div>
    </div>
  );
}
