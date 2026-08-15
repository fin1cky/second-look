import React from "react";
import { Image } from "@/components/ui/image";
import { ExternalLink } from "lucide-react";

export default function ProductCard({ product, accent = false, savingsPercent = null }) {
  return (
    <div className="group">
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        {product.is_secondhand && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-700">
            Secondhand
          </span>
        )}
        {savingsPercent !== null && (
          <span className="absolute top-3 right-3 bg-[#d1490f] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
            {savingsPercent}% less
          </span>
        )}
      </div>
      <div className="pt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{product.brand}</p>
        <p className="text-sm text-neutral-900 leading-snug">{product.title}</p>
        <p className={`text-sm ${accent ? "text-[#d1490f] font-medium" : "text-neutral-900"}`}>
          {product.currency === "USD" ? "$" : ""}
          {Number(product.price).toFixed(0)}
          <span className="text-neutral-400 text-xs"> · {product.shop_name}</span>
        </p>
        <a
          href={product.product_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-[11px] uppercase tracking-[0.16em] border-b border-neutral-900 pb-0.5 hover:opacity-60 transition"
        >
          View <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}