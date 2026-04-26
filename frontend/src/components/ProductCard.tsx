import { Heart, Mail, Phone } from "lucide-react";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const conditionColors: Record<string, string> = {
    new: "bg-emerald-100/90 text-emerald-800",
    "like-new": "bg-sky-100/90 text-sky-800",
    good: "bg-amber-100/90 text-amber-800",
    fair: "bg-orange-100/90 text-orange-800",
    poor: "bg-rose-100/90 text-rose-800",
  };

  return (
    <div className="premium-card overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/40">
      <div className="aspect-video bg-slate-800/80 overflow-hidden relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Heart className="w-16 h-16 text-slate-500" /></div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionColors[product.condition]}`}>{product.condition}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1">{product.title}</h3>
          <span className="text-xl font-bold text-indigo-600 ml-2">Rs {Number(product.price).toLocaleString()}</span>
        </div>
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700/70">
          <span className="text-xs text-slate-200 bg-slate-800/80 px-3 py-1 rounded-full">{product.category}</span>
          <span className="text-xs text-slate-400">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        {product.seller && (
          <div className="space-y-2 mb-2">
            <div className="text-sm font-medium text-slate-100">{product.seller.fullName}</div>
            <div className="flex items-center gap-2 text-sm text-slate-300"><Phone className="w-4 h-4" /> {product.seller.phone}</div>
            <div className="flex items-center gap-2 text-sm text-slate-300"><Mail className="w-4 h-4" /> {product.seller.email}</div>
          </div>
        )}
      </div>
    </div>
  );
}
