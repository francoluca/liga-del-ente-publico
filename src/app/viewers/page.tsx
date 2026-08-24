'use client';

import { useEffect, useState } from 'react';

interface ViewerStat {
  voterKey: string;
  platform: string | null;
  avatarUrl: string | null;
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
  duelsWon: number;
  duelsLost: number;
  duelsNet: number;
  robberiesAttempted: number;
  robberiesSucceeded: number;
  timesRobbed: number;
  robberyNet: number;
  bombsSurvived: number;
  bombsExplodedOn: number;
  pointsLostToBombs: number;
  pointsGainedFromBombs: number;
  pvpNet: number;
  totalRedemptions: number;
  totalRedemptionSpend: number;
  rerollCharacterCount: number;
  rerollPerkCount: number;
  perkBoostCount: number;
  immunityCount: number;
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

const PLATFORM_ICONS: Record<string, { label: string; color: string; svg: React.ReactNode }> = {
  twitch: {
    label: 'Twitch',
    color: '#a970ff',
    svg: (
      <path d="M4.3 2.5 3 5.7v13.4h4.6V21h2.6l2.3-2.3h3.5L20.9 14V2.5H4.3ZM19 13l-3 3h-3.5L10.2 18.3V16H6.9V4.3H19V13Z M13.9 10.9h1.7V6.1h-1.7v4.8Zm-4.6 0h1.7V6.1H9.3v4.8Z" />
    ),
  },
  youtube: {
    label: 'YouTube',
    color: '#ff0000',
    svg: (
      <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.1c-.4 0-1.3.1-2.1.9-.6.6-.8 2.2-.8 2.2S2.2 9 2.2 10.7v1.5c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.2c.8.8 1.8.8 2.3.9 1.7.1 6.5.2 6.5.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.2.8-2.2s.2-1.7.2-3.5v-1.5c0-1.7-.2-3.5-.2-3.5ZM9.9 15V8.9l5.8 3.1-5.8 3Z" />
    ),
  },
  kick: {
    label: 'Kick',
    color: '#53fc18',
    svg: (
      <path d="M2 2h6v5h2V4h2V2h6v6h-2v2h-2v2h2v2h2v6h-6v-2h-2v-3h-2v5H2V2Z" />
    ),
  },
  tiktok: {
    label: 'TikTok',
    color: '#ffffff',
    svg: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    ),
  },
};

