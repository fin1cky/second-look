import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HowItWorksExample from "@/components/HowItWorksExample";

const isStrawTote = (label = "") => {
  const l = label.toLowerCase();
  return l.includes("straw") && l.includes("tote");
};

export default function HowItWorks() {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const uploads = await base44.entities.Upload.filter({ is_public: true }, "-created_date", 50);
      const found = [];
      for (const u of uploads) {
        const items = await base44.entities.DetectedItem.filter({ upload_id: u.id });
        const item = items.find((i) => isStrawTote(i.label));
        if (!item) continue;
        const ms = await base44.entities.ProductMatch.filter({ detected_item_id: item.id });
        found.push({ upload: u, item, matches: ms.sort((a, b) => a.price - b.price).slice(0, 6) });
        if (found.length === 2) break;
      }
      setExamples(found);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16">
      <h1 className="font-display text-4xl sm:text-6xl tracking-tight mb-4">How it works</h1>
      <p className="text-neutral-500 text-sm max-w-lg mb-14">
        Two real looks from the app, start to finish — photo, structured attributes, matches across
        merchants and price points.
      </p>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-xs uppercase tracking-[0.2em]">
          Loading examples
        </div>
      ) : examples.length === 0 ? (
        <p className="py-20 text-neutral-400 text-sm">No examples available right now.</p>
      ) : (
        examples.map((e) => (
          <HowItWorksExample key={e.item.id} upload={e.upload} item={e.item} matches={e.matches} />
        ))
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