import React from "react";

const exampleJson = {
  label: "olive utility jacket",
  category: "outerwear",
  color: "olive green",
  material: "cotton twill",
  style_descriptors: ["boxy fit", "four patch pockets", "military-inspired", "unlined"],
  search_query: "olive cotton twill utility jacket boxy patch pockets",
  confidence: 0.91,
};

const products = [
  { title: "Field Utility Jacket", brand: "Alex Mill", price: "$285", shop: "Alex Mill" },
  { title: "Cotton Twill Overshirt", brand: "Uniqlo U", price: "$69", shop: "Uniqlo", cheap: true },
  { title: "Vintage M-65 Liner Jacket", brand: "Surplus", price: "$48", shop: "Etsy", cheap: true },
];

export default function HowItWorks() {
  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16">
      <h1 className="font-display text-4xl sm:text-6xl tracking-tight mb-4">How it works</h1>
      <p className="text-neutral-500 text-sm max-w-lg mb-14">
        One worked example, start to finish — photo, structured attributes, products.
      </p>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">1 · The photo</p>
          <img
            src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80"
            alt="source"
            className="w-full aspect-[3/4] object-cover bg-neutral-100"
          />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
            2 · What the vision model returned
          </p>
          <pre className="font-mono text-[11px] leading-relaxed bg-neutral-900 text-neutral-100 p-5 overflow-x-auto">
{JSON.stringify(exampleJson, null, 2)}
          </pre>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
            3 · The query, and what came back
          </p>
          <p className="font-mono text-[11px] bg-white border border-neutral-200 p-4 mb-6">
            {exampleJson.search_query}
          </p>
          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.title} className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">{p.brand}</p>
                  <p className="text-sm">{p.title}</p>
                </div>
                <span className={`text-sm ${p.cheap ? "text-[#d1490f]" : ""}`}>{p.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="max-w-2xl mt-16 text-neutral-600 leading-relaxed text-[15px]">
        Item attributes are extracted from the photo first — colour, material, silhouette, category —
        rather than matching pixels. Those attributes are then converted into a structured catalog
        query, which is what retail search engines actually understand. Finally the same query is run
        again with a price ceiling below the best original result, which is how the cheaper
        alternatives — including secondhand listings — are found.
      </p>
    </div>
  );
}