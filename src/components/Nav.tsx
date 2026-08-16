'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/posiciones', label: 'Posiciones' },
  { href: '/historial', label: 'Historial' },
  { href: '/comandos', label: 'Comandos' },
  { href: '/viewers', label: 'Ranking del Chat' },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <nav className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
          onClick={() => setOpen(false)}
        >
          <Image src="/img/logo_liga_ente.png" alt="Liga Del Ente" width={160} height={48} unoptimized className="h-10 w-auto object-contain" />
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                  active ? 'bg-amber-500/15 text-amber-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="sm:hidden p-2 -mr-2 text-zinc-300 hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-zinc-800 bg-zinc-950 px-6 py-3 flex flex-col gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${
                  active ? 'bg-amber-500/15 text-amber-400' : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
