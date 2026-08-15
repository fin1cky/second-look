import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import DiscoverTile from "@/components/DiscoverTile";

export default function Discover() {
  const [uploads, setUploads] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const list = await base44.entities.Upload.filter({ is_public: true }, "-created_date", 3);
    setUploads(list);
    const items = await base44.entities.DetectedItem.list("-created_date", 500);
    const map = {};
    items.forEach((i) => (map[i.upload_id] = (map[i.upload_id] || 0) + 1));
    setCounts(map);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsubscribe = base44.entities.Upload.subscribe(() => load());
    return unsubscribe;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-12 sm:pt-20">
      <header className="max-w-2xl mb-12 sm:mb-16">
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight">
          Find what's in the photo.
          <br />
          <span className="italic text-[#d1490f]">At every price.</span>
        </h1>
        <p className="mt-5 text-neutral-500 text-sm sm:text-base max-w-md leading-relaxed">
          A lookbook of photos other people have taken apart, piece by piece. Tap any look to see
          what's in it and where to find it, at every price point.
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-sm tracking-widest uppercase">Loading</div>
      ) : uploads.length === 0 ? (
        <div className="py-20 text-center text-neutral-400">No public looks yet.</div>
      ) : (
        <section>
          <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight">This week's looks</h2>
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Selected</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
            {uploads.map((u) => (
              <DiscoverTile key={u.id} upload={u} count={counts[u.id] || 0} />
            ))}
          </div>
          <p className="mt-8 text-xs text-neutral-400 leading-relaxed max-w-md">
            Public looks from people using Second Look appear here. Share one of your own from My
            looks.
          </p>
        </section>
      )}
    </div>
  );
}