import { useEffect, useState } from 'react';
import { EVENT } from '../data/site.js';
import './Countdown.css';

const pad = (value) => String(value).padStart(2, '0');

function remaining(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    done: diff === 0,
    jours: Math.floor(diff / 86_400_000),
    heures: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    secondes: Math.floor(diff / 1000) % 60,
  };
}

export default function Countdown({ target = EVENT.startsAt, className = '', showTitle = true }) {
  const [time, setTime] = useState(() => remaining(target));

  useEffect(() => {
    const timer = setInterval(() => setTime(remaining(target)), 1000);
    return () => clearInterval(timer);
  }, [target]);

  if (time.done) {
    return (
      <div className={`countdown countdown--live ${className}`}>
        <span className="countdown__live">ÉBËNA, c’est maintenant !</span>
      </div>
    );
  }

  const units = [
    { value: time.jours, label: time.jours > 1 ? 'jours' : 'jour' },
    { value: pad(time.heures), label: 'heures' },
    { value: pad(time.minutes), label: 'min' },
    { value: pad(time.secondes), label: 'sec' },
  ];

  return (
    <div className={`countdown ${className}`} role="timer" aria-label={`Ouverture du salon dans ${time.jours} jours`}>
      {showTitle && <p className="countdown__title">Ouverture dans</p>}
      <div className="countdown__units" aria-hidden="true">
        {units.map((unit) => (
          <div key={unit.label} className="countdown__unit">
            <span className="countdown__value">{unit.value}</span>
            <span className="countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
