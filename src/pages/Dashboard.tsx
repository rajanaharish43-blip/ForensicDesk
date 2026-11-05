import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { Plus, FolderOpen, Clock3, ArrowUpRight, Database, ShieldCheck } from 'lucide-react';
import { compromisedAccountScenario } from '../scenarios/scenario-1';

export const Dashboard: React.FC = () => {
  const { cases, addCase, setActiveCase } = useCaseStore();
  const navigate = useNavigate();
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCaseData, setNewCaseData] = useState({ name: '', investigator: '', objective: '', notes: '' });
  const handleCreateCase = (e: React.FormEvent) => { e.preventDefault(); addCase(newCaseData); setShowNewCase(false); setNewCaseData({ name: '', investigator: '', objective: '', notes: '' }); };
  const openCase = (id: string) => { setActiveCase(id); navigate(`/case/${id}`); };
  const totalEvidence = cases.reduce((sum, c) => sum + c.evidence.length, 0);
  const totalArtifacts = cases.reduce((sum, c) => sum + c.evidence.reduce((n, e) => n + e.artifacts.length, 0), 0);

  return <div className="mx-auto max-w-[1400px]">
    <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div><p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300">Investigation control room</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Case registry</h1><p className="mt-2 max-w-xl text-sm text-neutral-500">A focused workspace for preserving evidence, reconstructing activity, and documenting defensible findings.</p></div>
      <div className="flex gap-2"><button onClick={() => addCase(compromisedAccountScenario as any)} className="border border-[#33404f] px-3 py-2 text-sm text-neutral-300 hover:border-blue-400/60 hover:text-white">Load demonstration case</button><button onClick={() => setShowNewCase(true)} className="flex items-center gap-2 bg-blue-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-blue-400"><Plus size={16} />New case</button></div>
    </div>
    <div className="mb-8 grid grid-cols-1 border-y border-[#26303b] sm:grid-cols-3">
      {([
        { label: 'Active cases', value: cases.filter(c => c.status === 'Active').length, icon: FolderOpen },
        { label: 'Evidence sources', value: totalEvidence, icon: Database },
        { label: 'Indexed artifacts', value: totalArtifacts, icon: ShieldCheck },
      ] as const).map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 border-b border-[#26303b] px-4 py-4 sm:border-b-0 sm:border-r last:border-0"><Icon size={18} className="text-blue-300" /><div><p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value}</p></div></div>)}
    </div>
    {showNewCase && <form onSubmit={handleCreateCase} className="mb-8 border border-[#33404f] bg-[#11161d] p-5"><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-blue-300">New record</p><h2 className="mt-1 text-lg font-medium text-white">Create investigation</h2></div><button type="button" onClick={() => setShowNewCase(false)} className="text-xs text-neutral-500 hover:text-white">Cancel</button></div><div className="grid gap-4 md:grid-cols-2"><label className="text-xs text-neutral-500">Case name<input required value={newCaseData.name} onChange={e => setNewCaseData({ ...newCaseData, name: e.target.value })} className="mt-2 w-full border border-[#33404f] bg-[#0a0d11] px-3 py-2 text-sm text-white" /></label><label className="text-xs text-neutral-500">Investigator<input required value={newCaseData.investigator} onChange={e => setNewCaseData({ ...newCaseData, investigator: e.target.value })} className="mt-2 w-full border border-[#33404f] bg-[#0a0d11] px-3 py-2 text-sm text-white" /></label><label className="text-xs text-neutral-500 md:col-span-2">Objective<textarea required value={newCaseData.objective} onChange={e => setNewCaseData({ ...newCaseData, objective: e.target.value })} className="mt-2 min-h-20 w-full border border-[#33404f] bg-[#0a0d11] px-3 py-2 text-sm text-white" /></label></div><button className="mt-5 bg-blue-500 px-4 py-2 text-sm font-medium text-slate-950">Create case</button></form>}
    <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-medium text-white">Investigations</h2><p className="mt-1 text-xs text-neutral-500">Select a case to open its evidence workspace.</p></div><span className="font-mono text-xs text-neutral-600">{cases.length.toString().padStart(2, '0')} records</span></div>
    <div className="divide-y divide-[#26303b] border-y border-[#26303b]">{cases.map(c => <button key={c.id} onClick={() => openCase(c.id)} className="group grid w-full gap-4 px-2 py-5 text-left transition-colors hover:bg-white/[0.03] md:grid-cols-[minmax(0,1.7fr)_1fr_150px_24px] md:items-center"><div><div className="flex items-center gap-3"><span className="font-mono text-xs text-blue-300">{c.id}</span><span className="border border-emerald-400/30 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">{c.status}</span></div><h3 className="mt-2 text-base font-medium text-neutral-100 group-hover:text-blue-200">{c.name}</h3><p className="mt-1 line-clamp-1 text-xs text-neutral-500">{c.objective}</p></div><div><p className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">Investigator</p><p className="mt-1 text-sm text-neutral-300">{c.investigator}</p></div><div><p className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">Created</p><p className="mt-1 flex items-center gap-1 text-xs text-neutral-400"><Clock3 size={13} />{new Date(c.createdAt).toLocaleDateString()}</p></div><ArrowUpRight size={17} className="text-neutral-600 group-hover:text-blue-300" /></button>)}{cases.length === 0 && <div className="py-16 text-center"><FolderOpen className="mx-auto text-neutral-700" size={30} /><p className="mt-3 text-sm text-neutral-400">No investigations yet.</p><button onClick={() => setShowNewCase(true)} className="mt-4 text-sm text-blue-300 hover:text-blue-200">Create your first case</button></div>}</div>
  </div>;
};
