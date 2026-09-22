import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { Plus, FolderOpen, Clock, Download } from 'lucide-react';
import { compromisedAccountScenario } from '../scenarios/scenario-1';

export const Dashboard: React.FC = () => {
  const { cases, addCase, setActiveCase } = useCaseStore();
  const navigate = useNavigate();
  const [showNewCase, setShowNewCase] = useState(false);
  
  const [newCaseData, setNewCaseData] = useState({
    name: '',
    investigator: '',
    objective: '',
    notes: ''
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    addCase(newCaseData);
    setShowNewCase(false);
    setNewCaseData({ name: '', investigator: '', objective: '', notes: '' });
  };

  const handleOpenCase = (id: string) => {
    setActiveCase(id);
    navigate(`/case/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Active Cases</h1>
          <p className="text-neutral-400 mt-1">Manage and access your forensic investigations.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              addCase(compromisedAccountScenario as any);
            }}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Load Demo Investigation
          </button>
          <button
            onClick={() => setShowNewCase(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {showNewCase && (
        <div className="mb-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Case</h2>
          <form onSubmit={handleCreateCase} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Case Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                  value={newCaseData.name}
                  onChange={e => setNewCaseData({ ...newCaseData, name: e.target.value })}
                  placeholder="e.g. Suspicious Employee Activity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Investigator Name</label>
                <input
                  required
                  type="text"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                  value={newCaseData.investigator}
                  onChange={e => setNewCaseData({ ...newCaseData, investigator: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-1">Investigation Objective</label>
              <textarea
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                value={newCaseData.objective}
                onChange={e => setNewCaseData({ ...newCaseData, objective: e.target.value })}
                placeholder="Determine how the attacker gained access..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewCase(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
              >
                Create Case
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map(c => (
          <div 
            key={c.id} 
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-colors cursor-pointer group flex flex-col"
            onClick={() => handleOpenCase(c.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                {c.id}
              </span>
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {c.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {c.name}
            </h3>
            <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-1">
              {c.objective}
            </p>
            <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-800 pt-4 mt-auto">
              <div className="flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                <span>{c.investigator}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}

        {cases.length === 0 && !showNewCase && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-neutral-800 rounded-xl">
            <FolderOpen className="w-12 h-12 text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-300">No cases found</h3>
            <p className="text-neutral-500 mt-1 mb-4">Get started by creating a new forensic case or load a demo.</p>
            <div className="flex gap-4">
              <button
                onClick={() => addCase(compromisedAccountScenario as any)}
                className="text-neutral-400 hover:text-white font-medium text-sm bg-neutral-800 px-4 py-2 rounded"
              >
                Load Demo Investigation
              </button>
              <button
                onClick={() => setShowNewCase(true)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm bg-blue-900/30 px-4 py-2 rounded"
              >
                + Create your first case
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
