import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CVEList from './pages/CVEList';
import CVEDetail from './pages/CVEDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cves/list" element={<CVEList />} />
        <Route path="/cves/:cveId" element={<CVEDetail />} />
      </Routes>
    </Router>
  );
}