import React, { useState, useEffect } from 'react';
import { Activity, Battery, Wifi, MapPin, Smartphone, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusCard = ({ icon: Icon, label, value, status, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border border-slate-100"
  >
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 mr-4`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h4 className="text-lg font-bold text-slate-900">{value}</h4>
      </div>
    </div>
    <div className={`h-2 w-2 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Device Dashboard</h1>
            <p className="text-slate-500">Real-time status of your E-ResQ unit.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-700">System Online</span>
          </div>
        </header>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatusCard 
            icon={Wifi} 
            label="Connectivity" 
            value="4G LTE Strong" 
            status="good" 
            color="text-blue-600" 
          />
          <StatusCard 
            icon={Battery} 
            label="Battery Level" 
            value="92%" 
            status="good" 
            color="text-green-600" 
          />
          <StatusCard 
            icon={Cpu} 
            label="Processor" 
            value="Optimal Load" 
            status="good" 
            color="text-emerald-600" 
          />
          <StatusCard 
            icon={MapPin} 
            label="Location" 
            value="Home (Geo-Fenced)" 
            status="good" 
            color="text-purple-600" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map / Device View Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-500" /> Live Tracking
              </h3>
              <div className="text-xs font-mono text-slate-400">ID: ERESQ-8821X</div>
            </div>
            <div className="flex-1 bg-slate-200 relative">
               {/* Simulated Map */}
               <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-96 h-96 bg-blue-500/5 rounded-full animate-ping absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-64 h-64 bg-blue-500/10 rounded-full animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 bg-white p-2 rounded-full shadow-xl border-4 border-white">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-slate-900 text-white text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                        Last seen: Just now
                    </div>
                  </div>
               </div>
               
               <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-xl shadow-lg text-xs backdrop-blur-sm border border-white/50">
                  <div className="font-bold text-slate-900 mb-1">GPS Coordinates</div>
                  <div className="font-mono text-slate-600">34.0522° N, 118.2437° W</div>
                  <div className="text-slate-400 mt-1">Accuracy: ±5m</div>
               </div>
            </div>
          </div>

          {/* Device Health Column */}
          <div className="space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2 text-slate-500" /> Device Diagnostics
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">Storage Usage</span>
                            <span className="font-bold text-slate-700">12%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[12%] bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">Battery Health</span>
                            <span className="font-bold text-green-600">98%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-[98%] bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">Sensor Calibration</span>
                            <span className="font-bold text-slate-700">Good</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2 flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-2" /> Firmware
                    </h3>
                    <p className="text-blue-200 text-sm mb-4">Your device is running the latest security patch.</p>
                    <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-xs font-mono">
                        v2.4.1 (Stable)
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white/5">
                    <ShieldCheck className="w-32 h-32" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
