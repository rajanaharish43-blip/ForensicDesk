import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { Target, User, Calendar, FileText } from 'lucide-react';

export const CaseOverview: React.FC = () => {
  const { id } = useParams();
  const { cases } = useCaseStore();
  
  const currentCase = cases.find(c => c.id === id);

  if (!currentCase) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
            {currentCase.id}
          </span>
          <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
            {currentCase.status}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{currentCase.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <User className="w-4 h-4" />
            <h3 className="text-sm font-medium">Investigator</h3>
          </div>
          <p className="text-lg font-medium text-white">{currentCase.investigator}</p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-medium">Created</h3>
          </div>
          <p className="text-lg font-medium text-white">
            {new Date(currentCase.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <FileText className="w-4 h-4" />
            <h3 className="text-sm font-medium">Findings</h3>
          </div>
          <p className="text-lg font-medium text-white">{currentCase.findings?.length || 0}</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 text-neutral-200 mb-4 pb-4 border-b border-neutral-800">
          <Target className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold">Investigation Objective</h2>
        </div>
        <p className="text-neutral-400 whitespace-pre-wrap leading-relaxed">
          {currentCase.objective}
        </p>
      </div>

      {currentCase.notes && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-200 mb-4 pb-4 border-b border-neutral-800">
            Case Notes
          </h2>
          <p className="text-neutral-400 whitespace-pre-wrap leading-relaxed">
            {currentCase.notes}
          </p>
        </div>
      )}
    </div>
  );
};
