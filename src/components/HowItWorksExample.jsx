import React from "react";
import ProductCard from "@/components/ProductCard";

const FIELDS = [
  "label",
  "category",
  "color",
  "material",
  "style_descriptors",
  "search_query",
  "confidence",
];

export default function HowItWorksExample({ upload, item, matches }) {
  const itemJson = FIELDS.reduce((acc, f) => {
    if (item[f] !== undefined && item[f] !== null) acc[f] = item[f];
    return acc;
  }, {});

  return (
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 pb-16 mb-16 border-b border-neutral-200 last:border-0 last:mb-0">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">1 · The photo</p>
        <img
          src={upload.image_url}
          alt={upload.caption || "look"}
          className="w-full aspect-[3/4] object-cover bg-neutral-100"
        />
        {upload.caption && (
          <p className="font-display italic text-sm mt-3 text-neutral-600">{upload.caption}</p>
        )}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
          2 · What the vision model returned
        </p>
        <pre className="font-mono text-[11px] leading-relaxed bg-neutral-900 text-neutral-100 p-5 overflow-x-auto">
{JSON.stringify(itemJson, null, 2)}
        </pre>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
          3 · What came back
        </p>
        {item.search_query && (
          <p className="font-mono text-[11px] bg-white border border-neutral-200 p-4 mb-6">
            {item.search_query}
          </p>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {matches.map((m) => (
            <ProductCard key={m.id} product={m} />
          ))}
        </div>
      </div>
    </div>
  );
}