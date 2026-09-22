import type { Artifact, Evidence } from '../../types';

export interface TimelineEvent extends Artifact {
  evidenceName: string;
  normalizedTime: number; // Unix timestamp in milliseconds
}

/**
 * Normalizes various timestamp formats into a standard Unix timestamp (ms).
 * Handles ISO strings, Unix timestamps (s or ms), and common date formats.
 */
export const normalizeTimestamp = (timestamp: string | number | undefined): number => {
  if (!timestamp) return 0;
  
  // If it's already a number or numeric string
  const num = Number(timestamp);
  if (!isNaN(num)) {
    // Determine if it's seconds or milliseconds (naive check)
    // If it's smaller than a typical 2000s timestamp in ms, assume seconds
    if (num < 1000000000000) {
      return num * 1000;
    }
    return num;
  }

  // Fallback to Date parsing for strings (e.g., ISO, MM/DD/YYYY)
  const parsed = Date.parse(String(timestamp));
  if (!isNaN(parsed)) {
    return parsed;
  }

  return 0; // Return 0 if unparseable
};

/**
 * Extracts and merges artifacts from all evidence sources, 
 * normalizes their timestamps, and sorts them chronologically.
 */
export const buildTimeline = (evidences: Evidence[]): TimelineEvent[] => {
  const allEvents: TimelineEvent[] = [];

  for (const evidence of evidences) {
    for (const artifact of evidence.artifacts) {
      allEvents.push({
        ...artifact,
        evidenceName: evidence.name,
        normalizedTime: normalizeTimestamp(artifact.timestamp)
      });
    }
  }

  // Sort chronologically (ascending)
  return allEvents.sort((a, b) => a.normalizedTime - b.normalizedTime);
};
