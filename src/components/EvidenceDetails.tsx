import React from 'react';
import type { Evidence } from '../types';
import { FileText, HardDrive, Hash, Calendar } from 'lucide-react';
import { useCaseStore } from '../store/caseStore';

interface EvidenceDetailsProps {
  caseId: string;
  evidence: Evidence;
}

export const EvidenceDetails: React.FC<EvidenceDetailsProps> = ({ caseId, evidence }) => {
  const { updateEvidenceNotes } = useCaseStore();

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateEvidenceNotes(caseId, evidence.id, e.target.value);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4 break-all">
        {evidence.name}
      </h3>

      <div className="space-y-4 mb-6 text-sm flex-1">
        <div>
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <HardDrive className="w-4 h-4" />
            <span>Size</span>
          </div>
          <p className="text-neutral-300 font-mono">{formatSize(evidence.size)}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Hash className="w-4 h-4" />
            <span>SHA-256</span>
          </div>
          <p className="text-neutral-300 font-mono text-xs break-all bg-neutral-950 p-2 rounded border border-neutral-800">
            {evidence.hash}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Imported</span>
          </div>
          <p className="text-neutral-300">
            {new Date(evidence.addedAt).toLocaleString()}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <FileText className="w-4 h-4" />
            <span>Artifacts</span>
          </div>
          <p className="text-neutral-300">
            {evidence.artifacts.length.toLocaleString()} entries
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <label className="flex items-center gap-2 text-neutral-500 mb-2 text-sm font-medium">
          Investigator Notes
        </label>
        <textarea
          className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[120px] resize-none"
          placeholder="Add findings or observations about this evidence..."
          value={evidence.notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  );
};
