import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Settings, Activity, Menu, X, Smartphone, Video, Phone, PlayCircle, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: ShieldAlert },
    { name: 'Pre-Book', path: '/pre-book', icon: ShoppingBag, highlight: true },
    { name: 'Device Health', path: '/device-health', icon: Activity },
    { name: 'Threat', path: '/threat', icon: Video },
    { name: 'Earthquake', path: '/earthquake', icon: Activity },
    { name: 'Simulator', path: '/device-simulator', icon: PlayCircle },
    { name: 'Dialer', path: '/emergency-dialer', icon: Phone },
    { name: 'Configure', path: '/configure', icon: Settings },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <ShieldAlert className="h-8 w-8 text-medical-red group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-wider">E-ResQ <span className="text-xs text-slate-400 font-normal">v3.0</span></span>
            </Link>
          </div>
          
          <div className="hidden xl:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-medical-red text-white shadow-md shadow-red-900/20'
                        : item.highlight 
                            ? 'bg-white text-slate-900 hover:bg-slate-200' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${item.highlight ? 'text-red-600' : ''}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="-mr-2 flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-slate-900 border-t border-slate-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = location.pathname === item.path;
                 return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      'flex items-center px-3 py-2 rounded-md text-base font-medium',
                      isActive
                        ? 'bg-medical-red text-white'
                        : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
