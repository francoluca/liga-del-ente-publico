import Link from 'next/link';

const links = [
  {
    href: '/posiciones',
    title: 'Liga del Ente',
    description: 'Tabla de posiciones en vivo, ascensos y descensos, más historial, rachas y récords.',
    color: 'border-amber-700/50 hover:border-amber-500',
  },
  {
    href: '/comandos',
    title: 'Comandos del chat',
    description: 'Todos los comandos que puedes usar en el chat.',
    color: 'border-red-700/50 hover:border-red-500',
  },
  {
    href: '/viewers',
    title: 'Ranking del chat',
    description: 'Ranking de puntos, aciertos y ganancias de quienes predicen en el chat.',
    color: 'border-blue-700/50 hover:border-blue-500',
  },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen text-zinc-100 flex items-center justify-center px-6 bg-zinc-950 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/img/fondoWeb.png')" }}
    >
      <div className="absolute inset-0 bg-zinc-950/50" />
      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-zinc-950/70 backdrop-blur-sm rounded-2xl px-6 py-6 mb-36">
          <h1 className="text-4xl font-bold uppercase tracking-wide text-center mb-4">Bienvenido al canal de Franluca</h1>
          <p className="text-zinc-300 text-center max-w-2xl mx-auto mb-2">
            Donde encontrarás streams de Dead by Daylight y algo más. Podrás ser parte de la comunidad
            participando en vivo desde el chat.
          </p>
          <p className="text-zinc-300 text-center max-w-2xl mx-auto">
            Acá vas a encontrar todo lo que el espectador puede consultar sobre el canal: la liga del ente
            entre personajes, los comandos que puedes usar en el chat y el ranking del chat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
