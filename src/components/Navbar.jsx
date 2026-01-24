import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Activity, Menu, X, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isSimulator = location.pathname === '/device-simulator';
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine direction
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling DOWN and past threshold -> Hide
        setVisible(false);
      } else {
        // Scrolling UP or at top -> Show
        setVisible(true);
      }

      setScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Configure', path: '/configure' },
    { name: 'Device Health', path: '/device-health' },
    { name: 'Threat Detection', path: '/threat' },
    { name: 'Earthquake', path: '/earthquake' },
    { name: 'Emergency', path: '/emergency-dialer' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-500 border-b',
        scrolled
          ? 'bg-black/60 backdrop-blur-xl border-white/10 py-4 shadow-lg shadow-black/50'
          : isSimulator
            ? 'bg-black py-6 border-white/10' // Solid black for simulator page
            : 'bg-transparent border-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center h-10 w-10">
            <ShieldAlert className="absolute h-8 w-8 text-white transition-transform group-hover:scale-110" />
            <Activity className="absolute h-4 w-4 text-medical-blue animate-[pulse_3s_ease-in-out_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tighter text-white leading-none group-hover:text-blue-400 transition-colors">E-ResQ</span>
            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Guardian</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                location.pathname === item.path
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {item.name}
            </Link>
          ))}
          {/* Simulator Link */}
          <Link
            to="/device-simulator"
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2',
              location.pathname === '/device-simulator'
                ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <Smartphone className="w-4 h-4" /> Simulator
          </Link>
        </div>

        <div className="hidden lg:block">
          <Link
            to="/pre-book"
            className="relative overflow-hidden rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] group shadow-[0_0_10px_rgba(37,99,235,0.3)]"
          >
            <span className="relative z-10">Pre-Book Now</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10 overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'text-lg font-medium transition-colors py-2 border-b border-white/5',
                    location.pathname === item.path ? 'text-white' : 'text-white/60'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/device-simulator"
                onClick={() => setIsOpen(false)}
                className={clsx(
                  'text-lg font-medium transition-colors py-2 border-b border-white/5 flex items-center gap-2',
                  location.pathname === '/device-simulator' ? 'text-white' : 'text-white/60'
                )}
              >
                <Smartphone className="w-5 h-5" /> Simulator
              </Link>

              <Link
                to="/pre-book"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-center rounded-full bg-blue-600 px-6 py-3 text-lg font-bold text-white shadow-lg shadow-blue-900/30"
              >
                Pre-Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
