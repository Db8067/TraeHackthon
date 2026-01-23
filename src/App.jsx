import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

// Wrapper component to handle AnimatePresence logic
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
            <PageWrapper>
                {/* Split Architecture: Mobile vs Desktop */}
                <div className="md:hidden">
                    <MobileDeviceScroll />
                </div>
                <div className="hidden md:block">
                    <DeviceScroll />
                </div>
            </PageWrapper>
        } />
        <Route path="/configure" element={<PageWrapper><Config /></PageWrapper>} />
        <Route path="/device-health" element={<PageWrapper><DeviceHealth /></PageWrapper>} />
        <Route path="/threat" element={<PageWrapper><Threat /></PageWrapper>} />
        <Route path="/earthquake" element={<PageWrapper><Earthquake /></PageWrapper>} />
        <Route path="/emergency-dialer" element={<PageWrapper><EmergencyDialer /></PageWrapper>} />
        <Route path="/device-simulator" element={<PageWrapper><DeviceSimulator /></PageWrapper>} />
        <Route path="/pre-book" element={<PageWrapper><PreBook /></PageWrapper>} />
        <Route path="/thank-you" element={<PageWrapper><ThankYou /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

// Page Transition Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <Router>
      {/* Global Theme: Pure Dark Mode #050505 */}
      <div className="min-h-screen bg-[#050505] font-sans text-white selection:bg-medical-blue selection:text-white">
        <Navbar />
        <div className="pt-20"> {/* Add padding for fixed header */}
             <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
