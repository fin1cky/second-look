import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ItemChips from "@/components/ItemChips";
import ProductCard from "@/components/ProductCard";

export default function Results() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [upload, setUpload] = useState(null);
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const u = await base44.entities.Upload.get(id);
      setUpload(u);
      const list = await base44.entities.DetectedItem.filter({ upload_id: id });
      setItems(list);
      if (list.length) selectItem(list[0]);
    })();
  }, [id]);

  const selectItem = async (item) => {
    setActiveId(item.id);
    setMatching(true);
    setMatches([]);
    setError(null);
    try {
      let found = await base44.entities.ProductMatch.filter({ detected_item_id: item.id });
      if (found.length === 0) {
        await base44.functions.invoke("matchItem", { detected_item_id: item.id });
        found = await base44.entities.ProductMatch.filter({ detected_item_id: item.id });
      }
      setMatches(found);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Could not reach the matching service.");
    }
    setMatching(false);
  };

  const primary = matches.filter((m) => m.tier === "primary").sort((a, b) => a.price - b.price);
  const alternatives = matches
    .filter((m) => m.tier === "mid" || m.tier === "budget")
    .sort((a, b) => a.price - b.price);

  if (!upload) {
    return <div className="py-32 text-center text-neutral-400 text-xs uppercase tracking-[0.2em]">Loading look</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-8 pt-10 sm:pt-16">
      <div className="max-h-[70vh] overflow-hidden bg-neutral-100 flex justify-center">
        <img src={upload.image_url} alt={upload.caption || "look"} className="max-h-[70vh] object-contain" />
      </div>
      {upload.caption && (
        <p className="font-display italic text-lg mt-4 text-neutral-700">{upload.caption}</p>
      )}

      <div className="mt-8 mb-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3">In this photo</p>
        <ItemChips items={items} activeId={activeId} onSelect={selectItem} />
      </div>

      {error ? (
        <div className="mb-16 border border-[#d1490f] bg-[#faf2ec] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d1490f] mb-2">Match failed</p>
          <p className="text-sm text-neutral-700">{error}</p>
          <button
            onClick={() => items.find((i) => i.id === activeId) && selectItem(items.find((i) => i.id === activeId))}
            className="mt-4 text-[11px] uppercase tracking-[0.18em] border-b border-neutral-900 pb-0.5"
          >
            Try again
          </button>
        </div>
      ) : matching ? (
        <div className="py-16 text-center text-neutral-400 text-xs uppercase tracking-[0.2em]">
          Searching
        </div>
      ) : (
        <>
          <section className="mb-20">
            <h2 className="font-display text-2xl sm:text-3xl">Shop the look</h2>
            <p className="text-xs text-neutral-500 mt-2 mb-8">Matches across brands and price points.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {primary.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {alternatives.length > 0 && (
            <section className="mb-20">
              <h2 className="font-display text-2xl sm:text-3xl">More like this</h2>
              <p className="text-xs text-neutral-500 mt-2 mb-8">Matches across brands and price points.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                {alternatives.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}