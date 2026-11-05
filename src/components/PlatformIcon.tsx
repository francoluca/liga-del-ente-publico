import type { ReactNode } from 'react';

const PLATFORM_ICONS: Record<string, { label: string; color: string; svg: ReactNode }> = {
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

/** Platform logo (Twitch/YouTube/Kick/TikTok) in its brand color; unknown platforms fall back to a text chip. */
export default function PlatformIcon({ platform, size = 14 }: { platform: string | null; size?: number }) {
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
    <svg viewBox="0 0 24 24" width={size} height={size} fill={icon.color} className="flex-shrink-0" role="img" aria-label={icon.label}>
      <title>{icon.label}</title>
      {icon.svg}
    </svg>
  );
}
