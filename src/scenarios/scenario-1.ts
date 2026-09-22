import type { Case } from '../types';

export const compromisedAccountScenario: Omit<Case, 'id' | 'createdAt'> = {
  name: 'Scenario 01 — Compromised Account',
  status: 'Active',
  investigator: 'Demo User',
  objective: 'Determine whether the account was compromised and what actions were taken by the attacker.',
  notes: 'Multiple failed logins followed by a suspicious external IP success.',
  findings: [],
  board: {
    nodes: [
      { id: 'node_1', type: 'custom', position: { x: 250, y: 100 }, data: { type: 'User', label: 'admin' } },
      { id: 'node_2', type: 'custom', position: { x: 250, y: 200 }, data: { type: 'IP', label: '185.x.x.x' } },
      { id: 'node_3', type: 'custom', position: { x: 250, y: 300 }, data: { type: 'Process', label: 'PowerShell.exe' } },
      { id: 'node_4', type: 'custom', position: { x: 250, y: 400 }, data: { type: 'File', label: 'malware.ps1' } }
    ],
    edges: [
      { id: 'e1-2', source: 'node_2', target: 'node_1', animated: true, style: { stroke: '#60a5fa' }, label: 'authenticated as', labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 }, labelBgStyle: { fill: '#171717' }, labelBgPadding: [4, 4] },
      { id: 'e2-3', source: 'node_1', target: 'node_3', animated: true, style: { stroke: '#60a5fa' }, label: 'executed', labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 }, labelBgStyle: { fill: '#171717' }, labelBgPadding: [4, 4] },
      { id: 'e3-4', source: 'node_3', target: 'node_4', animated: true, style: { stroke: '#60a5fa' }, label: 'downloaded', labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 }, labelBgStyle: { fill: '#171717' }, labelBgPadding: [4, 4] }
    ]
  },
  evidence: [
    {
      id: 'EV-001',
      name: 'auth_logs.csv',
      type: 'CSV',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      md5: 'MD5 not natively supported in WebCrypto',
      size: 450,
      addedAt: new Date().toISOString(),
      notes: 'Authentication logs from the primary server.',
      artifacts: [
        {
          id: 'ART-EV-001-0',
          evidenceId: 'EV-001',
          timestamp: '2026-09-22T10:21:03Z',
          type: 'Authentication',
          isRelevant: true,
          notes: '',
          data: { timestamp: '2026-09-22 10:21:03', user: 'admin', source_ip: '10.0.0.15', result: 'FAILED' }
        },
        {
          id: 'ART-EV-001-1',
          evidenceId: 'EV-001',
          timestamp: '2026-09-22T10:21:08Z',
          type: 'Authentication',
          isRelevant: true,
          notes: '',
          data: { timestamp: '2026-09-22 10:21:08', user: 'admin', source_ip: '10.0.0.15', result: 'FAILED' }
        },
        {
          id: 'ART-EV-001-2',
          evidenceId: 'EV-001',
          timestamp: '2026-09-22T10:21:15Z',
          type: 'Authentication',
          isRelevant: true,
          notes: 'Successful login from suspicious external IP.',
          data: { timestamp: '2026-09-22 10:21:15', user: 'admin', source_ip: '185.x.x.x', result: 'SUCCESS' }
        }
      ]
    },
    {
      id: 'EV-002',
      name: 'system_events.json',
      type: 'JSON',
      hash: 'a82f0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      md5: 'MD5 not natively supported in WebCrypto',
      size: 820,
      addedAt: new Date().toISOString(),
      notes: 'System event logs from the primary server.',
      artifacts: [
        {
          id: 'ART-EV-002-0',
          evidenceId: 'EV-002',
          timestamp: '2026-09-22T10:25:00Z',
          type: 'Process Execution',
          isRelevant: true,
          notes: 'PowerShell execution shortly after login.',
          data: { timestamp: '2026-09-22 10:25:00', event: 'Process Started', process: 'PowerShell.exe', user: 'admin', commandLine: 'powershell.exe -ExecutionPolicy Bypass -File malware.ps1' }
        },
        {
          id: 'ART-EV-002-1',
          evidenceId: 'EV-002',
          timestamp: '2026-09-22T10:26:00Z',
          type: 'File Creation',
          isRelevant: true,
          notes: 'Malicious script created.',
          data: { timestamp: '2026-09-22 10:26:00', event: 'File Created', file: 'C:\\Users\\admin\\malware.ps1', user: 'admin' }
        },
        {
          id: 'ART-EV-002-2',
          evidenceId: 'EV-002',
          timestamp: '2026-09-22T10:30:00Z',
          type: 'Network Connection',
          isRelevant: true,
          notes: 'Outbound connection to known C2.',
          data: { timestamp: '2026-09-22 10:30:00', event: 'Network Connection', process: 'PowerShell.exe', destination_ip: '45.12.34.56', port: 443 }
        }
      ]
    }
  ]
};
