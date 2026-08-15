import React from "react";

export default function ItemChips({ items, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs tracking-wide transition-all duration-300 ${
              active
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}