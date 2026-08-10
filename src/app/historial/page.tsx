'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type CharacterType } from '@/lib/data/characters';

interface MatchRecord {
  id: number;
  character_id: number;
  character_name: string;
  result: 'win' | 'draw' | 'loss';
  kills: number | null;
  hooks: number | null;
  escapes: number | null;
  generators: number | null;
  match_pl: number;
  division: string;
  played_at: number;
}

interface RecordsData {
  totalPrimaryLeader: { id: number; name: string; image: string; value: number } | null;
  totalSecondaryLeader: { id: number; name: string; image: string; value: number } | null;
  longestWinStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null;
  longestLossStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null;
  currentStreaks: { characterId: number; characterName: string; image: string | null; streak: number; streakType: 'win' | 'loss' }[];
  careerLeaders: { id: number; name: string; image: string; career_pl: number }[];
  championLeaders: { id: number; name: string; image: string; champion: number }[];
  totalMatchesLogged: number;
}

interface CharacterOption {
  id: number;
  name: string;
  image: string;
}

const resultLabel: Record<string, string> = { win: 'Victoria', draw: 'Empate', loss: 'Derrota' };
const resultColor: Record<string, string> = {
  win: 'text-green-400',
  draw: 'text-yellow-400',
  loss: 'text-red-400',
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 ${className}`}>
      <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">{title}</div>
      {children}
    </div>
  );
}

function Avatar({ image, alt, size = 40 }: { image: string | null | undefined; alt: string; size?: number }) {
  const [src, setSrc] = useState(image ? `/${image}` : null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setSrc(image ? `/${image}` : null);
    setHasError(false);
  }, [image]);

  if (!src) return null;

  const handleError = () => {
    if (!hasError) {
      setSrc(src.replace(/\.(webp|png)$/, (m) => (m === '.webp' ? '.png' : '.webp')));
      setHasError(true);
    }
  };

  return (
    <div
      className="relative rounded-full overflow-hidden flex-shrink-0 border border-zinc-700 bg-zinc-800"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill className="object-cover" unoptimized onError={handleError} />
    </div>
  );
}

function StreakSpotlight({
  title,
  data,
  tone,
  noun,
}: {
  title: string;
  data: { characterId: number; characterName: string; image: string | null; streak: number } | null;
  tone: 'win' | 'loss';
  noun: string;
}) {
  const toneClasses = tone === 'win'
    ? { border: 'border-green-700/60', bg: 'from-green-950/60 to-zinc-900/70', text: 'text-green-400' }
    : { border: 'border-red-700/60', bg: 'from-red-950/60 to-zinc-900/70', text: 'text-red-400' };

  return (
    <div className={`bg-gradient-to-br ${toneClasses.bg} border ${toneClasses.border} rounded-xl p-6 flex items-center gap-5`}>
      {data ? (
        <>
          <Avatar image={data.image} alt={data.characterName} size={88} />
          <div>
            <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">{title}</div>
            <div className={`text-3xl font-black ${toneClasses.text}`}>{data.streak} {noun}</div>
            <div className="text-lg text-zinc-200 font-semibold">{data.characterName}</div>
          </div>
        </>
      ) : (
        <div>
          <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-1">{title}</div>
          <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>
        </div>
      )}
    </div>
  );
}

export default function HistorialPage() {
  const [type, setType] = useState<CharacterType>('killer');
  const [records, setRecords] = useState<RecordsData | null>(null);
  const [characters, setCharacters] = useState<CharacterOption[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    setSelectedCharacterId(null);
    setMatches([]);
    fetch(`/api/records?type=${type}`).then((r) => r.json()).then(setRecords).catch(console.error);
    fetch(`/api/characters?type=${type}`)
      .then((r) => r.json())
      .then((data: { id: number; name: string; image: string }[]) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name, 'es'));
        setCharacters(sorted);
      })
      .catch(console.error);
  }, [type]);

  useEffect(() => {
    if (!selectedCharacterId) {
      setMatches([]);
      return;
    }
    setLoadingMatches(true);
    fetch(`/api/matches?type=${type}&characterId=${selectedCharacterId}&limit=50`)
      .then((r) => r.json())
      .then((data) => setMatches(data.matches || []))
      .catch(console.error)
      .finally(() => setLoadingMatches(false));
  }, [selectedCharacterId, type]);

  const primaryLabel = type === 'killer' ? 'Kills' : 'Escapes';
  const secondaryLabel = type === 'killer' ? 'Cuelgues' : 'Generadores';

  const selectedCharacterStreak = useMemo(() => {
    if (!records || !selectedCharacterId) return null;
    return records.currentStreaks.find((s) => s.characterId === selectedCharacterId) ?? null;
  }, [records, selectedCharacterId]);

  const selectedCharacter = useMemo(
    () => characters.find((c) => c.id === selectedCharacterId) ?? null,
    [characters, selectedCharacterId]
  );

  return (
    <main className="h-screen overflow-y-auto bg-zinc-950 text-zinc-100 px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Historial y récords</h1>
          <p className="text-zinc-400">Liga Del Ente — Dead by Daylight</p>
        </div>
        <div className="flex flex-col items-end gap-1 mt-2 text-sm">
          <Link href="/posiciones" className="text-amber-400 hover:text-amber-300 underline whitespace-nowrap">
            Tabla de posiciones →
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

      {records && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <StreakSpotlight
              title="Racha ganadora más larga (histórica)"
              data={records.longestWinStreakEver}
              tone="win"
              noun="victorias seguidas"
            />
            <StreakSpotlight
              title="Racha perdedora más larga (histórica)"
              data={records.longestLossStreakEver}
              tone="loss"
              noun="derrotas seguidas"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <Card title={`Más ${primaryLabel.toLowerCase()} en total`}>
              {records.totalPrimaryLeader ? (
                <div className="flex items-center gap-4">
                  <Avatar image={records.totalPrimaryLeader.image} alt={records.totalPrimaryLeader.name} size={56} />
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{records.totalPrimaryLeader.value}</div>
                    <div className="text-sm text-zinc-300">{records.totalPrimaryLeader.name}</div>
                  </div>
                </div>
              ) : <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>}
            </Card>

            <Card title={`Más ${secondaryLabel.toLowerCase()} en total`}>
              {records.totalSecondaryLeader ? (
                <div className="flex items-center gap-4">
                  <Avatar image={records.totalSecondaryLeader.image} alt={records.totalSecondaryLeader.name} size={56} />
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{records.totalSecondaryLeader.value}</div>
                    <div className="text-sm text-zinc-300">{records.totalSecondaryLeader.name}</div>
                  </div>
                </div>
              ) : <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>}
            </Card>

            <Card title="Líderes de PL de carrera">
              {records.careerLeaders.length > 0 ? (
                <ol className="text-sm text-zinc-300 space-y-3">
                  {records.careerLeaders.map((c, i) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="text-zinc-500 w-4">{i + 1}.</span>
                      <Avatar image={c.image} alt={c.name} size={36} />
                      <span>{c.name} — <span className="text-amber-400 font-semibold">{c.career_pl}</span></span>
                    </li>
                  ))}
                </ol>
              ) : <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>}
            </Card>

            <Card title="Hall of Fame (más campeonatos)">
              {records.championLeaders.length > 0 ? (
                <ol className="text-sm text-zinc-300 space-y-3">
                  {records.championLeaders.map((c, i) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="text-zinc-500 w-4">{i + 1}.</span>
                      <Avatar image={c.image} alt={c.name} size={36} />
                      <span>{c.name} — <span className="text-amber-400 font-semibold">{c.champion} 🏆</span></span>
                    </li>
                  ))}
                </ol>
              ) : <div className="text-zinc-600 italic text-sm">Nadie fue campeón todavía</div>}
            </Card>
          </div>

          {records.currentStreaks.length > 0 && (
            <div className="mb-8">
              <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">En racha ahora mismo</div>
              <div className="flex flex-wrap gap-3">
                {records.currentStreaks.map((s) => (
                  <span
                    key={s.characterId}
                    className={`flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-sm border ${
                      s.streakType === 'win'
                        ? 'bg-green-900/30 border-green-700 text-green-300'
                        : 'bg-red-900/30 border-red-700 text-red-300'
                    }`}
                  >
                    <Avatar image={s.image} alt={s.characterName} size={30} />
                    {s.characterName}: {s.streak} {s.streakType === 'win' ? 'victorias' : 'derrotas'} seguidas
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="border-t border-zinc-800 pt-8">
        <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">Buscar historial de un personaje</div>
        <select
          value={selectedCharacterId ?? ''}
          onChange={(e) => setSelectedCharacterId(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white mb-4"
        >
          <option value="">— Seleccioná un personaje —</option>
          {characters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {selectedCharacter && (
          <div className="flex items-center gap-4 mb-4">
            <Avatar image={selectedCharacter.image} alt={selectedCharacter.name} size={72} />
            <div className="text-2xl font-bold text-white">{selectedCharacter.name}</div>
          </div>
        )}

        {selectedCharacterStreak && (
          <div className="mb-4 text-sm text-zinc-300">
            Racha actual: <span className={selectedCharacterStreak.streakType === 'win' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
              {selectedCharacterStreak.streak} {selectedCharacterStreak.streakType === 'win' ? 'victorias' : 'derrotas'} seguidas
            </span>
          </div>
        )}

        {loadingMatches && <div className="text-zinc-500 text-sm">Cargando...</div>}

        {!loadingMatches && selectedCharacterId && matches.length === 0 && (
          <div className="text-zinc-600 italic text-sm">Este personaje todavía no tiene partidas registradas en el historial.</div>
        )}

        {matches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <th className="text-left py-2 pr-4">Fecha</th>
                  <th className="text-left py-2 pr-4">Resultado</th>
                  <th className="text-left py-2 pr-4">{primaryLabel}</th>
                  <th className="text-left py-2 pr-4">{secondaryLabel}</th>
                  <th className="text-left py-2 pr-4">PL</th>
                  <th className="text-left py-2 pr-4">División</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-b border-zinc-900">
                    <td className="py-2.5 pr-4 text-zinc-400">{formatDate(m.played_at)}</td>
                    <td className={`py-2.5 pr-4 font-semibold ${resultColor[m.result]}`}>{resultLabel[m.result]}</td>
                    <td className="py-2.5 pr-4 text-zinc-300">{type === 'killer' ? m.kills : m.escapes}</td>
                    <td className="py-2.5 pr-4 text-zinc-300">{type === 'killer' ? m.hooks : m.generators}</td>
                    <td className="py-2.5 pr-4 text-amber-400 font-semibold">{m.match_pl}</td>
                    <td className="py-2.5 pr-4 text-zinc-500">{m.division}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
