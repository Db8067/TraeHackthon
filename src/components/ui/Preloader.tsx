import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity } from 'lucide-react';

export const Preloader: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Cinematic Background Glow */}
        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full scale-150 animate-pulse"></div>

        <div className="relative h-32 w-32 mb-10">
          {/* Animated Rings - Cinematic Speed */}
          <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Center Logo Pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <Activity className="absolute w-6 h-6 text-blue-400 animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] text-white/90 uppercase mb-4 text-center px-4 drop-shadow-lg">
          E-ResQ System
        </h2>
        
        <div className="flex flex-col items-center gap-2">
            <div className="font-mono text-xs tracking-widest text-blue-400">
                INITIALIZING CORE MODULES
            </div>
            <div className="font-mono text-sm text-white/40">
                {progress}% COMPLETE
            </div>
        </div>
        
        <div className="mt-10 h-[2px] w-64 md:w-80 overflow-hidden bg-white/5 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2 absolute top-0"
            animate={{ x: [-200, 400] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="h-full bg-blue-600 origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
