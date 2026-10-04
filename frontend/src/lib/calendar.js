import { EVENT } from '../data/site.js';

// Fichier .ics (agenda) pour l'événement, généré côté navigateur.
export function downloadEventIcs(reference) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EBENA//Salon 2027//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:ebena-2027-${reference || 'visiteur'}@ebena`,
    `DTSTAMP:${stamp}`,
    'DTSTART;VALUE=DATE:20270604',
    'DTEND;VALUE=DATE:20270607',
    'SUMMARY:ÉBËNA 2027 — Salon de la création africaine',
    `LOCATION:${EVENT.address.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${EVENT.baseline}.${reference ? ` Inscription n° ${reference}.` : ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ebena-2027.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