function PlatformIcon({ platform }: { platform: string | null }) {
  if (!platform) return null;
  const icon = PLATFORM_ICONS[platform.toLowerCase()];
  if (!icon) {
    return (
      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 flex-shrink-0">
        {platform}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill={icon.color} className="flex-shrink-0" role="img" aria-label={icon.label}>
      <title>{icon.label}</title>
      {icon.svg}
    </svg>
  );
}

function Avatar({ url, name }: { url: string | null; name: string }) {
  const [errored, setErrored] = useState(false);
  if (!url || errored) {
    return (
      <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 flex-shrink-0">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external avatar URLs from arbitrary stream platform CDNs, not worth configuring remotePatterns for
    <img
      src={url}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className="w-6 h-6 rounded-full object-cover border border-zinc-700 flex-shrink-0"
    />
  );
}

function ViewerIdentity({ v }: { v: { displayName: string; platform: string | null; avatarUrl: string | null } }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar url={v.avatarUrl} name={v.displayName} />
      <span className="font-semibold text-white truncate" title={v.displayName}>{v.displayName}</span>
      <PlatformIcon platform={v.platform} />
    </div>
  );
}

function HighlightCard({
  title,
  leaders,
  valueLabel,
  tone,
}: {
  title: string;
  leaders: { displayName: string; platform: string | null; avatarUrl: string | null }[];
  valueLabel: string;
  tone: 'amber' | 'green' | 'red';
}) {
  const toneClass = tone === 'amber' ? 'text-amber-400' : tone === 'green' ? 'text-green-400' : 'text-red-400';
  return (
    <Card title={title}>
      {leaders.length > 0 ? (
        <div>
          <div className={`text-2xl font-black mb-3 ${toneClass}`}>{valueLabel}</div>
          <div className="flex flex-col gap-1.5">
            {leaders.map((l) => (
              <div key={l.displayName} className="flex items-center gap-2 text-sm text-zinc-300">
                <ViewerIdentity v={l} />
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

/** All entries tied for the max of `selector`, among those passing `active`. */
function topLeaders(list: ViewerStat[], active: (v: ViewerStat) => boolean, selector: (v: ViewerStat) => number): ViewerStat[] {
  const pool = list.filter(active);
  if (pool.length === 0) return [];
  const max = Math.max(...pool.map(selector));
  return pool.filter((v) => selector(v) === max);
}

function bombNet(v: ViewerStat): number {
  return v.pointsGainedFromBombs - v.pointsLostToBombs;
}

type Tab = 'general' | 'predicciones' | 'duelos' | 'robos' | 'bombas' | 'canjeadores';

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'predicciones', label: 'Predicciones' },
  { key: 'duelos', label: 'Duelos' },
  { key: 'robos', label: 'Robos' },
  { key: 'bombas', label: 'Bombas' },
  { key: 'canjeadores', label: 'Canjeadores' },
];

export default function ViewersPage() {
  const [data, setData] = useState<ViewerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('general');

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
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">Ranking del chat</h1>
        <p className="text-zinc-400">Liga Del Ente — Dead by Daylight</p>
      </div>

      {loading && <div className="text-zinc-500 mt-8">Cargando...</div>}

      {data && (
        <>
          <div className="flex flex-wrap gap-2 my-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors ${
                  tab === t.key ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {data.leaderboard.length === 0 && (
            <div className="text-zinc-600 italic text-sm mb-4">Todavía nadie participó del chat.</div>
          )}

          {tab === 'general' && (
            <div className="overflow-x-auto">
              <table className="w-full sm:min-w-[520px] table-fixed text-sm border-separate border-spacing-y-1.5">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                    <th className="text-left px-3 py-1">Viewer</th>
                    <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Disponible</th>
                    <th className="hidden sm:table-cell text-center px-2 py-1 w-24">En apuesta</th>
                    <th className="text-center px-3 py-1 w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaderboard.map((v, i) => (
                    <tr key={v.voterKey} className="bg-zinc-900/50">
                      <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                      <td className="px-3 py-2 overflow-hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <ViewerIdentity v={v} />
                        </div>
                      </td>
                      <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.balance}</td>
                      <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.reserved}</td>
                      <td className="text-center px-3 py-2 font-mono text-yellow-300 font-black rounded-r-lg">{v.netWorth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'predicciones' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
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
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.resolvedCount > 0, (v) => v.netProfit);
                  return (
                    <HighlightCard
                      title="Mayor ganancia neta en predicciones"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].netProfit > 0 ? '+' : ''}${leaders[0].netProfit} pts` : '—'}
                      tone={leaders.length > 0 && leaders[0].netProfit < 0 ? 'red' : 'amber'}
                    />
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[860px] table-fixed text-sm border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                      <th className="text-left px-3 py-1">Viewer</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Predicciones</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">G/P/E</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">% Aciertos</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Apostado</th>
                      <th className="text-center px-3 py-1 w-20 sm:w-24">Ganancia neta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.leaderboard]
                      .sort((a, b) => b.netProfit - a.netProfit)
                      .map((v, i) => (
                        <tr key={v.voterKey} className="bg-zinc-900/50">
                          <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                          <td className="px-3 py-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <ViewerIdentity v={v} />
                            </div>
                          </td>
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
            </>
          )}

          {tab === 'duelos' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.duelsWon > 0, (v) => v.duelsWon);
                  return (
                    <HighlightCard
                      title="Más duelos ganados"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].duelsWon} ganados` : '—'}
                      tone="green"
                    />
                  );
                })()}
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.duelsWon + v.duelsLost > 0, (v) => v.duelsNet);
                  return (
                    <HighlightCard
                      title="Mejor neto en duelos"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].duelsNet > 0 ? '+' : ''}${leaders[0].duelsNet} pts` : '—'}
                      tone={leaders.length > 0 && leaders[0].duelsNet < 0 ? 'red' : 'amber'}
                    />
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[560px] table-fixed text-sm border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                      <th className="text-left px-3 py-1">Viewer</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Ganados</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Perdidos</th>
                      <th className="text-center px-3 py-1 w-24">Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.leaderboard]
                      .sort((a, b) => b.duelsNet - a.duelsNet)
                      .map((v, i) => (
                        <tr key={v.voterKey} className="bg-zinc-900/50">
                          <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                          <td className="px-3 py-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <ViewerIdentity v={v} />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-green-400">{v.duelsWon}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-red-400">{v.duelsLost}</td>
                          <td
                            className={`text-center px-3 py-2 font-mono font-bold rounded-r-lg ${
                              v.duelsNet > 0 ? 'text-green-400' : v.duelsNet < 0 ? 'text-red-400' : 'text-zinc-400'
                            }`}
                          >
                            {v.duelsNet > 0 ? '+' : ''}{v.duelsNet}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'robos' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.robberiesSucceeded > 0, (v) => v.robberiesSucceeded);
                  return (
                    <HighlightCard
                      title="Mejor ladrón"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].robberiesSucceeded} robos exitosos` : '—'}
                      tone="green"
                    />
                  );
                })()}
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.timesRobbed > 0, (v) => v.timesRobbed);
                  return (
                    <HighlightCard
                      title="Blanco favorito (más veces robado)"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].timesRobbed} veces` : '—'}
                      tone="red"
                    />
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[660px] table-fixed text-sm border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                      <th className="text-left px-3 py-1">Viewer</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Éxitos</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Intentos</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Veces robado</th>
                      <th className="text-center px-3 py-1 w-24">Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.leaderboard]
                      .sort((a, b) => b.robberyNet - a.robberyNet)
                      .map((v, i) => (
                        <tr key={v.voterKey} className="bg-zinc-900/50">
                          <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                          <td className="px-3 py-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <ViewerIdentity v={v} />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.robberiesSucceeded}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.robberiesAttempted}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.timesRobbed}</td>
                          <td
                            className={`text-center px-3 py-2 font-mono font-bold rounded-r-lg ${
                              v.robberyNet > 0 ? 'text-green-400' : v.robberyNet < 0 ? 'text-red-400' : 'text-zinc-400'
                            }`}
                          >
                            {v.robberyNet > 0 ? '+' : ''}{v.robberyNet}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'bombas' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.bombsSurvived > 0, (v) => v.bombsSurvived);
                  return (
                    <HighlightCard
                      title="Más bombas sobrevividas"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].bombsSurvived} sobrevividas` : '—'}
                      tone="green"
                    />
                  );
                })()}
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.pointsLostToBombs > 0, (v) => v.pointsLostToBombs);
                  return (
                    <HighlightCard
                      title="Mayor pérdida por bombas"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `-${leaders[0].pointsLostToBombs} pts` : '—'}
                      tone="red"
                    />
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[560px] table-fixed text-sm border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                      <th className="text-left px-3 py-1">Viewer</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Sobrevivió</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-24">Explotó</th>
                      <th className="text-center px-3 py-1 w-24">Neto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.leaderboard]
                      .sort((a, b) => bombNet(b) - bombNet(a))
                      .map((v, i) => (
                        <tr key={v.voterKey} className="bg-zinc-900/50">
                          <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                          <td className="px-3 py-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <ViewerIdentity v={v} />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-green-400">{v.bombsSurvived}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-red-400">{v.bombsExplodedOn}</td>
                          <td
                            className={`text-center px-3 py-2 font-mono font-bold rounded-r-lg ${
                              bombNet(v) > 0 ? 'text-green-400' : bombNet(v) < 0 ? 'text-red-400' : 'text-zinc-400'
                            }`}
                          >
                            {bombNet(v) > 0 ? '+' : ''}{bombNet(v)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'canjeadores' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.totalRedemptionSpend > 0, (v) => v.totalRedemptionSpend);
                  return (
                    <HighlightCard
                      title="Mayor gastador en la tienda"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].totalRedemptionSpend} pts` : '—'}
                      tone="amber"
                    />
                  );
                })()}
                {(() => {
                  const leaders = topLeaders(data.leaderboard, (v) => v.totalRedemptions > 0, (v) => v.totalRedemptions);
                  return (
                    <HighlightCard
                      title="Más canjes totales"
                      leaders={leaders}
                      valueLabel={leaders.length > 0 ? `${leaders[0].totalRedemptions} canjes` : '—'}
                      tone="green"
                    />
                  );
                })()}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full sm:min-w-[760px] table-fixed text-sm border-separate border-spacing-y-1.5">
                  <thead>
                    <tr className="text-zinc-500 text-xs uppercase tracking-wider">
                      <th className="text-left px-3 py-1 w-8 sm:w-10">#</th>
                      <th className="text-left px-3 py-1">Viewer</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Reroll personaje</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Reroll perk</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Potenciar</th>
                      <th className="hidden sm:table-cell text-center px-2 py-1 w-20">Inmunidad</th>
                      <th className="text-center px-3 py-1 w-24">Gastado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.leaderboard]
                      .filter((v) => v.totalRedemptions > 0)
                      .sort((a, b) => b.totalRedemptionSpend - a.totalRedemptionSpend)
                      .map((v, i) => (
                        <tr key={v.voterKey} className="bg-zinc-900/50">
                          <td className="px-3 py-2 text-zinc-500 font-mono font-bold text-center rounded-l-lg">{i + 1}</td>
                          <td className="px-3 py-2 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0">
                              <ViewerIdentity v={v} />
                            </div>
                          </td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.rerollCharacterCount}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.rerollPerkCount}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.perkBoostCount}</td>
                          <td className="hidden sm:table-cell text-center px-2 py-2 font-mono text-zinc-400">{v.immunityCount}</td>
                          <td className="text-center px-3 py-2 font-mono text-amber-400 font-black rounded-r-lg">{v.totalRedemptionSpend}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {data.leaderboard.every((v) => v.totalRedemptions === 0) && (
                  <div className="text-zinc-600 italic text-sm mt-2">Todavía nadie canjeó nada en la tienda.</div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
