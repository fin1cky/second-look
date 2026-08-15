import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
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

export default function HowItWorks() {
  const [upload, setUpload] = useState(null);
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const uploads = await base44.entities.Upload.filter({ is_public: true }, "-created_date", 5);
      for (const u of uploads) {
        const items = await base44.entities.DetectedItem.filter({ upload_id: u.id });
        for (const i of items) {
          const ms = await base44.entities.ProductMatch.filter({ detected_item_id: i.id });
          if (ms.length > 0) {
            setUpload(u);
            setItem(i);
            setMatches(ms.sort((a, b) => a.price - b.price).slice(0, 6));
            setLoading(false);
            return;
          }
        }
      }
      setLoading(false);
    })();
  }, []);

  const itemJson = item
    ? FIELDS.reduce((acc, f) => {
        if (item[f] !== undefined && item[f] !== null) acc[f] = item[f];
        return acc;
      }, {})
    : null;

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16">
      <h1 className="font-display text-4xl sm:text-6xl tracking-tight mb-4">How it works</h1>
      <p className="text-neutral-500 text-sm max-w-lg mb-14">
        One real look from the app, start to finish — photo, structured attributes, matches across
        merchants and price points.
      </p>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-xs uppercase tracking-[0.2em]">
          Loading example
        </div>
      ) : !item ? (
        <p className="py-20 text-neutral-400 text-sm">
          No analyzed public looks yet — upload a photo to see the pipeline in action.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
              1 · The photo
            </p>
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
      )}

      <p className="max-w-2xl mt-16 text-neutral-600 leading-relaxed text-[15px]">
        Attributes are extracted from the photo first — colour, material, silhouette, category —
        rather than matching pixels. Those attributes are converted into a structured search run
        across merchant catalogs, the results are reranked by an LLM for category accuracy, and what
        survives is presented across price points.
      </p>
    </div>
  );
}