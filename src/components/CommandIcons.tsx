type IconProps = { className?: string };

export function IconPresence({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 0 1 4-4h3.5" />
      <path d="M16 11l2 2 4-4" />
    </svg>
  );
}

export function IconDonation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 17l3-1 3.5 1c1 .3 2 .1 2.8-.5l6-4.4a1.5 1.5 0 0 0-1.8-2.4L12 12" />
      <path d="M2 17v3h5" />
      <path d="M12.5 8.5c-1-1-1-2.5 0-3.4a2.2 2.2 0 0 1 3.1 0l.4.4.4-.4a2.2 2.2 0 0 1 3.1 0c1 1 1 2.4 0 3.4L16 12z" />
    </svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 20.5l1.5-6.8L2.2 9l6.9-.7L12 2z" />
    </svg>
  );
}

export function IconSwords({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
      <path d="M4 4h4M4 4v4" />
      <path d="M20 4h-4M20 4v4" />
      <path d="M2 22l3-3M22 22l-3-3" />
    </svg>
  );
}

export function IconMask({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9c3-2 6-3 9-3s6 1 9 3c0 5-3 9-9 9s-9-4-9-9z" />
      <circle cx="8.5" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M11 13.5h2" />
    </svg>
  );
}

export function IconBomb({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="14" r="7" />
      <path d="M15.5 9.5l2-2" />
      <path d="M17 4l1.5 1.5L20 4M18.5 5.5V8" />
    </svg>
  );
}

export function IconDice({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconZap({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconCoin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.2c0-1.2 1.1-2.2 2.5-2.2s2.5.8 2.5 2c0 2.5-5 1.8-5 4.3 0 1.2 1.1 2.2 2.5 2.2s2.5-1 2.5-2.2" />
    </svg>
  );
}

export function IconHandshake({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12l4-3 4 2 3-2 3 1.5" />
      <path d="M2 12v5l4 2" />
      <path d="M22 12l-4-3-1 1" />
      <path d="M22 12v5l-4 2-5-3-2 1.5-3-2" />
    </svg>
  );
}

export function IconLink({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 15l6-6" />
      <path d="M11 5l1-1a4 4 0 0 1 6 6l-1 1" />
      <path d="M13 19l-1 1a4 4 0 0 1-6-6l1-1" />
    </svg>
  );
}

export function IconChat({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5h16v10H8l-4 4V5z" />
    </svg>
  );
}
