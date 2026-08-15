import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Check } from "lucide-react";

export default function LookTitle({ upload, onRename }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(upload.caption || "");

  const save = async () => {
    setEditing(false);
    const next = value.trim();
    if (next !== (upload.caption || "")) await onRename(next);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Name this look"
          className="flex-1 min-w-0 bg-transparent border-b border-neutral-900 py-1 font-display text-lg focus:outline-none"
        />
        <button onClick={save} className="text-neutral-500 hover:text-neutral-900">
          <Check className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to={`/results?id=${upload.id}`} className="font-display text-lg hover:opacity-60 truncate">
        {upload.caption || "Untitled look"}
      </Link>
      <button
        onClick={() => setEditing(true)}
        aria-label="Rename look"
        className="text-neutral-400 hover:text-neutral-900 shrink-0"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}