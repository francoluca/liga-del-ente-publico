'use client';

import { useEffect, useState } from 'react';

interface ViewerStat {
  voterKey: string;
  platform: string | null;
  displayName: string;
  balance: number;
  reserved: number;
  netWorth: number;
  resolvedCount: number;
  wins: number;
  losses: number;
  pushes: number;
  totalStaked: number;
  totalPayout: number;
  netProfit: number;
  winRate: number | null;
}

interface ViewerStatsData {
  leaderboard: ViewerStat[];
  highlights: {
    topBalance: ViewerStat | null;
    bestWinRate: { minQualifying: number; leaders: ViewerStat[] };
    biggestSinglePayout: { value: number; leaders: ViewerStat[] };
  };
}

function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900/70 border border-zinc-800 rounded-xl p-5 ${className}`}>
      <div className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-3">{title}</div>
      {children}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string | null }) {
  if (!platform) return null;
  return (
    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
      {platform}
    </span>
  );
}

function HighlightCard({
  title,
  leaders,
  valueLabel,
  tone,
}: {
  title: string;
  leaders: { displayName: string; platform: string | null }[];
  valueLabel: string;
  tone: 'amber' | 'green';
}) {
  const toneClass = tone === 'amber' ? 'text-amber-400' : 'text-green-400';
  return (
    <Card title={title}>
      {leaders.length > 0 ? (
        <div>
          <div className={`text-2xl font-black mb-3 ${toneClass}`}>{valueLabel}</div>
          <div className="flex flex-col gap-1.5">
            {leaders.map((l) => (
              <div key={l.displayName} className="flex items-center gap-2 text-sm text-zinc-300">
                <span>{l.displayName}</span>
                <PlatformBadge platform={l.platform} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-zinc-600 italic text-sm">Sin datos todavía</div>
      )}
    </Card>
  );
}

export default function ViewersPage() {
  const [data, setData] = useState<ViewerStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/viewer-stats')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 lg:px-10 py-10 max-w-6xl mx-auto">
      <div className="mb-1">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Chatters y predicciones</h1>
        <p className="text-zinc-400">Liga Del Ente — Dead by Daylight</p>
      </div>

      {loading && <div className="text-zinc-500 mt-8">Cargando...</div>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
            <HighlightCard
              title="Mayor patrimonio"
              leaders={data.highlights.topBalance ? [data.highlights.topBalance] : []}
              valueLabel={data.highlights.topBalance ? `${data.highlights.topBalance.netWorth} pts` : '—'}
              tone="amber"
            />
            <HighlightCard
              title={`Mejor % de aciertos (min ${data.highlights.bestWinRate.minQualifying} predicciones)`}
              leaders={data.highlights.bestWinRate.leaders}
              valueLabel={
                data.highlights.bestWinRate.leaders.length > 0
                  ? `${(data.highlights.bestWinRate.leaders[0].winRate! * 100).toFixed(0)}%`
                  : '—'
              }
              tone="green"
            />
            <HighlightCard
              title="Pago más grande de la historia"
              leaders={data.highlights.biggestSinglePayout.leaders}
              valueLabel={
                data.highlights.biggestSinglePayout.value > 0
                  ? `${data.highlights.biggestSinglePayout.value} pts`
                  : '—'
              }
              tone="amber"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full sm:min-w-[820px] table-fixed text-sm border-separate border-spacing-y-1.5">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                  <th className="text-left px-3 py-1">Chatter</th>
                  <th className="text-center px-2 py-1 w-20 sm:w-24">Patrimonio</th>
                  <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Predicciones</th>
                  <th className="hidden sm:table-cell text-center px-2 py-1 w-20">G/P/E</th>
                  <th className="hidden sm:table-cell text-center px-2 py-1 w-20">% Aciertos</th>
                  <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Apostado</th>
                  <th className="text-center px-3 py-1 w-20 sm:w-24">Ganancia neta</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard.map((v, i) => (
                  <tr key={v.voterKey} className="bg-zinc-900/50">
                    <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                    <td className="px-3 py-2 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-white truncate" title={v.displayName}>{v.displayName}</span>
                        <PlatformBadge platform={v.platform} />
                      </div>
                    </td>
                    <td className="text-center px-2 py-2 font-mono text-yellow-300 font-black">{v.netWorth}</td>
                    <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.resolvedCount}</td>
                    <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.wins}/{v.losses}/{v.pushes}</td>
                    <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">
                      {v.winRate != null ? `${(v.winRate * 100).toFixed(0)}%` : '—'}
                    </td>
                    <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.totalStaked}</td>
                    <td
                      className={`text-center px-3 py-2 font-mono font-bold rounded-r-lg ${
                        v.netProfit > 0 ? 'text-green-400' : v.netProfit < 0 ? 'text-red-400' : 'text-zinc-400'
                      }`}
                    >
                      {v.netProfit > 0 ? '+' : ''}{v.netProfit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.leaderboard.length === 0 && (
            <div className="text-zinc-600 italic text-sm mt-4">Todavía nadie participó del chat.</div>
          )}
        </>
      )}
    </main>
  );
}
