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

      <div className="bg-zinc-900 border border-lime-900/60 rounded-lg p-4 my-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-lime-400 mb-3">Cómo se ganan los puntos</h2>

        <div className="mb-4">
          <span className="text-amber-400 font-semibold text-sm">Presencia activa</span>
          <p className="text-zinc-400 text-sm mt-1">
            No hace falta ningún comando: por estar activo en el chat (mandar cualquier mensaje) se ganan +5 puntos
            gratis cada 10 minutos.
          </p>
        </div>

        <div>
          <span className="text-amber-400 font-semibold text-sm">Donaciones reales</span>
          <p className="text-zinc-400 text-sm mt-1">
            Los bits de Twitch, los Kicks de Kick y los regalos de TikTok se convierten en puntos automáticamente
            apenas se registra la donación — no hace falta ningún comando. La conversión está calibrada para que
            cada plataforma pague lo mismo por cada dólar real gastado (alrededor de 35 puntos por dólar), así que
            no importa qué plataforma uses para apoyar el canal, el chat gana parejo:
          </p>
          <ul className="text-zinc-400 text-sm mt-2 space-y-0.5 list-disc list-inside">
            <li>Bits (Twitch): ~0.58 puntos por bit</li>
            <li>Kicks (Kick): ~0.37 puntos por Kick</li>
            <li>Regalos de TikTok: ~0.88 puntos por diamante que recibe el streamer</li>
          </ul>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-8 space-y-7">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-sky-400 mb-3">Durante las partidas de la Liga</h2>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!favorito &lt;nombre del personaje&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Vota qué personaje quieres que salga sorteado a jugar la próxima ronda. Cada voto suma peso al
              sorteo de ese personaje (hasta triplicar sus chances si muchos chatters votan lo mismo), pero no lo
              asegura — sigue siendo al azar, solo le da más probabilidad.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: <code className="text-amber-400">!favorito jason</code> · funciona con el nombre completo o
              solo una parte (ej. &quot;payaso&quot; en vez de &quot;el payaso&quot;). Haz click en cualquier
              nombre de la lista de más abajo para copiar el comando listo para pegar en el chat.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!perk &lt;nombre de la perk&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Igual que <code className="text-amber-400">!favorito</code>, pero para votar qué perk lleva el
              personaje ya sorteado (o dejarle un slot vacío con &quot;vacio&quot;). Como hay muchas más perks que
              personajes, cada voto pesa más acá: hasta 5 veces más chances para la perk más votada.
            </p>
          </div>

          <div>
            <code className="text-amber-400 font-semibold">!prediccion &lt;killer|survivor&gt; &lt;win|draw|loss&gt; &lt;monto&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Apuesta entre 5 y 100 puntos a cómo le va a ir al personaje que acaba de salir sorteado: victoria,
              empate o derrota. La apuesta se abre sola apenas sale el personaje y dura 5 minutos. Si el resultado
              acierta, se paga el doble de lo apostado más la parte proporcional de los puntos de todos los que
              fallaron. Si no acierta, se pierde lo apostado — sin excepción, ni siquiera si nadie del chat acertó
              esa ronda.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: <code className="text-amber-400">!prediccion killer win 100</code>. Consulta el balance y
              los aciertos de cada chatter en{' '}
              <Link href="/viewers" className="text-amber-400 hover:text-amber-300 underline">Ranking del chat</Link>.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-violet-400 mb-3">Durante los Playoffs</h2>
          <p className="text-zinc-500 text-xs mb-3">
            Ninguna de las dos predicciones está siempre abierta: la transmisión las activa a mano desde el panel
            de playoffs cuando corresponde.
          </p>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!prediccionduelo &lt;personaje&gt; &lt;monto&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Apuesta entre 5 y 100 puntos a quién se queda con un cruce completo (semifinal o final), que se juega
              a mejor de 2 partidas. El ganador del cruce no es simplemente quien gane más partidas sueltas, sino
              quien sume más puntos de liga (PL) entre sus 2 juegos. Hay hasta 10 minutos desde que la transmisión
              abre la predicción. Mismas reglas de pago que <code className="text-amber-400">!prediccion</code>:
              el doble de lo apostado más la parte del pozo de los que fallaron si acierta, la apuesta perdida si no.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: <code className="text-amber-400">!prediccionduelo huntress 50</code> — no hace falta indicar
              killer o survivor, se detecta solo con el nombre del personaje.
            </p>
          </div>

          <div>
            <code className="text-amber-400 font-semibold">!prediccionpartida &lt;personaje&gt; &lt;win|draw|loss&gt; &lt;monto&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Es la versión playoff de <code className="text-amber-400">!prediccion</code>: apuesta al resultado
              (victoria, empate o derrota) de una sola partida puntual dentro de un cruce, no del cruce entero.
              Se abre por 5 minutos cuando la transmisión la activa para esa partida específica.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: <code className="text-amber-400">!prediccionpartida huntress win 50</code> — tampoco hace
              falta indicar killer o survivor acá.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-emerald-400 mb-3">Durante partidas normales (fuera de la Liga)</h2>
          <p className="text-zinc-500 text-xs mb-3">
            No está siempre abierta: la transmisión la activa a mano cuando arranca una partida suelta, fuera del
            sorteo de la Liga, e indica si esa partida es de killer o de survivor.
          </p>

          <div>
            <code className="text-amber-400 font-semibold">!prediccion &lt;win|draw|loss&gt; &lt;monto&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Apuesta entre 5 y 100 puntos a cómo le va a ir en esa partida suelta: victoria, empate (solo si es de
              killer) o derrota. No hace falta indicar killer o survivor — ya lo fija la transmisión al abrir la
              predicción. Dura 5 minutos desde que se activa; el pago se confirma recién cuando la transmisión
              carga el resultado real. Mismas reglas de pago que el resto: el doble de lo apostado más la parte
              proporcional del pozo de los que fallaron si acierta, la apuesta perdida si no.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: <code className="text-amber-400">!prediccion win 50</code>. Si por algún motivo hay una
              predicción de killer y otra de survivor abiertas al mismo tiempo, hay que aclarar cuál con{' '}
              <code className="text-amber-400">!prediccion killer win 50</code> o{' '}
              <code className="text-amber-400">!prediccion survivor win 50</code>.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-fuchsia-400 mb-3">En cualquier momento (chat general)</h2>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!puntos</code>
            <p className="text-zinc-400 text-sm mt-1">
              Responde en el chat con tu balance actual de puntos.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!duelo &lt;usuario&gt; &lt;monto&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Desafía a otro chatter a apostar entre 5 y 100 puntos, cara a cara. Esa persona tiene 2 minutos para
              responder con <code className="text-amber-400">!aceptar</code>; si no responde, el desafío expira y
              se devuelve la apuesta al que desafió. La probabilidad de ganar no es 50/50: cuanto menos patrimonio
              total tenga alguien comparado con su rival, más chances tiene (nunca menos de 15% ni más de 85% para
              ninguno de los dos) — así quien va perdiendo en la temporada tiene más con qué remontar.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!aceptar</code>
            <p className="text-zinc-400 text-sm mt-1">
              Acepta el duelo pendiente que alguien te haya iniciado. Al aceptar se resuelve al instante: quien
              gana se lleva las dos apuestas juntas.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!robar &lt;usuario&gt;</code>
            <p className="text-zinc-400 text-sm mt-1">
              Intenta robarle puntos a otro chatter que tenga al menos 50 puntos de balance. Usa la misma lógica de
              probabilidad que el duelo (entre 15% y 85%, según el patrimonio de cada uno). Si sale bien, se roba
              el 15% del balance de la víctima. Si lo atrapan, quien intentó robar pierde el 10% de su propio
              balance, que pasa a la víctima como compensación. Después de cada intento (salga bien o mal) hay que
              esperar 10 minutos para volver a intentarlo.
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Si la víctima tiene <code className="text-amber-400">!inmunidad</code> activa, el robo nunca se
              concreta, pero eso no te expone más de lo normal: se tira la misma probabilidad de siempre, y solo
              perdés puntos si ese tiro te hubiera atrapado igual robándole a alguien sin inmunidad. Si el tiro te
              daba éxito, el robo simplemente se bloquea y no pasa nada.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!bomba</code>
            <p className="text-zinc-400 text-sm mt-1">
              Arranca una bomba que empieza en las manos de quien la inició y se va pasando sola, al azar, entre
              chatters cada 8 a 20 segundos — nadie la puede pasar a propósito. Explota en un momento oculto de
              entre 45 segundos y 3 minutos desde que arrancó, así que nunca se sabe a quién le va a tocar. Quien
              la tenga en la mano cuando explota pierde el 20% de su balance, repartido en partes iguales entre
              todos los que la sostuvieron antes en esa misma ronda — como una papa caliente que paga a quienes se
              la sacaron de encima a tiempo.
            </p>
          </div>

          <div className="mb-4">
            <code className="text-amber-400 font-semibold">!ligadelente</code>
            <p className="text-zinc-400 text-sm mt-1">
              Responde con el link al sitio público de la Liga y a esta misma página de comandos, para compartirla
              con quien la pida en el chat.
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-5 mt-1">
            <span className="text-amber-400 font-semibold text-sm">Tienda de puntos</span>
            <p className="text-zinc-400 text-sm mt-1 mb-4">
              Gastá tus puntos en ventajas para la próxima ruleta de la Liga u otros beneficios.
            </p>

            <div className="mb-4">
              <code className="text-amber-400 font-semibold">!reroll personaje</code>
              <p className="text-zinc-400 text-sm mt-1">
                Por 150 puntos, vuelve a sortear el personaje que esté en pantalla en ese momento (Liga, playoffs
                o partida normal, la ruleta que esté activa). Se aplica solo, sin que la transmisión tenga que
                hacer nada, apenas unos segundos después de la compra — si ya había una predicción abierta para
                ese personaje, se pierde junto con el sorteo. Si nadie está en medio de una ronda (el resultado
                de la anterior ya se cargó y todavía no giró la próxima), queda en espera y se aplica apenas
                arranca ese siguiente giro. En cualquier modalidad (Liga, playoffs o partida normal) hay 1 minuto
                de margen desde que se revela la 4ª perk para usar el reroll — pasado ese minuto ya no se acepta,
                aunque el personaje siga en pantalla. Hay que esperar 10 minutos entre compras de reroll.
              </p>
            </div>

            <div className="mb-4">
              <code className="text-amber-400 font-semibold">!reroll perks</code>
              <p className="text-zinc-400 text-sm mt-1">
                Por 100 puntos, igual que <code className="text-amber-400">!reroll personaje</code> pero solo
                redibuja las 4 perks del personaje que está en pantalla, sin tocar el personaje ni la predicción
                abierta. Si ambos rerolls están pendientes a la vez, el de personaje se aplica primero. Hay que
                esperar 10 minutos entre compras de reroll.
              </p>
            </div>

            <div className="mb-4">
              <code className="text-amber-400 font-semibold">!potenciar &lt;perk&gt;</code>
              <p className="text-zinc-400 text-sm mt-1">
                Por 150 puntos, potencia una perk especial por 48 horas, aumentando sus chances de salir sorteada en
                ese lapso. Las opciones son: <code className="text-amber-400">me da igual</code>,{' '}
                <code className="text-amber-400">objeto de obsesion</code> y{' '}
                <code className="text-amber-400">vacio</code>.
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Ejemplo: <code className="text-amber-400">!potenciar objeto de obsesion</code>
              </p>
            </div>

            <div>
              <code className="text-amber-400 font-semibold">!inmunidad</code>
              <p className="text-zinc-400 text-sm mt-1">
                Por 120 puntos, comprá 24 horas de inmunidad: durante ese tiempo, ningún{' '}
                <code className="text-amber-400">!robar</code> en tu contra puede concretarse (aunque el que
                intenta robar puede igual perder puntos por su cuenta, con la misma probabilidad de siempre — la
                inmunidad no te vuelve un blanco más riesgoso para nadie), y si te toca sostener la{' '}
                <code className="text-amber-400">!bomba</code> cuando explota, no perdés puntos. Hay que esperar
                36 horas desde la última compra para volver a comprarla, así que siempre queda una ventana de al
                menos 12 horas sin inmunidad entre una compra y la siguiente.
              </p>
            </div>
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
