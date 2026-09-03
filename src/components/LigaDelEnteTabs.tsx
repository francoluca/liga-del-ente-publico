'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/posiciones', label: 'Tabla de posiciones' },
  { href: '/historial', label: 'Historial y récords' },
];

export default function LigaDelEnteTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6 border-b border-zinc-800">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide border-b-2 -mb-px transition-colors ${
              active ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
