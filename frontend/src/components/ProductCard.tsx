import { Heart, Mail, Phone } from "lucide-react";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const conditionColors: Record<string, string> = {
    new: "bg-green-100 text-green-800",
    "like-new": "bg-blue-100 text-blue-800",
    good: "bg-yellow-100 text-yellow-800",
    fair: "bg-orange-100 text-orange-800",
    poor: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
      <div className="aspect-video bg-gray-200 overflow-hidden relative">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Heart className="w-16 h-16 text-gray-300" /></div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${conditionColors[product.condition]}`}>{product.condition}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
          <span className="text-xl font-bold text-blue-600 ml-2">Rs {Number(product.price).toLocaleString()}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
          <span className="text-xs text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        {product.seller && (
          <div className="space-y-2 mb-2">
            <div className="text-sm font-medium">{product.seller.fullName}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4" /> {product.seller.phone}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4" /> {product.seller.email}</div>
          </div>
        )}
      </div>
    </div>
  );
}
