import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CaseOverview } from './pages/CaseOverview';
import { EvidenceWorkspace } from './pages/EvidenceWorkspace';
import { Timeline } from './pages/Timeline';
import { InvestigationBoard } from './pages/InvestigationBoard';
import { Report } from './pages/Report';
import { Findings } from './pages/Findings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="case/:id" element={<CaseOverview />} />
          <Route path="case/:id/evidence" element={<EvidenceWorkspace />} />
          <Route path="case/:id/timeline" element={<Timeline />} />
          <Route path="case/:id/board" element={<InvestigationBoard />} />
          <Route path="case/:id/findings" element={<Findings />} />
          <Route path="case/:id/report" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
