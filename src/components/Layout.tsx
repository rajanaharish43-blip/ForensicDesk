import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { 
  Briefcase, 
  Files, 
  Clock, 
  Network, 
  FileText, 
  Settings,
  Menu
} from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC = () => {
  const { activeCaseId } = useCaseStore();
  const location = useLocation();

  const navItems = [
    { name: 'Case Overview', path: `/case/${activeCaseId}`, icon: Briefcase },
    { name: 'Evidence', path: `/case/${activeCaseId}/evidence`, icon: Files },
    { name: 'Timeline', path: `/case/${activeCaseId}/timeline`, icon: Clock },
    { name: 'Investigation Board', path: `/case/${activeCaseId}/board`, icon: Network },
    { name: 'Findings', path: `/case/${activeCaseId}/findings`, icon: FileText },
    { name: 'Report', path: `/case/${activeCaseId}/report`, icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-neutral-800">
          <Link to="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-blue-500">Forensic</span>Desk
          </Link>
        </div>

        {activeCaseId ? (
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-6 mb-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Current Case
              </p>
              <p className="text-sm font-medium text-neutral-200 truncate mt-1">
                {activeCaseId}
              </p>
            </div>
            
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-neutral-500">
            <Briefcase className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No active case selected</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-neutral-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-medium text-neutral-200">
              {activeCaseId ? 'Lab Workspace' : 'Dashboard'}
            </h2>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6 bg-neutral-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
