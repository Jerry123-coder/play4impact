import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Play4ImpactPage from './pages/Play4ImpactPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundsPolicy from './pages/RefundsPolicy';
import SalesDashboard from './pages/SalesDashboard';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Play4ImpactPage />} />
        <Route path="/play" element={<Play4ImpactPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refunds" element={<RefundsPolicy />} />
        <Route path="/dashboard" element={<SalesDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
