import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { EvidenceUploader } from '../components/EvidenceUploader';
import { ArtifactTable } from '../components/ArtifactTable';
import { EvidenceDetails } from '../components/EvidenceDetails';
import { FileText, ChevronRight } from 'lucide-react';

export const EvidenceWorkspace: React.FC = () => {
  const { id } = useParams();
  const { cases } = useCaseStore();
  const currentCase = cases.find(c => c.id === id);
  
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  if (!currentCase) {
    return <Navigate to="/" replace />;
  }

  const selectedEvidence = currentCase.evidence.find(e => e.id === selectedEvidenceId);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Sidebar - Evidence List */}
      <div className="w-64 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">Evidence Items</h2>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {currentCase.evidence.map(e => (
            <button
              key={e.id}
              onClick={() => setSelectedEvidenceId(e.id)}
              className={`w-full text-left px-3 py-3 rounded-lg border transition-colors flex items-center justify-between ${
                selectedEvidenceId === e.id
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm font-medium">{e.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 ${selectedEvidenceId === e.id ? 'text-blue-400' : 'text-neutral-600'}`} />
            </button>
          ))}
          {currentCase.evidence.length === 0 && (
            <p className="text-sm text-neutral-500 italic px-2">No evidence added yet.</p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {!selectedEvidence ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-md w-full">
              <EvidenceUploader caseId={currentCase.id} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Artifact Table */}
            <div className="flex-1 min-w-0 bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Artifact Explorer</h3>
                <button 
                  onClick={() => setSelectedEvidenceId(null)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  + Add New Evidence
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ArtifactTable 
                  caseId={currentCase.id} 
                  evidenceId={selectedEvidence.id} 
                  artifacts={selectedEvidence.artifacts} 
                />
              </div>
            </div>

            {/* Evidence Details Side Panel */}
            <div className="w-80 shrink-0">
              <EvidenceDetails caseId={currentCase.id} evidence={selectedEvidence} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
