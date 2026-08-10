'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DIVISION_ORDER, SEASON_DISTRIBUTIONS, type Division, type CharacterType } from '@/lib/data/characters';

interface Character {
  id: number;
  name: string;
  type: CharacterType;
  division: Division;
  image: string;
  leaguePoints: number;
  played: number;
  champion: number;
  last_round_played: number | null;
  pl_t1?: number | null;
  pl_t2?: number | null;
  pl_t3?: number | null;
  pl_t4?: number | null;
  pl_t5?: number | null;
  career_pl?: number;
  seasons_played?: number;
}

const divisionConfig: Record<Division, { color: string; icon: string }> = {
  Iridiscente: { color: '#dc2626', icon: 'rank_iri.webp' },
  Oro: { color: '#eab308', icon: 'rank_oro.webp' },
  Plata: { color: '#b2afa8', icon: 'rank_plata.webp' },
  Bronce: { color: '#ea580c', icon: 'rank_bronce.webp' },
  Ceniza: { color: '#4a3f31', icon: 'rank_ceniza.webp' },
};

function CharacterAvatar({ src, alt, size }: { src: string; alt: string; size: number }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(src.replace(/\.(webp|png)$/, (m) => (m === '.webp' ? '.png' : '.webp')));
      setHasError(true);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden border-2 border-zinc-700 flex-shrink-0" style={{ width: size, height: size }}>
      <Image src={imgSrc} alt={alt} fill className="object-cover" unoptimized onError={handleError} />
    </div>
  );
}

