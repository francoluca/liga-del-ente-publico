import Link from 'next/link';

const links = [
  {
    href: '/posiciones',
    title: 'Tabla de posiciones',
    description: 'Rankings por división, ascensos, descensos y playoff — en vivo.',
    color: 'border-amber-700/50 hover:border-amber-500',
  },
  {
    href: '/historial',
    title: 'Historial y récords',
    description: 'Rachas, líderes de PL, Hall of Fame y el historial de cada personaje.',
    color: 'border-green-700/50 hover:border-green-500',
  },
  {
    href: '/comandos',
    title: 'Comandos del chat',
    description: 'Todos los nombres exactos para votar con !favorito y !perk.',
    color: 'border-red-700/50 hover:border-red-500',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-center mb-2">Liga Del Ente</h1>
        <p className="text-zinc-400 text-center mb-10">Todo lo que el espectador puede consultar, en un solo lugar.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`bg-zinc-900/70 border rounded-xl p-6 transition-colors ${l.color}`}
            >
              <div className="text-lg font-bold uppercase tracking-wide text-white mb-2">{l.title}</div>
              <div className="text-sm text-zinc-400">{l.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
