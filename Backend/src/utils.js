const crypto = require('crypto');

// Alphabet sans caractères ambigus (0/O, 1/I/L) pour des références faciles à dicter.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function makeReference(prefix) {
  let code = '';
  for (let i = 0; i < 6; i += 1) code += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return `${prefix}-${code}`;
}

const UNIQUE_VIOLATION = '23505';

// Exécute `insert(reference)` en régénérant la référence en cas de collision (rarissime).
async function insertWithReference(prefix, insert) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await insert(makeReference(prefix));
    } catch (err) {
      const referenceTaken = err.code === UNIQUE_VIOLATION && String(err.constraint || '').includes('reference');
      if (!referenceTaken) throw err;
    }
  }
  throw new Error('Impossible de générer une référence unique.');
}

// CSV compatible Excel (séparateur « ; », BOM UTF-8) et protégé contre l'injection de formules.
function toCsv(columns, rows) {
  const escapeCell = (value) => {
    if (value === null || value === undefined) return '';
    let text = Array.isArray(value) ? value.join(', ') : value instanceof Date ? value.toISOString() : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const header = columns.map((column) => escapeCell(column.label)).join(';');
  const lines = rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(';'));
  return `﻿${[header, ...lines].join('\r\n')}`;
}

module.exports = { makeReference, insertWithReference, toCsv, UNIQUE_VIOLATION };
