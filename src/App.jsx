import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Config from './pages/Config';
import DeviceHealth from './pages/DeviceHealth';
import Threat from './pages/Threat';
import Earthquake from './pages/Earthquake';
import EmergencyDialer from './pages/EmergencyDialer';
import DeviceSimulator from './pages/DeviceSimulator';
import PreBook from './pages/PreBook';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/configure" element={<Config />} />
          <Route path="/device-health" element={<DeviceHealth />} />
          <Route path="/threat" element={<Threat />} />
          <Route path="/earthquake" element={<Earthquake />} />
          <Route path="/emergency-dialer" element={<EmergencyDialer />} />
          <Route path="/device-simulator" element={<DeviceSimulator />} />
          <Route path="/pre-book" element={<PreBook />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
