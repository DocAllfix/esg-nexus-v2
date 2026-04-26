// Q4 — Lightweight CSV export (no dependencies).
// Excel-friendly: UTF-8 BOM + CRLF + RFC 4180 escaping.

function escapeCell(value) {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'string' ? value : String(value);
  // Quote if contains comma, quote, CR, LF, or leading/trailing whitespace
  if (/[",\r\n]/.test(str) || /^\s|\s$/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Build a CSV string from an array of records.
 * @param {Array<Object>} rows
 * @param {Array<{key: string, label: string, transform?: (row) => any}>} columns
 * @returns {string}
 */
export function buildCsv(rows, columns) {
  const header = columns.map(c => escapeCell(c.label)).join(',');
  const body = rows.map(row =>
    columns
      .map(c => {
        const raw = c.transform ? c.transform(row) : row[c.key];
        return escapeCell(raw);
      })
      .join(',')
  );
  // RFC 4180 line terminator + Excel-safe BOM
  return '﻿' + [header, ...body].join('\r\n') + '\r\n';
}

export function downloadCsv(filename, rows, columns) {
  const csv = buildCsv(rows, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: filename.endsWith('.csv') ? filename : `${filename}.csv`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function timestampedFilename(prefix) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${prefix}_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
}
