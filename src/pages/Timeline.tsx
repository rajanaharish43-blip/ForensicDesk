import React, { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { buildTimeline } from '../engine/timeline';
import { Filter, BookmarkCheck, Bookmark, Clock, HardDrive } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { id } = useParams();
  const { cases, updateArtifact } = useCaseStore();
  const currentCase = cases.find(c => c.id === id);

  const [investigationMode, setInvestigationMode] = useState(false);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('all');

  if (!currentCase) {
    return <Navigate to="/" replace />;
  }

  // Build the complete timeline from all evidence sources
  const fullTimeline = useMemo(() => buildTimeline(currentCase.evidence), [currentCase.evidence]);

  // Apply filters
  const filteredTimeline = useMemo(() => {
    return fullTimeline.filter(event => {
      if (investigationMode && !event.isRelevant) return false;
      if (selectedEvidenceId !== 'all' && event.evidenceId !== selectedEvidenceId) return false;
      return true;
    });
  }, [fullTimeline, investigationMode, selectedEvidenceId]);

  const toggleRelevance = (evidenceId: string, artifactId: string, current: boolean) => {
    updateArtifact(currentCase.id, evidenceId, artifactId, { isRelevant: !current });
  };

  const formatTime = (ms: number) => {
    if (ms === 0) return 'Unknown Time';
    return new Date(ms).toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Timeline Engine</h2>
          <p className="text-neutral-400 mt-1">Reconstruct the sequence of events.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-2 rounded-lg">
          <div className="flex items-center gap-2 border-r border-neutral-700 pr-4">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select 
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              value={selectedEvidenceId}
              onChange={(e) => setSelectedEvidenceId(e.target.value)}
            >
              <option value="all">All Evidence Sources</option>
              {currentCase.evidence.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setInvestigationMode(!investigationMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              investigationMode 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {investigationMode ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            Investigation Mode (Relevant Only)
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative">
        {filteredTimeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p>No events found matching the current filters.</p>
          </div>
        ) : (
          <div className="relative border-l border-neutral-700 ml-4 py-4 space-y-8">
            {filteredTimeline.map((event) => (
              <div key={event.id} className="relative pl-8 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-neutral-900 ${
                  event.isRelevant ? 'bg-blue-400' : 'bg-neutral-600'
                }`} />
                
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-blue-400 font-mono">
                        {formatTime(event.normalizedTime)}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-300">
                          {event.type || 'Event'}
                        </span>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{event.evidenceName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleRelevance(event.evidenceId, event.id, event.isRelevant)}
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {event.isRelevant ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-neutral-600 hover:text-neutral-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-3 text-sm text-neutral-300">
                    <pre className="whitespace-pre-wrap font-sans bg-neutral-900/50 p-3 rounded border border-neutral-800">
                      {/* Render the first 3 keys of data to avoid massive blobs, or custom formatting based on type */}
                      {Object.entries(event.data)
                        .filter(([key]) => !['timestamp', 'time', 'type', 'event'].includes(key.toLowerCase()))
                        .slice(0, 5)
                        .map(([key, val]) => (
                          <div key={key} className="mb-1">
                            <span className="text-neutral-500 capitalize">{key}: </span>
                            <span>{String(val)}</span>
                          </div>
                        ))}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
