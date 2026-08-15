import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus } from "lucide-react";

const links = [
  { to: "/", label: "Discover" },
  { to: "/my-looks", label: "My looks" },
  { to: "/how-it-works", label: "How it works" },
];

export default function Layout() {
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (ok) => {
      if (ok) setUser(await base44.auth.me());
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-neutral-900 font-body">
      <header className="sticky top-0 z-40 bg-[#fbfaf8]/90 backdrop-blur border-b border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="font-display text-xl tracking-tight">
            Second&nbsp;Look
          </Link>
          <nav className="hidden sm:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[11px] uppercase tracking-[0.18em] transition ${
                  pathname === l.to ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/upload"
              className="hidden sm:inline-flex items-center gap-2 bg-[#d1490f] text-white px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:opacity-90 transition"
            >
              Upload
            </Link>
            {user ? (
              <button
                onClick={() => base44.auth.logout()}
                className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 hover:text-neutral-900"
              >
                Sign out
              </button>
            ) : (
              <Link
                to={`/login?returnTo=${encodeURIComponent(pathname)}`}
                className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 hover:text-neutral-900"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <Link
        to="/upload"
        className="sm:hidden fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-[#d1490f] text-white flex items-center justify-center shadow-lg active:scale-95 transition"
        aria-label="Upload a photo"
      >
        <Plus className="w-6 h-6" />
      </Link>

      <footer className="mt-24 border-t border-neutral-200 py-10 text-center">
        <p className="font-display italic text-neutral-400">Find what's in the photo. At every price.</p>
      </footer>
    </div>
  );
}