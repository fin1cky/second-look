import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Switch } from "@/components/ui/switch";

export default function MyLooks() {
  const [authed, setAuthed] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [labels, setLabels] = useState({});

  useEffect(() => {
    (async () => {
      const ok = await base44.auth.isAuthenticated();
      setAuthed(ok);
      if (!ok) return;
      const me = await base44.auth.me();
      const list = await base44.entities.Upload.filter({ created_by_id: me.id }, "-created_date");
      setUploads(list);
      const items = await base44.entities.DetectedItem.filter({
        upload_id: { $in: list.map((u) => u.id) },
      });
      const grouped = {};
      items.forEach((i) => {
        grouped[i.upload_id] = [...(grouped[i.upload_id] || []), i.label];
      });
      setLabels(grouped);
    })();
  }, []);

  const toggle = async (upload) => {
    const next = !upload.is_public;
    setUploads((prev) => prev.map((u) => (u.id === upload.id ? { ...u, is_public: next } : u)));
    await base44.entities.Upload.update(upload.id, { is_public: next });
  };

  if (authed === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl mb-6">Your looks live here</h1>
        <Link
          to={`/login?returnTo=${encodeURIComponent("/my-looks")}`}
          className="inline-block bg-[#d1490f] text-white px-7 py-3 text-[11px] uppercase tracking-[0.18em]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16">
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-12">My looks</h1>
      {uploads.length === 0 ? (
        <p className="text-neutral-400 text-sm">Nothing here yet. Upload a photo to get started.</p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {uploads.map((u) => (
            <li key={u.id} className="flex items-center gap-5 py-5">
              <Link to={`/results?id=${u.id}`} className="shrink-0">
                <img src={u.image_url} alt="" className="w-20 h-24 object-cover bg-neutral-100" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/results?id=${u.id}`} className="font-display text-lg hover:opacity-60">
                  {u.caption || "Untitled look"}
                </Link>
                {!u.caption && (labels[u.id]?.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {labels[u.id].slice(0, 4).map((l, idx) => (
                      <span
                        key={idx}
                        className="border border-neutral-300 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-600"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400 mt-1">{u.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                  {u.is_public ? "Public" : "Private"}
                </span>
                <Switch checked={!!u.is_public} onCheckedChange={() => toggle(u)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}