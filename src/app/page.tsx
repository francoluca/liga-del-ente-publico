import Link from 'next/link';

const socials = [
  {
    href: 'https://www.twitch.tv/franluca_',
    name: 'Twitch',
    color: 'hover:text-[#9146FF]',
    icon: (
      <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z" />
    ),
  },
  {
    href: 'https://www.youtube.com/@franluca',
    name: 'YouTube',
    color: 'hover:text-[#FF0000]',
    icon: (
      <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15V9l5.2 3Z" />
    ),
  },
  {
    href: 'https://kick.com/franluca',
    name: 'Kick',
    color: 'hover:text-[#53FC18]',
    icon: (
      <path d="M2 2h6v5h2V5h2V3h2V1h6v6h-2v2h-2v2h-2v2h2v2h2v2h2v6h-6v-2h-2v-2h-2v-2H8v5H2Z" />
    ),
  },
  {
    href: 'https://www.instagram.com/franlucatv',
    name: 'Instagram',
    color: 'hover:text-[#E1306C]',
    icon: (
      <path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47a4.9 4.9 0 0 0-1.77 1.15A4.9 4.9 0 0 0 2.53 5.45c-.25.64-.42 1.37-.47 2.43C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43a4.9 4.9 0 0 0 1.15 1.77 4.9 4.9 0 0 0 1.77 1.15c.64.25 1.37.42 2.43.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47a4.9 4.9 0 0 0 1.77-1.15 4.9 4.9 0 0 0 1.15-1.77c.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.15-1.77A4.9 4.9 0 0 0 18.55 2.53c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.86.34.47.18.8.4 1.15.75s.57.68.75 1.15c.13.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.21 1.5-.34 1.86-.18.47-.4.8-.75 1.15s-.68.57-1.15.75c-.36.13-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.21-1.86-.34a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.13-.36-.3-.88-.34-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.21-1.5.34-1.86.18-.47.4-.8.75-1.15s.68-.57 1.15-.75c.36-.13.88-.3 1.86-.34 1.05-.05 1.37-.06 4.04-.06ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z" />
    ),
  },
  {
    href: 'https://www.tiktok.com/@franlucatv',
    name: 'TikTok',
    color: 'hover:text-[#25F4EE]',
    icon: (
      <path d="M16.6 5.82c-.9-.98-1.4-2.27-1.4-3.62h-3.1v13.6a2.9 2.9 0 1 1-2.09-2.79v-3.15a6 6 0 1 0 5.19 5.94V9.4a6.9 6.9 0 0 0 4.1 1.33V7.6a4.85 4.85 0 0 1-2.7-1.78Z" />
    ),
  },
  {
    href: 'https://discord.gg/RYJjPVA9KG',
    name: 'Discord',
    color: 'hover:text-[#5865F2]',
    icon: (
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.9-1.52.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.26a18.3 18.3 0 0 0-5.48 0 12.6 12.6 0 0 0-.62-1.26.08.08 0 0 0-.08-.04c-1.7.3-3.36.8-4.9 1.52a.07.07 0 0 0-.03.03C.53 8.29-.32 12.08.1 15.83a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.11 13 13 0 0 1-1.88-.9.08.08 0 0 1 0-.13c.13-.1.25-.2.37-.3a.08.08 0 0 1 .08 0c3.93 1.8 8.19 1.8 12.07 0a.08.08 0 0 1 .08 0c.12.1.24.2.37.3a.08.08 0 0 1 0 .13 12.2 12.2 0 0 1-1.88.9.08.08 0 0 0-.04.11c.36.7.78 1.37 1.23 2a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6.01-3.03.08.08 0 0 0 .03-.06c.5-4.34-.83-8.1-3.51-11.43a.06.06 0 0 0-.03-.03ZM8.02 13.53c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.21 0 2.17 1.1 2.15 2.42 0 1.34-.95 2.42-2.15 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.21 0 2.17 1.1 2.15 2.42 0 1.34-.94 2.42-2.15 2.42Z" />
    ),
  },
];

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
        <div className="bg-zinc-900/70 rounded-2xl px-6 py-6 mb-36">
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

        <div className="flex items-center justify-center gap-5 mb-10">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              title={s.name}
              className={`text-zinc-400 transition-colors ${s.color}`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                {s.icon}
              </svg>
            </a>
          ))}
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
