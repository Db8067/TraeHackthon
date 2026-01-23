import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Settings, Activity, Menu, X, Smartphone, Video, Phone, PlayCircle, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: ShieldAlert },
    { name: 'Device Health', path: '/device-health', icon: Activity },
    { name: 'Threat', path: '/threat', icon: Video },
    { name: 'Earthquake', path: '/earthquake', icon: Activity },
    { name: 'Simulator', path: '/device-simulator', icon: PlayCircle },
    { name: 'Dialer', path: '/emergency-dialer', icon: Phone },
    { name: 'Configure', path: '/configure', icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-[90] transition-all duration-300",
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-2 shadow-2xl shadow-black/50" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-medical-red to-red-900 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white leading-none">E-ResQ</span>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">System v3.0</span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center space-x-1 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
          </div>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
             <Link 
                to="/pre-book"
                className="hidden md:flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
             >
                <ShoppingBag className="w-4 h-4" />
                <span>Pre-Book</span>
             </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = location.pathname === item.path;
                 return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3 opacity-70" />
                    {item.name}
                  </Link>
                );
              })}
               <Link 
                to="/pre-book"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-bold text-white mt-4 shadow-lg shadow-blue-900/20"
             >
                <ShoppingBag className="w-5 h-5" />
                <span>Pre-Book Device</span>
             </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
