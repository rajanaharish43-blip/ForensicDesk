import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCaseStore } from './caseStore';

// Mock localforage to avoid actual storage operations
vi.mock('localforage', () => {
  return {
    default: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  };
});

describe('useCaseStore', () => {
  // Reset store before each test
  beforeEach(() => {
    // Reset state but keep functions
    useCaseStore.setState({
      cases: [],
      activeCaseId: null,
    });
    vi.clearAllMocks();

    // Mock the date for consistent ID generation
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const state = useCaseStore.getState();
    expect(state.cases).toEqual([]);
    expect(state.activeCaseId).toBeNull();
  });

  describe('addCase', () => {
    it('adds a new case with correct default values', () => {
      vi.useFakeTimers();
      useCaseStore.getState().addCase({
        name: 'Test Case',
        objective: 'A test case description',
        notes: '',
        investigator: 'John Doe',
      });

      const state = useCaseStore.getState();
      expect(state.cases.length).toBe(1);

      const newCase = state.cases[0];
      expect(newCase.id).toBe('CASE-2024-001'); // Year is 2024 from the mocked timer
      expect(newCase.name).toBe('Test Case');
      expect(newCase.objective).toBe('A test case description');
      expect(newCase.notes).toBe('');
      expect(newCase.investigator).toBe('John Doe');
      expect(newCase.status).toBe('Active');
      expect(newCase.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(newCase.findings).toEqual([]);
      expect(newCase.evidence).toEqual([]);
    });

    it('generates sequential IDs for multiple cases', () => {
      vi.useFakeTimers();
      const addCase = useCaseStore.getState().addCase;

      addCase({ name: 'Case 1', objective: '', notes: '', investigator: '' });
      addCase({ name: 'Case 2', objective: '', notes: '', investigator: '' });

      const state = useCaseStore.getState();
      expect(state.cases.length).toBe(2);
      expect(state.cases[0].id).toBe('CASE-2024-001');
      expect(state.cases[1].id).toBe('CASE-2024-002');
    });
  });

  describe('setActiveCase', () => {
    it('sets the active case ID', () => {
      useCaseStore.getState().setActiveCase('CASE-2024-001');
      expect(useCaseStore.getState().activeCaseId).toBe('CASE-2024-001');
    });
  });

  describe('updateCaseStatus', () => {
    it('updates the status of an existing case', () => {
      // Add a case first
      useCaseStore.getState().addCase({ name: 'Test', objective: '', notes: '', investigator: '' });
      const caseId = useCaseStore.getState().cases[0].id;

      // Update its status
      useCaseStore.getState().updateCaseStatus(caseId, 'Closed');

      const updatedCase = useCaseStore.getState().cases[0];
      expect(updatedCase.status).toBe('Closed');
    });

    it('does nothing if case ID does not exist', () => {
      useCaseStore.getState().addCase({ name: 'Test', objective: '', notes: '', investigator: '' });

      // Update status of non-existent case
      useCaseStore.getState().updateCaseStatus('NON-EXISTENT-CASE', 'Closed');

      const caseStatus = useCaseStore.getState().cases[0].status;
      expect(caseStatus).toBe('Active'); // Should remain unchanged
    });
  });

  describe('addEvidence', () => {
    beforeEach(() => {
      // Setup a test case before running evidence tests
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });
      vi.useFakeTimers();
    });

    it('adds evidence to a specific case with generated IDs', () => {
      const caseId = useCaseStore.getState().cases[0].id;

      const evidenceData = {
        name: 'Hard Drive',
        type: 'csv',
        hash: 'abc',
        md5: 'def',
        size: 1000000,
        notes: '',
        artifacts: [
          { data: { path: '/file1.txt' }, isRelevant: false, notes: '', id: '', evidenceId: '' },
          { data: { path: '/file2.txt' }, isRelevant: false, notes: '', id: '', evidenceId: '' }
        ]
      };

      useCaseStore.getState().addEvidence(caseId, evidenceData);

      const updatedCase = useCaseStore.getState().cases[0];
      expect(updatedCase.evidence.length).toBe(1);

      const evidence = updatedCase.evidence[0];
      expect(evidence.id).toBe('EV-001');
      expect(evidence.name).toBe('Hard Drive');
      expect(evidence.addedAt).toBe('2024-01-01T00:00:00.000Z');

      // Check artifacts
      expect(evidence.artifacts.length).toBe(2);
      expect(evidence.artifacts[0].id).toBe('ART-EV-001-0');
      expect(evidence.artifacts[0].evidenceId).toBe('EV-001');
      expect(evidence.artifacts[1].id).toBe('ART-EV-001-1');
      expect(evidence.artifacts[1].evidenceId).toBe('EV-001');
    });

    it('generates sequential evidence IDs', () => {
      const caseId = useCaseStore.getState().cases[0].id;

      useCaseStore.getState().addEvidence(caseId, { name: 'Ev 1', type: 'csv', hash: '', md5: '', size: 1, notes: '', artifacts: [] });
      useCaseStore.getState().addEvidence(caseId, { name: 'Ev 2', type: 'csv', hash: '', md5: '', size: 2, notes: '', artifacts: [] });

      const evidence = useCaseStore.getState().cases[0].evidence;
      expect(evidence.length).toBe(2);
      expect(evidence[0].id).toBe('EV-001');
      expect(evidence[1].id).toBe('EV-002');
    });

    it('does nothing if case ID does not exist', () => {
      useCaseStore.getState().addEvidence('NON-EXISTENT-CASE', {
        name: 'Hard Drive', type: 'csv', hash: '', md5: '', size: 1000000, notes: '', artifacts: []
      });

      expect(useCaseStore.getState().cases[0].evidence.length).toBe(0);
    });
  });

  describe('updateEvidenceNotes', () => {
    beforeEach(() => {
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });
      const caseId = useCaseStore.getState().cases[0].id;
      useCaseStore.getState().addEvidence(caseId, { name: 'Hard Drive', type: 'csv', hash: '', md5: '', size: 1, notes: '', artifacts: [] });
    });

    it('updates notes for specific evidence', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceId = useCaseStore.getState().cases[0].evidence[0].id;

      useCaseStore.getState().updateEvidenceNotes(caseId, evidenceId, 'Found suspicious files');

      const updatedEvidence = useCaseStore.getState().cases[0].evidence[0];
      expect(updatedEvidence.notes).toBe('Found suspicious files');
    });

    it('does nothing if case ID or evidence ID does not exist', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceId = useCaseStore.getState().cases[0].evidence[0].id;

      useCaseStore.getState().updateEvidenceNotes('NON-EXISTENT', evidenceId, 'Test notes');
      expect(useCaseStore.getState().cases[0].evidence[0].notes).toBe('');

      useCaseStore.getState().updateEvidenceNotes(caseId, 'NON-EXISTENT-EV', 'Test notes');
      expect(useCaseStore.getState().cases[0].evidence[0].notes).toBe('');
    });
  });

  describe('deleteEvidence', () => {
    beforeEach(() => {
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });
      const caseId = useCaseStore.getState().cases[0].id;
      useCaseStore.getState().addEvidence(caseId, { name: 'Hard Drive', type: 'csv', hash: '', md5: '', size: 1, notes: '', artifacts: [] });
      useCaseStore.getState().addEvidence(caseId, { name: 'USB', type: 'csv', hash: '', md5: '', size: 2, notes: '', artifacts: [] });
    });

    it('deletes specific evidence from a case', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceToDeleteId = useCaseStore.getState().cases[0].evidence[0].id;

      useCaseStore.getState().deleteEvidence(caseId, evidenceToDeleteId);

      const updatedCase = useCaseStore.getState().cases[0];
      expect(updatedCase.evidence.length).toBe(1);
      expect(updatedCase.evidence[0].name).toBe('USB'); // The second one remains
    });

    it('does nothing if case ID or evidence ID does not exist', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceId = useCaseStore.getState().cases[0].evidence[0].id;

      useCaseStore.getState().deleteEvidence('NON-EXISTENT', evidenceId);
      expect(useCaseStore.getState().cases[0].evidence.length).toBe(2);

      useCaseStore.getState().deleteEvidence(caseId, 'NON-EXISTENT-EV');
      expect(useCaseStore.getState().cases[0].evidence.length).toBe(2);
    });
  });

  describe('updateArtifact', () => {
    beforeEach(() => {
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });
      const caseId = useCaseStore.getState().cases[0].id;
      useCaseStore.getState().addEvidence(caseId, {
        name: 'Hard Drive', type: 'csv', hash: '', md5: '', size: 1, notes: '',
        artifacts: [{ id: '', evidenceId: '', data: { path: '/file.txt' }, isRelevant: false, notes: '' }]
      });
    });

    it('updates specific properties of an artifact', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceId = useCaseStore.getState().cases[0].evidence[0].id;
      const artifactId = useCaseStore.getState().cases[0].evidence[0].artifacts[0].id;

      useCaseStore.getState().updateArtifact(caseId, evidenceId, artifactId, { isRelevant: true });

      const updatedArtifact = useCaseStore.getState().cases[0].evidence[0].artifacts[0];
      expect(updatedArtifact.isRelevant).toBe(true);
      expect(updatedArtifact.data.path).toBe('/file.txt'); // Other properties preserved
    });

    it('does nothing if IDs are incorrect', () => {
      const caseId = useCaseStore.getState().cases[0].id;
      const evidenceId = useCaseStore.getState().cases[0].evidence[0].id;
      const artifactId = useCaseStore.getState().cases[0].evidence[0].artifacts[0].id;

      useCaseStore.getState().updateArtifact('WRONG_CASE', evidenceId, artifactId, { isRelevant: true });
      expect(useCaseStore.getState().cases[0].evidence[0].artifacts[0].isRelevant).toBe(false);

      useCaseStore.getState().updateArtifact(caseId, 'WRONG_EV', artifactId, { isRelevant: true });
      expect(useCaseStore.getState().cases[0].evidence[0].artifacts[0].isRelevant).toBe(false);

      useCaseStore.getState().updateArtifact(caseId, evidenceId, 'WRONG_ART', { isRelevant: true });
      expect(useCaseStore.getState().cases[0].evidence[0].artifacts[0].isRelevant).toBe(false);
    });
  });

  describe('updateBoard', () => {
    it('updates nodes and edges for a case', () => {
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });
      const caseId = useCaseStore.getState().cases[0].id;

      const nodes = [{ id: 'node1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }];
      const edges = [{ id: 'edge1', source: 'node1', target: 'node2' }];

      useCaseStore.getState().updateBoard(caseId, nodes, edges);

      const board = useCaseStore.getState().cases[0].board;
      expect(board).toBeDefined();
      expect(board?.nodes).toEqual(nodes);
      expect(board?.edges).toEqual(edges);
    });

    it('does nothing for non-existent case', () => {
      useCaseStore.getState().addCase({ name: 'Test Case', objective: '', notes: '', investigator: '' });

      const nodes = [{ id: 'node1', type: 'default', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }];
      const edges = [{ id: 'edge1', source: 'node1', target: 'node2' }];

      useCaseStore.getState().updateBoard('NON-EXISTENT', nodes, edges);

      const board = useCaseStore.getState().cases[0].board;
      expect(board).toBeUndefined();
    });
  });
});
