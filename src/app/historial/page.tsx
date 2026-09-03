'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { type CharacterType } from '@/lib/data/characters';
import LigaDelEnteTabs from '@/components/LigaDelEnteTabs';

interface LeaderEntry {
  id: number;
  name: string;
  image: string;
  value: number;
}

interface RecordsData {
  totalPrimaryLeaders: LeaderEntry[];
  totalSecondaryLeaders: LeaderEntry[];
  longestWinStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null;
  longestLossStreakEver: { characterId: number; characterName: string; image: string | null; streak: number } | null;
  currentStreaks: { characterId: number; characterName: string; image: string | null; streak: number; streakType: 'win' | 'loss' }[];
  careerLeaders: { id: number; name: string; image: string; career_pl: number }[];
  championLeaders: { id: number; name: string; image: string; champion: number }[];
  totalMatchesLogged: number;
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

function TotalLeadersCard({ title, leaders }: { title: string; leaders: LeaderEntry[] }) {
  return (
    <Card title={title}>
      {leaders.length > 0 ? (
        <div>
          <div className="text-2xl font-bold text-amber-400 mb-3">{leaders[0].value}</div>
          <div className="flex flex-col gap-2.5">
            {leaders.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar image={c.image} alt={c.name} size={36} />
                <span className="text-sm text-zinc-300">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>}
    </Card>
  );
}

export default function HistorialPage() {
  const [type, setType] = useState<CharacterType>('killer');
  const [records, setRecords] = useState<RecordsData | null>(null);

  useEffect(() => {
    fetch(`/api/records?type=${type}`).then((r) => r.json()).then(setRecords).catch(console.error);
  }, [type]);

  const primaryLabel = type === 'killer' ? 'Kills' : 'Escapes';
  const secondaryLabel = type === 'killer' ? 'Cuelgues' : 'Generadores';

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 lg:px-10 py-10 max-w-7xl mx-auto">
      <div className="mb-1">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Liga del Ente</h1>
        <p className="text-zinc-400">Dead by Daylight</p>
      </div>

      <LigaDelEnteTabs />

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
            <TotalLeadersCard title={`Más ${primaryLabel.toLowerCase()} en total`} leaders={records.totalPrimaryLeaders} />
            <TotalLeadersCard title={`Más ${secondaryLabel.toLowerCase()} en total`} leaders={records.totalSecondaryLeaders} />

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
    </main>
  );
}
