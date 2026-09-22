export interface Case {
  id: string;
  name: string;
  status: 'Active' | 'Closed' | 'Archived';
  investigator: string;
  createdAt: string;
  objective: string;
  notes: string;
  findings: Finding[];
  evidence: Evidence[];
}

export interface Finding {
  id: string;
  title: string;
  evidenceIds: string[];
  mitreTtp: string;
  observation: string;
  confidence: string;
  notes: string;
}

export interface Artifact {
  id: string;
  evidenceId: string;
  timestamp?: string;
  type?: string;
  // Dynamic fields for different types of logs
  data: Record<string, string | number | boolean | null>;
  isRelevant: boolean;
  notes: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: string; // e.g., 'csv', 'json'
  hash: string;
  md5: string;
  size: number;
  addedAt: string;
  artifacts: Artifact[];
  notes: string;
}
