export interface Case {
  id: string;
  name: string;
  status: 'Active' | 'Closed' | 'Archived';
  investigator: string;
  createdAt: string;
  objective: string;
  notes: string;
  findings: Finding[];
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

export interface Evidence {
  id: string;
  name: string;
  type: string;
  hash: string;
  size: number;
  addedAt: string;
}
