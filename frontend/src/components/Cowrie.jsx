import { useId } from 'react';

const TEETH = [9, 12, 15, 18, 21, 24, 27, 30];

// Cauris doré, repris des deux coquillages qui forment le tréma du logo ÉBËNA.
export default function Cowrie({ className = 'cowrie' }) {
  const gradientId = `cowrie-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox="0 0 28 38" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FCEFC9" />
          <stop offset="0.38" stopColor="#E6B25A" />
          <stop offset="0.72" stopColor="#B07A2A" />
          <stop offset="1" stopColor="#7A4A10" />
        </linearGradient>
      </defs>
      <ellipse cx="14" cy="19" rx="12.5" ry="17.5" fill={`url(#${gradientId})`} />
      <ellipse cx="14" cy="19" rx="12.5" ry="17.5" fill="none" stroke="#7A4A10" strokeOpacity="0.35" />
      <path
        d="M14.6 4.6c-2.2 5 1.4 9.6-.8 14.4s1.8 9.8-.4 14.6"
        fill="none"
        stroke="#44220A"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <g stroke="#44220A" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.85">
        {TEETH.map((y) => (
          <g key={y}>
            <path d={`M10.4 ${y}h1.8`} />
            <path d={`M15.8 ${y}h1.8`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function CowriePair({ className = '' }) {
  return (
    <span className={`cowries ${className}`} aria-hidden="true">
      <Cowrie />
      <Cowrie />
    </span>
  );
}

export function Ornament({ className = '' }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <CowriePair />
    </div>
  );
}
