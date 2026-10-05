export function sanitizeEvidenceData(
  row: any
): Record<string, string | number | boolean | null> {
  if (typeof row !== 'object' || row === null) {
    return { data: String(row) };
  }

  const sanitized: Record<string, string | number | boolean | null> = {};

  for (const key in row) {
    // Explicitly reject prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    const value = row[key];

    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else {
      try {
        sanitized[key] = JSON.stringify(value);
      } catch (e) {
        sanitized[key] = '[Circular]';
      }
    }
  }

  return sanitized;
}
