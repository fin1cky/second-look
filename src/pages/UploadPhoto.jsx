import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ImagePlus } from "lucide-react";

export default function UploadPhoto() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [authed, setAuthed] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setAuthed);
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    setError(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const upload = await base44.entities.Upload.create({
        image_url: file_url,
        caption,
        is_public: true,
        status: "analyzing",
      });
      await base44.functions.invoke("analyzeUpload", { upload_id: upload.id });
      navigate(`/results?id=${upload.id}`);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || "Could not analyze this photo.");
      setBusy(false);
    }
  };

  if (authed === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl mb-4">Sign in to upload</h1>
        <p className="text-neutral-500 text-sm mb-8">
          Browsing is open to everyone. Uploading your own photos needs an account.
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-[#d1490f] text-white px-7 py-3 text-[11px] uppercase tracking-[0.18em]"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 pt-16">
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">Upload a photo</h1>
      <p className="text-neutral-500 text-sm mb-10">
        A movie still, a social post, a street photo — anything with things in it.
      </p>

      {preview ? (
        <div className="space-y-6">
          <img src={preview} alt="uploading" className="w-full object-cover max-h-[60vh]" />
          {error ? (
            <div className="border border-[#d1490f] bg-[#faf2ec] p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d1490f] mb-2">Analysis failed</p>
              <p className="text-sm text-neutral-700">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setPreview(null);
                }}
                className="mt-4 text-[11px] uppercase tracking-[0.18em] border-b border-neutral-900 pb-0.5"
              >
                Try another photo
              </button>
            </div>
          ) : (
            <p className="text-center text-xs uppercase tracking-[0.2em] text-neutral-400 animate-pulse">
              {busy ? "Analyzing photo" : "Ready"}
            </p>
          )}
        </div>
      ) : (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors cursor-pointer aspect-[4/3] flex flex-col items-center justify-center gap-4 bg-white"
          >
            <ImagePlus className="w-8 h-8 text-neutral-400" strokeWidth={1.2} />
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Drag or tap to add a photo</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption (optional)"
            className="mt-6 w-full bg-transparent border-b border-neutral-300 py-3 text-sm focus:outline-none focus:border-neutral-900"
          />
        </>
      )}
    </div>
  );
}