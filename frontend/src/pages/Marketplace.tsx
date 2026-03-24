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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input className="w-full pl-12 pr-4 py-3 border rounded-lg" placeholder="Search for products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters((v) => !v)} className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg"><Filter className="w-5 h-5" /> Filters</button>
          </div>
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="px-4 py-2 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((x) => <option key={x}>{x}</option>)}</select>
              <select className="px-4 py-2 border rounded-lg" value={condition} onChange={(e) => setCondition(e.target.value)}>{conditions.map((x) => <option key={x}>{x}</option>)}</select>
              <select className="px-4 py-2 border rounded-lg" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">{products.length} Products Available</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
      </div>
    </div>
  );
}
