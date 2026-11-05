'use client';

import { useEffect, useState } from 'react';
import PlatformIcon from '@/components/PlatformIcon';

/**
 * OBS browser-source overlay for the "Fin" scene: top N of the chat ranking
 * (same order as /viewers -> General, i.e. lifetimePoints), with avatar and
 * platform icon, in a window that auto-scrolls in a seamless loop.
 * Transparent page, panel centered in the source.
 *
 * Suggested OBS source size: 600 x 720.
 * Query params:
 *   ?limit=15          how many viewers (1-50, default 15)
 *   ?titulo=...        title (default "Los fieles del Ente")
 *   ?subtitulo=...     line under the title (default "Top N del chat · ¡Gracias por bancar!")
 *   ?visibles=7        rows visible at once (3-15, default 7)
 *   ?velocidad=2.5     seconds per row while scrolling (default 2.5)
 *   ?puntos=0          hide the points column
 */

interface RankEntry {
  voterKey: string;
  displayName: string;
  platform: string | null;
  avatarUrl: string | null;
  lifetimePoints: number;
}

const REFRESH_MS = 60_000;
const ROW_H = 60;
const ROW_GAP = 8;
const ROW_STEP = ROW_H + ROW_GAP;

const MEDALS = [
  { text: 'text-yellow-300', ring: 'border-yellow-400', row: 'border-yellow-400/40 shadow-[0_0_12px_rgba(250,204,21,0.4)]' },
  { text: 'text-zinc-200', ring: 'border-zinc-300', row: 'border-zinc-300/40 shadow-[0_0_10px_rgba(212,212,216,0.3)]' },
  { text: 'text-orange-400', ring: 'border-orange-500', row: 'border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.3)]' },
];

interface Params {
  limit: number;
  title: string;
  subtitle: string | null;
  visible: number;
  secPerRow: number;
  showPoints: boolean;
}

function readParams(): Params {
  const p = new URLSearchParams(window.location.search);
  const num = (key: string, def: number, min: number, max: number) => {
    const v = Number(p.get(key));
    return Number.isFinite(v) && v > 0 ? Math.min(max, Math.max(min, v)) : def;
  };
  return {
    limit: Math.round(num('limit', 15, 1, 50)),
    title: p.get('titulo')?.trim() || 'Los fieles del Ente',
    subtitle: p.get('subtitulo')?.trim() || null,
    visible: Math.round(num('visibles', 7, 3, 15)),
    secPerRow: num('velocidad', 2.5, 0.5, 20),
    showPoints: p.get('puntos') !== '0',
  };
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

function Row({ v, rank, showPoints }: { v: RankEntry; rank: number; showPoints: boolean }) {
  const medal = MEDALS[rank - 1];
  return (
    <div
      className={`flex items-center gap-3 px-3 rounded-lg border flex-shrink-0 ${
        medal ? `bg-zinc-900/90 ${medal.row}` : 'bg-zinc-900/75 border-zinc-800'
      }`}
      style={{ height: ROW_H, marginBottom: ROW_GAP }}
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
  const [params, setParams] = useState<Params | null>(null);
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

  // Scroll only when the list doesn't fit; the list is rendered twice and
  // translated by exactly one copy's height so the loop has no visible seam.
  const scrolls = rows.length > params.visible;
  const windowH = Math.min(rows.length, params.visible) * ROW_STEP - ROW_GAP;
  const loopPx = rows.length * ROW_STEP;
  const durationS = rows.length * params.secPerRow;
  // Changes when the ranking changes, so the animation restarts from #1 cleanly.
  const listKey = rows.map((r) => r.voterKey).join('|');
  const subtitle = params.subtitle ?? `Top ${rows.length} del chat · ¡Gracias por bancar!`;
  const fade = 'linear-gradient(to bottom, transparent 0, #000 10px, #000 calc(100% - 28px), transparent 100%)';

  return (
    <div className="obs-overlay w-screen h-screen flex items-center justify-center p-4">
      <style>{`
        @keyframes topChatPanelIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes topChatScroll { from { transform: translateY(0); } to { transform: translateY(-${loopPx}px); } }
        .top-chat-panel { animation: topChatPanelIn 600ms ease-out both; }
        .top-chat-track { animation: topChatScroll ${durationS}s linear 3s infinite; }
      `}</style>
      <div className="top-chat-panel w-[540px] bg-zinc-950/85 border border-red-900/70 rounded-2xl px-5 pt-5 pb-4 shadow-[0_0_30px_rgba(139,0,0,0.45)]">
        <div className="text-center mb-4">
          <h1 className="text-[34px] leading-tight font-black uppercase tracking-wider text-amber-400 drop-shadow-[0_0_10px_rgba(212,175,55,0.35)]">
            {params.title}
          </h1>
          <div className="mt-1 text-zinc-400 text-sm uppercase tracking-widest font-bold">{subtitle}</div>
          <div className="mt-3 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-red-700 to-transparent" />
        </div>
        <div
          className="overflow-hidden -mx-2 px-2"
          style={{ height: windowH + 8, paddingTop: 8, ...(scrolls ? { maskImage: fade, WebkitMaskImage: fade } : {}) }}
        >
          <div key={listKey} className={scrolls ? 'top-chat-track' : undefined}>
            {rows.map((v, i) => (
              <Row key={v.voterKey} v={v} rank={i + 1} showPoints={params.showPoints} />
            ))}
            {scrolls &&
              rows.map((v, i) => <Row key={`dup-${v.voterKey}`} v={v} rank={i + 1} showPoints={params.showPoints} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
