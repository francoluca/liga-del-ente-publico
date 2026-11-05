'use client';

import { useEffect, useState } from 'react';
import PlatformIcon from '@/components/PlatformIcon';

/**
 * OBS browser-source overlay for the "Fin" scene: top N of the chat ranking
 * (same order as /viewers -> General, i.e. lifetimePoints), with avatar and
 * platform icon. Transparent page, panel centered in the source.
 *
 * Suggested OBS source size: 960 x 820.
 * Query params:
 *   ?limit=20   how many viewers (1-50, default 20)
 *   ?puntos=0   hide the points column
 *   ?cols=1     single column instead of two
 */

interface RankEntry {
  voterKey: string;
  displayName: string;
  platform: string | null;
  avatarUrl: string | null;
  lifetimePoints: number;
}

const REFRESH_MS = 60_000;

const MEDALS = [
  { text: 'text-yellow-300', ring: 'border-yellow-400', row: 'border-yellow-400/40 shadow-[0_0_14px_rgba(250,204,21,0.45)]' },
  { text: 'text-zinc-200', ring: 'border-zinc-300', row: 'border-zinc-300/40 shadow-[0_0_12px_rgba(212,212,216,0.35)]' },
  { text: 'text-orange-400', ring: 'border-orange-500', row: 'border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.35)]' },
];

function readParams() {
  const p = new URLSearchParams(window.location.search);
  const limit = Math.min(50, Math.max(1, Number(p.get('limit')) || 20));
  return { limit, showPoints: p.get('puntos') !== '0', cols: p.get('cols') === '1' ? 1 : 2 };
}

function Avatar({ url, name, ringClass }: { url: string | null; name: string; ringClass: string }) {
  const [errored, setErrored] = useState(false);
  const base = `w-11 h-11 rounded-full border-2 flex-shrink-0 ${ringClass}`;
  if (!url || errored) {
    return (
      <span className={`${base} bg-zinc-800 flex items-center justify-center text-lg font-black text-zinc-300`}>
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external avatar URLs from arbitrary stream platform CDNs
    <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setErrored(true)} className={`${base} object-cover`} />
  );
}

function Row({ v, rank, showPoints, delay }: { v: RankEntry; rank: number; showPoints: boolean; delay: number }) {
  const medal = MEDALS[rank - 1];
  return (
    <div
      className={`top-chat-row flex items-center gap-3 h-[60px] px-3 rounded-lg border ${
        medal ? `bg-zinc-900/90 ${medal.row}` : 'bg-zinc-900/75 border-zinc-800'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`w-8 text-center font-mono font-black text-xl ${medal ? medal.text : 'text-zinc-500'}`}>{rank}</span>
      <Avatar url={v.avatarUrl} name={v.displayName} ringClass={medal ? medal.ring : 'border-zinc-700'} />
      <span className={`flex-1 min-w-0 truncate font-bold text-lg ${medal ? 'text-white' : 'text-zinc-100'}`}>{v.displayName}</span>
      <PlatformIcon platform={v.platform} size={22} />
      {showPoints && (
        <span className="w-20 text-right font-mono font-black text-base text-yellow-300 tabular-nums">
          {v.lifetimePoints.toLocaleString('es-AR')}
        </span>
      )}
    </div>
  );
}

export default function TopChatOverlay() {
  const [params, setParams] = useState<{ limit: number; showPoints: boolean; cols: number } | null>(null);
  const [rows, setRows] = useState<RankEntry[] | null>(null);

  useEffect(() => {
    const prm = readParams();
    setParams(prm);

    let cancelled = false;
    const load = () =>
      fetch('/api/viewer-stats', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d: { leaderboard?: RankEntry[] }) => {
          if (!cancelled && Array.isArray(d.leaderboard)) setRows(d.leaderboard.slice(0, prm.limit));
        })
        .catch(console.error); // keep the last good list on a failed refresh

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!params || !rows || rows.length === 0) return <div className="obs-overlay" />;

  const perCol = params.cols === 1 ? rows.length : Math.ceil(rows.length / 2);
  const columns = params.cols === 1 ? [rows] : [rows.slice(0, perCol), rows.slice(perCol)];

  return (
    <div className="obs-overlay w-screen h-screen flex items-center justify-center p-4">
      <style>{`
        @keyframes topChatIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .top-chat-row { opacity: 0; animation: topChatIn 450ms ease-out forwards; }
      `}</style>
      <div
        className={`${params.cols === 1 ? 'w-[460px]' : 'w-[920px]'} bg-zinc-950/85 border border-red-900/70 rounded-2xl px-5 pt-4 pb-5 shadow-[0_0_30px_rgba(139,0,0,0.45)]`}
      >
        <div className="flex items-baseline justify-between mb-4 px-1">
          <h1 className="text-3xl font-black uppercase tracking-wider text-amber-400">Ranking del chat</h1>
          <span className="text-zinc-400 text-sm uppercase tracking-widest font-bold">Top {rows.length} · Liga del Ente</span>
        </div>
        <div className={`grid gap-x-4 ${params.cols === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {columns.map((col, c) => (
            <div key={c} className="flex flex-col gap-2">
              {col.map((v, i) => {
                const rank = c * perCol + i + 1;
                return <Row key={v.voterKey} v={v} rank={rank} showPoints={params.showPoints} delay={rank * 70} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
