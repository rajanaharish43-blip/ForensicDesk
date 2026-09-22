import React, { useState, useMemo } from 'react';
import type { Artifact } from '../types';
import { Search, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import { useCaseStore } from '../store/caseStore';

interface ArtifactTableProps {
  caseId: string;
  evidenceId: string;
  artifacts: Artifact[];
}

export const ArtifactTable: React.FC<ArtifactTableProps> = ({ caseId, evidenceId, artifacts }) => {
  const { updateArtifact } = useCaseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelevant, setFilterRelevant] = useState(false);

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(a => {
      if (filterRelevant && !a.isRelevant) return false;
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      // Search across all data values
      return Object.values(a.data).some(val => 
        String(val).toLowerCase().includes(searchLower)
      );
    });
  }, [artifacts, searchTerm, filterRelevant]);

  const toggleRelevance = (artifactId: string, current: boolean) => {
    updateArtifact(caseId, evidenceId, artifactId, { isRelevant: !current });
  };

  if (artifacts.length === 0) {
    return <div className="text-neutral-500 text-sm italic">No artifacts found in this evidence.</div>;
  }

  // Dynamically derive columns from all artifacts to handle varying schemas, limit to 8 for UI clarity
  const allKeys = new Set<string>();
  artifacts.forEach(a => {
    Object.keys(a.data).forEach(key => allKeys.add(key));
  });

  // Try to prioritize important columns like timestamp, ip, user, event
  const importantKeys = ['timestamp', 'time', 'date', 'ip', 'source_ip', 'destination_ip', 'user', 'username', 'event', 'action', 'result'];
  const columnsArray = Array.from(allKeys);
  const columns = columnsArray
    .sort((a, b) => {
      const aImportant = importantKeys.some(k => a.toLowerCase().includes(k));
      const bImportant = importantKeys.some(k => b.toLowerCase().includes(k));
      if (aImportant && !bImportant) return -1;
      if (!aImportant && bImportant) return 1;
      return 0;
    })
    .slice(0, 8);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search artifacts..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterRelevant(!filterRelevant)}
          title="Show only artifacts marked as relevant by the investigator"
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
            filterRelevant 
              ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          Investigator Marked Relevant
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-neutral-800 rounded-lg">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-neutral-900 sticky top-0">
            <tr>
              <th className="p-3 border-b border-neutral-800 w-10"></th>
              {columns.map(col => (
                <th key={col} className="p-3 border-b border-neutral-800 font-medium text-neutral-400 capitalize">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredArtifacts.map((artifact) => (
              <tr key={artifact.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                <td className="p-3 text-center">
                  <button title="Mark as relevant to the investigation" onClick={() => toggleRelevance(artifact.id, artifact.isRelevant)}>
                    {artifact.isRelevant ? (
                      <BookmarkCheck className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-neutral-600 hover:text-neutral-400" />
                    )}
                  </button>
                </td>
                {columns.map(col => (
                  <td key={col} className="p-3 text-neutral-300 truncate max-w-xs">
                    {String(artifact.data[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {filteredArtifacts.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-neutral-500">
                  No artifacts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
