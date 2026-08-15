import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export default function DiscoverTile({ upload, count }) {
  return (
    <Link
      to={`/results?id=${upload.id}`}
      className="mb-3 block break-inside-avoid group relative overflow-hidden bg-neutral-100"
    >
      <Image
        src={upload.image_url}
        alt={upload.caption || "look"}
        className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] tracking-[0.12em] text-neutral-800">
        {count} {count === 1 ? "ITEM" : "ITEMS"}
      </span>
      {upload.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white text-sm leading-snug">{upload.caption}</p>
        </div>
      )}
    </Link>
  );
}