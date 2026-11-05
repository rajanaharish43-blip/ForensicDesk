import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { Briefcase, Files, Clock, Network, FileText, ClipboardList, Menu, X, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC = () => {
  const { activeCaseId, cases } = useCaseStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentCase = cases.find(c => c.id === activeCaseId);

  const navItems = [
    { name: 'Case overview', path: `/case/${activeCaseId}`, icon: Briefcase },
    { name: 'Evidence & artifacts', path: `/case/${activeCaseId}/evidence`, icon: Files },
    { name: 'Timeline', path: `/case/${activeCaseId}/timeline`, icon: Clock },
    { name: 'Investigation board', path: `/case/${activeCaseId}/board`, icon: Network },
    { name: 'Findings', path: `/case/${activeCaseId}/findings`, icon: ClipboardList },
    { name: 'Report', path: `/case/${activeCaseId}/report`, icon: FileText },
  ];

  const sidebar = (
    <aside className="flex h-full w-[270px] shrink-0 flex-col border-r border-[#26303b] bg-[#0f141a]">
      <div className="flex h-[72px] items-center justify-between border-b border-[#26303b] px-5">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-white">
          <span className="flex h-8 w-8 items-center justify-center border border-blue-400/40 bg-blue-400/10 font-mono text-xs text-blue-300">FD</span>
          FORENSICDESK
        </Link>
        <button className="lg:hidden text-neutral-400" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      {currentCase ? (
        <div className="flex-1 overflow-y-auto px-3 py-5 fd-scrollbar">
          <div className="mb-5 border-b border-[#26303b] px-2 pb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">Active investigation</p>
            <p className="mt-2 truncate text-sm font-medium text-neutral-100">{currentCase.name}</p>
            <p className="mt-1 font-mono text-xs text-blue-300">{currentCase.id}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return <Link key={item.name} to={item.path} onClick={() => setMobileOpen(false)} className={clsx('flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors', active ? 'border-blue-400 bg-blue-400/10 text-blue-200' : 'border-transparent text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-100')}>
                <item.icon size={16} strokeWidth={1.7} />{item.name}
              </Link>;
            })}
          </nav>
        </div>
      ) : <div className="flex flex-1 flex-col items-center justify-center px-8 text-center text-neutral-600"><Briefcase size={30} /><p className="mt-3 text-xs">Select an investigation to begin.</p></div>}
      <div className="border-t border-[#26303b] p-4">
        <button onClick={() => navigate('/')} className="flex w-full items-center gap-2 px-2 py-2 text-xs text-neutral-500 hover:text-neutral-200"><ChevronLeft size={14} />All investigations</button>
      </div>
    </aside>
  );

  return <div className="flex h-screen overflow-hidden bg-[#0a0d11] text-neutral-300">
    <div className={clsx('fixed inset-y-0 left-0 z-30 transition-transform lg:static lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>{sidebar}</div>
    {mobileOpen && <button className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex min-h-[72px] items-center justify-between border-b border-[#26303b] bg-[#0f141a]/90 px-4 sm:px-7">
        <div className="flex items-center gap-3">
          <button className="text-neutral-400 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{currentCase ? 'Investigation workspace' : 'Case registry'}</p><p className="mt-1 text-sm text-neutral-200">{currentCase?.name || 'ForensicDesk'}</p></div>
        </div>
        {currentCase && <div className="hidden items-center gap-4 sm:flex"><span className="font-mono text-xs text-neutral-500">{currentCase.evidence.length} evidence sources</span><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-xs text-emerald-300">{currentCase.status}</span></div>}
      </header>
      <div className="fd-scrollbar flex-1 overflow-auto p-4 sm:p-7"><Outlet /></div>
    </main>
  </div>;
};