export default function PosicionesPage() {
  const [type, setType] = useState<CharacterType>('killer');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/characters?type=${type}`)
      .then((r) => r.json())
      .then((data: Character[]) => setCharacters(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const charactersByDivision = DIVISION_ORDER.reduce((acc, division) => {
    acc[division] = characters
      .filter((c) => c.division === division)
      .sort((a, b) => {
        if (b.leaguePoints !== a.leaguePoints) return b.leaguePoints - a.leaguePoints;
        const aSum = (a.pl_t1 ?? 0) + (a.pl_t2 ?? 0) + (a.pl_t3 ?? 0) + (a.pl_t4 ?? 0) + (a.pl_t5 ?? 0);
        const bSum = (b.pl_t1 ?? 0) + (b.pl_t2 ?? 0) + (b.pl_t3 ?? 0) + (b.pl_t4 ?? 0) + (b.pl_t5 ?? 0);
        if (bSum !== aSum) return bSum - aSum;
        if ((b.career_pl ?? 0) !== (a.career_pl ?? 0)) return (b.career_pl ?? 0) - (a.career_pl ?? 0);
        if ((b.seasons_played ?? 0) !== (a.seasons_played ?? 0)) return (b.seasons_played ?? 0) - (a.seasons_played ?? 0);
        return a.id - b.id;
      });
    return acc;
  }, {} as Record<Division, Character[]>);

  return (
    <main className="h-screen overflow-y-auto bg-zinc-950 text-zinc-100 px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Tabla de posiciones</h1>
          <p className="text-zinc-400">Liga Del Ente — Dead by Daylight</p>
        </div>
        <div className="flex flex-col items-end gap-1 mt-2 text-sm">
          <Link href="/historial" className="text-amber-400 hover:text-amber-300 underline whitespace-nowrap">
            Historial y récords →
          </Link>
          <Link href="/comandos" className="text-amber-400 hover:text-amber-300 underline whitespace-nowrap">
            Comandos del chat →
          </Link>
        </div>
      </div>

      <div className="flex gap-2 my-8">
        <button
          onClick={() => setType('killer')}
          className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors ${
            type === 'killer' ? 'bg-red-700 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Killers
        </button>
        <button
          onClick={() => setType('survivor')}
          className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors ${
            type === 'survivor' ? 'bg-green-700 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Survivors
        </button>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-4 py-3 mb-6 max-w-sm">
        <div className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
          Puntos de Liga
        </div>
        {type === 'killer' ? (
          <div className="flex flex-col gap-0.5 text-sm text-zinc-300">
            <span>PL = <span className="text-yellow-300 font-semibold">Kills</span> <span className="text-zinc-400">×</span> <span className="text-yellow-300 font-semibold">2</span> <span className="text-zinc-400">+</span> <span className="text-yellow-300 font-semibold">Hooks</span></span>
            <span className="text-zinc-500 text-xs">PL mostrado = promedio de las últimas 5 temporadas</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 text-sm text-zinc-300">
            <span><span className="text-green-400 font-semibold">Escape:</span> <span className="text-zinc-300">Gens</span> <span className="text-zinc-400">×</span> <span className="text-zinc-300">2</span> <span className="text-zinc-400">+</span> <span className="text-zinc-300">3</span></span>
            <span><span className="text-red-400 font-semibold">Muerte:</span> <span className="text-zinc-300">Gens</span> <span className="text-zinc-400">×</span> <span className="text-zinc-300">2</span></span>
            <span className="text-zinc-500 text-xs">PL mostrado = promedio de las últimas 5 temporadas</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-6 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: 'rgba(212, 175, 55, 0.5)' }} /> Playoff</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: 'rgba(22, 163, 74, 0.5)' }} /> Zona de ascenso</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: 'rgba(220, 38, 38, 0.5)' }} /> Zona de descenso</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block bg-green-400" /> Jugó esta ronda</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block bg-zinc-600" /> Pendiente esta ronda</span>
      </div>

      {loading && <div className="text-zinc-500">Cargando...</div>}

      {!loading && DIVISION_ORDER.map((division) => {
        const chars = charactersByDivision[division];
        if (chars.length === 0) return null;
        const config = divisionConfig[division];

        return (
          <div key={division} className="mb-8">
            <div
              className="flex items-center gap-3 mb-3 px-4 py-3 rounded-lg border-l-4"
              style={{ backgroundColor: `${config.color}30`, borderLeftColor: config.color }}
            >
              <Image src={`/img/${config.icon}`} alt={division} width={28} height={28} unoptimized className="object-contain" />
              <span className="font-bold uppercase tracking-wider text-lg text-white">{division}</span>
              <span className="text-white/60 text-sm ml-auto">({chars.length})</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-fixed text-sm border-separate border-spacing-y-1.5">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-3 py-1 w-10">#</th>
                    <th className="text-left px-3 py-1">Personaje</th>
                    <th className="text-center px-2 py-1 w-16">Ronda</th>
                    <th className="text-center px-2 py-1 w-14">S1</th>
                    <th className="text-center px-2 py-1 w-14">S2</th>
                    <th className="text-center px-2 py-1 w-14">S3</th>
                    <th className="text-center px-2 py-1 w-14">S4</th>
                    <th className="text-center px-2 py-1 w-14">S5</th>
                    <th className="text-center px-3 py-1 w-20">PL</th>
                  </tr>
                </thead>
                <tbody>
                  {chars.map((char, index) => {
                    const charsInDivision = chars.length;
                    const dist = SEASON_DISTRIBUTIONS[type]?.[division];
                    const isPlayoffZone = dist && dist.playOff > 0 && division === 'Iridiscente' && index < dist.playOff;
                    const isPromotionZone = !isPlayoffZone && dist && dist.ascend > 0 && index < dist.ascend;
                    const isRelegationZone = dist && dist.descend > 0 && index >= charsInDivision - dist.descend;
                    const rowBg = isPlayoffZone
                      ? 'bg-amber-500/10'
                      : isPromotionZone
                      ? 'bg-green-500/10'
                      : isRelegationZone
                      ? 'bg-red-500/10'
                      : 'bg-zinc-900/50';

                    return (
                      <tr key={char.id} className={rowBg}>
                        <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{index + 1}</td>
                        <td className="px-3 py-2 overflow-hidden">
                          <div className="flex items-center gap-3 min-w-0">
                            <CharacterAvatar src={`/${char.image}`} alt={char.name} size={40} />
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-semibold text-white uppercase truncate" title={char.name}>{char.name}</span>
                              {char.champion > 0 && (
                                <span className="flex items-center gap-0.5 bg-amber-500/20 border border-amber-400 rounded-full px-1.5 py-0.5 text-[10px] text-amber-400 font-bold flex-shrink-0">
                                  {char.champion} 🏆
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-2 py-2">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${
                              char.last_round_played !== null ? 'bg-green-400' : 'bg-zinc-600'
                            }`}
                            title={char.last_round_played !== null ? 'Ya jugó esta ronda' : 'Todavía no jugó esta ronda'}
                          />
                        </td>
                        {[char.pl_t1, char.pl_t2, char.pl_t3, char.pl_t4, char.pl_t5].map((val, i) => (
                          <td key={i} className="text-center px-2 py-2 text-zinc-400 font-mono">{val != null ? val : '—'}</td>
                        ))}
                        <td className="text-center px-3 py-2 font-black text-yellow-300 rounded-r-lg">{char.leaguePoints.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </main>
  );
}
