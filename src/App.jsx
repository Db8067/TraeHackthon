import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DeviceScroll from './components/landing/DeviceScroll';
import MobileDeviceScroll from './components/landing/MobileDeviceScroll';
import Config from './pages/Config';
import DeviceHealth from './pages/DeviceHealth';
import Threat from './pages/Threat';
import Earthquake from './pages/Earthquake';
import EmergencyDialer from './pages/EmergencyDialer';
import DeviceSimulator from './pages/DeviceSimulator';
import PreBook from './pages/PreBook';
import ThankYou from './pages/ThankYou';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
          <div className="w-full">
              {/* Split Architecture: Mobile vs Desktop */}
              <div className="md:hidden">
                  <MobileDeviceScroll />
              </div>
              <div className="hidden md:block">
                  <DeviceScroll />
              </div>
          </div>
      } />
      <Route path="/configure" element={<Config />} />
      <Route path="/device-health" element={<DeviceHealth />} />
      <Route path="/threat" element={<Threat />} />
      <Route path="/earthquake" element={<Earthquake />} />
      <Route path="/emergency-dialer" element={<EmergencyDialer />} />
      <Route path="/device-simulator" element={<DeviceSimulator />} />
      <Route path="/pre-book" element={<PreBook />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      {/* Global Theme: Pure Dark Mode #050505 */}
      <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-blue-500 selection:text-white">
        <Navbar />
        <div className="pt-0"> 
             <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
