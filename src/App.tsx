
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CaseOverview } from './pages/CaseOverview';
import { EvidenceWorkspace } from './pages/EvidenceWorkspace';
import { Timeline } from './pages/Timeline';
import { InvestigationBoard } from './pages/InvestigationBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="case/:id" element={<CaseOverview />} />
          <Route path="case/:id/evidence" element={<EvidenceWorkspace />} />
          <Route path="case/:id/timeline" element={<Timeline />} />
          <Route path="case/:id/board" element={<InvestigationBoard />} />
          <Route path="case/:id/findings" element={<div className="p-8 text-neutral-500">Findings Module (Phase 8)</div>} />
          <Route path="case/:id/report" element={<div className="p-8 text-neutral-500">Report Engine (Phase 8)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
