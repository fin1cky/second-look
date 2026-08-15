import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import DiscoverTile from "@/components/DiscoverTile";

export default function Discover() {
  const [uploads, setUploads] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await base44.entities.Upload.filter({ is_public: true }, "-created_date", 60);
      setUploads(list);
      const items = await base44.entities.DetectedItem.list("-created_date", 500);
      const map = {};
      items.forEach((i) => (map[i.upload_id] = (map[i.upload_id] || 0) + 1));
      setCounts(map);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-12 sm:pt-20">
      <header className="max-w-2xl mb-12 sm:mb-16">
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight">
          Find what's in the photo.
          <br />
          <span className="italic text-[#d1490f]">Then find it cheaper.</span>
        </h1>
        <p className="mt-5 text-neutral-500 text-sm sm:text-base max-w-md leading-relaxed">
          A lookbook of photos other people have taken apart, piece by piece. Tap any look to see
          what's in it and what it costs — twice.
        </p>
      </header>

      {loading ? (
        <div className="py-20 text-center text-neutral-400 text-sm tracking-widest uppercase">Loading</div>
      ) : uploads.length === 0 ? (
        <div className="py-20 text-center text-neutral-400">No public looks yet.</div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
          {uploads.map((u) => (
            <DiscoverTile key={u.id} upload={u} count={counts[u.id] || 0} />
          ))}
        </div>
      )}
    </div>
  );
}