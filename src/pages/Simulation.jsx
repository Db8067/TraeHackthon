import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, ShieldAlert, Flame, Lock, X, CheckCircle, AlertOctagon } from 'lucide-react';
import { getContacts } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Simulation = () => {
  const [activeScenario, setActiveScenario] = useState(null); // 'medical', 'threat', 'fire', 'theft'
  const [contacts, setContacts] = useState([]);
  const [logs, setLogs] = useState([]);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), message, type, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const stopSimulation = () => {
    setActiveScenario(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Scenario Handlers
  const startMedical = () => {
    setActiveScenario('medical');
    addLog('Medical Emergency Triggered', 'error');
    
    // Simulate dialing sequence
    let delay = 1000;
    contacts.forEach((contact, index) => {
        if(contact.name && contact.phone) {
            setTimeout(() => {
                addLog(`Dialing ${contact.name} (${contact.relation})...`, 'info');
            }, delay);
            setTimeout(() => {
                 addLog(`SMS sent to ${contact.name} with Location: 34.0522° N, 118.2437° W`, 'success');
            }, delay + 1500);
            delay += 3000;
        }
    });
    
    setTimeout(() => {
        addLog('All contacts notified. Ambulance dispatch request sent.', 'success');
    }, delay + 1000);
  };

  const startThreat = async () => {
    setActiveScenario('threat');
    addLog('Threat Mode Activated', 'error');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      addLog('Camera activated. Recording started...', 'warning');
      
      // Simulate AI Detection
      setTimeout(() => {
        addLog('AI ANALYSIS: Aggressive behavior detected (Confidence: 98%)', 'error');
      }, 3000);

    } catch (err) {
      addLog('Camera access denied or unavailable.', 'error');
    }
  };

  const startFire = () => {
    setActiveScenario('fire');
    addLog('Fire Alarm Triggered manually', 'error');
    setTimeout(() => addLog('Dialing Fire Department...', 'warning'), 1000);
    setTimeout(() => addLog('Alerting Neighbors via Community Network...', 'info'), 2500);
    setTimeout(() => addLog('Sprinkler Systems Pre-Activated.', 'success'), 4000);
  };

  const startTheft = () => {
    setActiveScenario('theft');
    addLog('Silent Alarm / Theft Mode Activated', 'error');
    setTimeout(() => addLog('GPS Tracking Enabled. Update frequency: 5s', 'info'), 1000);
    setTimeout(() => addLog('Dialing Police Emergency Line...', 'warning'), 2000);
    setTimeout(() => addLog('Device Lock engaged. Data encryption started.', 'success'), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Simulation Controls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={startMedical}
                disabled={activeScenario}
                className="flex items-center justify-center p-6 bg-red-50 hover:bg-red-100 border-2 border-red-100 hover:border-red-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="bg-red-500 text-white p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Medical Panic</h3>
                  <p className="text-xs text-slate-500">Alerts Contacts M1-M4</p>
                </div>
              </button>

              <button 
                onClick={startThreat}
                disabled={activeScenario}
                className="flex items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-100 hover:border-blue-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="bg-blue-600 text-white p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Threat Mode</h3>
                  <p className="text-xs text-slate-500">Camera & AI Analysis</p>
                </div>
              </button>

              <button 
                onClick={startTheft}
                disabled={activeScenario}
                className="flex items-center justify-center p-6 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="bg-slate-700 text-white p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Theft Mode</h3>
                  <p className="text-xs text-slate-500">Silent Alarm & Track</p>
                </div>
              </button>

              <button 
                onClick={startFire}
                disabled={activeScenario}
                className="flex items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 border-2 border-orange-100 hover:border-orange-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="bg-orange-500 text-white p-3 rounded-full mr-4 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">Fire Guard</h3>
                  <p className="text-xs text-slate-500">Auto-call Fire Dept</p>
                </div>
              </button>
            </div>
          </div>

          {/* Active Scenario Visualizer */}
          <AnimatePresence>
            {activeScenario && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative"
              >
                <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                  <div className="flex items-center text-white">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                    <span className="font-mono font-bold uppercase tracking-wider">{activeScenario} SIMULATION ACTIVE</span>
                  </div>
                  <button onClick={stopSimulation} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-8 min-h-[300px] flex items-center justify-center relative">
                    {/* Threat Mode Camera Overlay */}
                    {activeScenario === 'threat' && (
                        <div className="relative w-full h-full min-h-[300px] bg-black rounded-lg overflow-hidden">
                             <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="w-full h-full object-cover absolute inset-0"
                             />
                             <div className="absolute top-4 left-4 bg-red-600/80 text-white px-3 py-1 rounded text-xs font-bold animate-pulse">
                                REC • LIVE
                             </div>
                             <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-3/4">
                                <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-red-500/50">
                                    <div className="flex items-center text-red-400 mb-2">
                                        <AlertOctagon className="w-4 h-4 mr-2" />
                                        <span className="font-bold text-sm">THREAT DETECTED</span>
                                    </div>
                                    <p className="text-white text-sm">Aggressive movement pattern identified. Uploading clip to secure cloud...</p>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* Other Scenarios UI */}
                    {activeScenario !== 'threat' && (
                        <div className="text-center">
                            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-medical-red animate-spin"></div>
                                {activeScenario === 'medical' && <Phone className="w-10 h-10 text-white" />}
                                {activeScenario === 'fire' && <Flame className="w-10 h-10 text-white" />}
                                {activeScenario === 'theft' && <Lock className="w-10 h-10 text-white" />}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 capitalize">{activeScenario} Alert in Progress</h3>
                            <p className="text-slate-400">System is executing emergency protocols...</p>
                        </div>
                    )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] lg:h-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
            <h3 className="font-bold text-slate-700">System Logs</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm">
            {logs.length === 0 && (
              <div className="text-center text-slate-400 mt-10 italic">
                No activity recorded. Ready to simulate.
              </div>
            )}
            {logs.map(log => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded border-l-4 ${
                    log.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' :
                    log.type === 'warning' ? 'bg-orange-50 border-orange-500 text-orange-800' :
                    log.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
                    'bg-slate-50 border-slate-400 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[10px] opacity-70">{log.time}</span>
                    {log.type === 'success' && <CheckCircle className="w-3 h-3" />}
                    {log.type === 'error' && <AlertOctagon className="w-3 h-3" />}
                </div>
                <div>{log.message}</div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <button 
                onClick={() => setLogs([])}
                className="text-xs text-slate-500 hover:text-slate-900 underline w-full text-center"
            >
                Clear Logs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Simulation;
