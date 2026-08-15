import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HowItWorksExample from "@/components/HowItWorksExample";

const EXAMPLE_UPLOAD_ID = "6a80cc8894147841f90003e0";

export default function HowItWorks() {
  const [example, setExample] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const upload = await base44.entities.Upload.get(EXAMPLE_UPLOAD_ID);
      const items = await base44.entities.DetectedItem.filter({ upload_id: EXAMPLE_UPLOAD_ID });
      const item = items.find((i) => {
        const l = (i.label || "").toLowerCase();
        return l.includes("straw") && l.includes("tote");
      });
      if (item) {
        const ms = await base44.entities.ProductMatch.filter({ detected_item_id: item.id });
        const matches = ms
          .filter((m) => (m.title || "").toLowerCase().includes("straw tote"))
          .sort((a, b) => a.price - b.price)
          .slice(0, 2);
        setExample({ upload, item, matches });
      }
      setLoading(false);
    })();
  }, []);

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
      ) : !example ? (
        <p className="py-20 text-neutral-400 text-sm">No example available right now.</p>
      ) : (
        <HowItWorksExample
          upload={example.upload}
          item={example.item}
          matches={example.matches}
        />
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