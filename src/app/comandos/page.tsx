'use client';

import { useState } from 'react';
import Link from 'next/link';
import { killers, survivors, getAllPerks, EMPTY_PERK_LABEL } from '@/lib/data/characters';

function NameGrid({ names, prefix, onCopy }: { names: string[]; prefix: string; onCopy: (command: string) => void }) {
  const [query, setQueryLocal] = useState('');
  const sorted = [...names].sort((a, b) => a.localeCompare(b, 'es'));
  const filtered = query
    ? sorted.filter((n) => n.toLowerCase().includes(query.toLowerCase()))
    : sorted;

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQueryLocal(e.target.value)}
        className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white mb-3"
      />
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1 text-sm">
        {filtered.map((name) => (
          <li key={name}>
            <button
              onClick={() => onCopy(`${prefix} ${name}`)}
              className="text-left w-full truncate text-zinc-300 hover:text-amber-400 hover:bg-zinc-900 rounded px-1 -mx-1 transition-colors"
              title={name}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComandosPage() {
  const [toast, setToast] = useState<string | null>(null);

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); } catch { /* no-op */ }
      document.body.removeChild(textarea);
    }
    setToast(command);
    setTimeout(() => setToast(null), 1800);
  };

  const killerNames = killers.map((k) => k.name);
  const survivorNames = survivors.map((s) => s.name);
  const killerPerks = [...getAllPerks('killer').map((s) => s.replace(/_/g, ' ')), EMPTY_PERK_LABEL];
  const survivorPerks = [...getAllPerks('survivor').map((s) => s.replace(/_/g, ' ')), EMPTY_PERK_LABEL];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 lg:px-10 py-10 max-w-5xl mx-auto">
      <div className="mb-1">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Comandos del chat</h1>
        <p className="text-zinc-400">Liga Del Ente — Dead by Daylight</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-8 space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-sky-400 mb-2">Durante las partidas de la Liga</h2>
          <div className="space-y-1">
            <div>
              <code className="text-amber-400 font-semibold">!favorito &lt;nombre del personaje&gt;</code>
              <span className="text-zinc-400"> — vota el próximo personaje</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!perk &lt;nombre de la perk&gt;</code>
              <span className="text-zinc-400"> — vota una perk (incluye &quot;vacio&quot;)</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!prediccion &lt;killer|survivor&gt; &lt;win|draw|loss&gt; &lt;monto&gt;</code>
              <span className="text-zinc-400"> — apuesta puntos al resultado de la ronda actual</span>
            </div>
          </div>
          <div className="text-zinc-500 text-xs mt-2">
            Ejemplo: <code className="text-amber-400">!favorito jason</code> · funciona con el nombre completo o
            solo una parte (ej. &quot;payaso&quot; en vez de &quot;el payaso&quot;). Haz click en cualquier nombre
            de la lista para copiar el comando listo para pegar en el chat.
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            Ejemplo de predicción: <code className="text-amber-400">!prediccion killer win 100</code> — tienes 5
            minutos desde que sale el personaje para predecir. Consulta tu balance y aciertos en{' '}
            <Link href="/viewers" className="text-amber-400 hover:text-amber-300 underline">Ranking del chat</Link>.
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-violet-400 mb-2">Durante los Playoffs</h2>
          <div className="space-y-1">
            <div>
              <code className="text-amber-400 font-semibold">!prediccionduelo &lt;killer|survivor&gt; &lt;personaje&gt; &lt;monto&gt;</code>
              <span className="text-zinc-400"> — apuesta a quién gana un cruce (semifinal o final)</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!prediccionpartida &lt;killer|survivor&gt; &lt;personaje&gt; &lt;win|draw|loss&gt; &lt;monto&gt;</code>
              <span className="text-zinc-400"> — apuesta a cómo le va a un personaje en un juego puntual de su cruce (5 min)</span>
            </div>
          </div>
          <div className="text-zinc-500 text-xs mt-2">
            Ambas predicciones solo están disponibles cuando la transmisión las abre desde el panel de playoffs —
            el crossing tiene hasta 10 minutos para predecir quién gana, y cada juego individual 5 minutos.
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-fuchsia-400 mb-2">En cualquier momento (chat general)</h2>
          <div className="space-y-1">
            <div>
              <code className="text-amber-400 font-semibold">!duelo &lt;usuario&gt; &lt;monto&gt;</code>
              <span className="text-zinc-400"> — desafía a otro chatter a una apuesta 1 contra 1 (tiene 2 min para aceptar)</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!aceptar</code>
              <span className="text-zinc-400"> — acepta el duelo pendiente que te hicieron</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!robar &lt;usuario&gt;</code>
              <span className="text-zinc-400"> — intenta robarle puntos a otro chatter (cooldown de 10 min)</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!bomba</code>
              <span className="text-zinc-400"> — inicia una bomba que se pasa sola al azar entre chatters hasta que explota</span>
            </div>
            <div>
              <code className="text-amber-400 font-semibold">!ligadelente</code>
              <span className="text-zinc-400"> — recibe el link al sitio público de la Liga</span>
            </div>
          </div>
          <div className="text-zinc-500 text-xs mt-2">
            Duelo y robo: cuanto menos patrimonio tengas contra tu rival, más chances tienes de ganar/robar con éxito
            (nunca menos de 15% ni más de 85%). Solo se puede robar a quien tenga 50 puntos o más.
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            Bomba: se pasa sola cada 8-20 segundos y explota en un momento oculto entre 45 segundos y 3 minutos.
            Quien la tiene cuando explota pierde el 20% de su balance, repartido entre todos los que la sostuvieron
            antes en esa ronda.
          </div>
          <div className="text-zinc-500 text-xs mt-1">
            Además, por estar activo en el chat ganas +3 puntos gratis cada 10 minutos — no hace falta ningún comando.
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-red-500 uppercase tracking-wide mb-3">Killers</h2>
        <NameGrid names={killerNames} prefix="!favorito" onCopy={copyCommand} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-green-500 uppercase tracking-wide mb-3">Survivors</h2>
        <NameGrid names={survivorNames} prefix="!favorito" onCopy={copyCommand} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wide mb-3">Perks de Killer</h2>
        <NameGrid names={killerPerks} prefix="!perk" onCopy={copyCommand} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wide mb-3">Perks de Survivor</h2>
        <NameGrid names={survivorPerks} prefix="!perk" onCopy={copyCommand} />
      </section>

      {toast && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-sm px-4 py-2.5 rounded-lg shadow-xl">
          Copiado: <code className="text-amber-400">{toast}</code>
        </div>
      )}
    </main>
  );
}
