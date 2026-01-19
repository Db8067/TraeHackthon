import React, { useState, useEffect, useRef } from 'react';
import { getContacts } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Flame, Lock, Activity, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeviceSimulator = () => {
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    setContacts(getContacts());
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      // Use facingMode to prefer front camera on mobile
      const constraints = { 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      // Fallback to basic constraint if specific ones fail
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
          console.error("Fallback camera access failed:", fallbackErr);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const showFeedback = (message, icon, color = 'bg-slate-900') => {
    setFeedback({ message, icon, color });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleMButton = (index) => {
    const contact = contacts[index]; // contacts is array of 4
    if (contact && contact.name) {
      showFeedback(`Calling ${contact.name}...`, <Phone className="w-6 h-6 text-white" />, 'bg-green-600');
    } else {
      showFeedback(`M${index + 1} Not Configured`, <Phone className="w-6 h-6 text-white" />, 'bg-slate-600');
    }
  };

  const handleThreat = () => {
    navigate('/threat');
  };

  const handleTheft = () => {
    showFeedback("Silent Alarm: Alerting Police (911)...", <Lock className="w-6 h-6 text-white" />, 'bg-blue-600');
  };

  const handleFire = () => {
    showFeedback("Fire Alert: Dialing Fire Dept...", <Flame className="w-6 h-6 text-white" />, 'bg-orange-600');
  };

  const handleEarthquake = () => {
    navigate('/earthquake');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="z-10 text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Device Simulator</h1>
        <p className="text-slate-500">Interactive Hardware Demo. Click the buttons on the device.</p>
      </div>

      <div className="relative z-10 w-[320px] h-[640px] select-none scale-90 sm:scale-100 transition-transform">
        
        {/* 
            Container for the "Uploaded Image". 
            Since we don't have the real file, we use a CSS representation that acts as the visual base.
            The "Overlay" buttons are positioned absolutely on top of this visual.
        */}
        <div className="w-full h-full bg-slate-800 rounded-[3rem] shadow-2xl border-[6px] border-slate-700 relative overflow-hidden ring-4 ring-black/20">
             
             {/* VISUAL LAYER (The "Image") */}
             <div className="absolute inset-0 pointer-events-none">
                 {/* Screen */}
                 <div className="absolute top-16 left-5 right-5 h-48 bg-black rounded-lg border-2 border-slate-600 overflow-hidden z-20">
                    <div className="w-full h-full relative">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover absolute inset-0"
                        />
                        <div className="absolute bottom-2 left-0 right-0 text-center">
                            <div className="inline-block bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-mono">
                                SYSTEM READY • LIVE
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Button Visuals */}
                 <div className="absolute top-[300px] left-5 right-5">
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {[1,2,3,4].map(n => (
                            <div key={n} className="h-12 bg-slate-700 rounded-md border-b-4 border-slate-900 flex items-center justify-center text-slate-300 font-bold shadow-lg">M{n}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                         <div className="h-20 bg-red-800 rounded-lg border-b-4 border-red-950 flex flex-col items-center justify-center text-white shadow-lg">
                            <Activity className="w-6 h-6 mb-1"/>
                            <span className="text-[9px] font-bold">THREAT</span>
                         </div>
                         <div className="h-20 bg-slate-600 rounded-lg border-b-4 border-slate-800 flex flex-col items-center justify-center text-white shadow-lg">
                            <Lock className="w-6 h-6 mb-1"/>
                            <span className="text-[9px] font-bold">THEFT</span>
                         </div>
                         <div className="h-20 bg-orange-700 rounded-lg border-b-4 border-orange-900 flex flex-col items-center justify-center text-white shadow-lg">
                            <Flame className="w-6 h-6 mb-1"/>
                            <span className="text-[9px] font-bold">FIRE</span>
                         </div>
                    </div>
                 </div>

                 <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-56 h-12 bg-slate-900 rounded-full border border-slate-600 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-500 mr-2" />
                    <span className="text-emerald-500 font-mono text-xs tracking-widest">EARTHQUAKE SENSOR</span>
                 </div>
             </div>

             {/* INTERACTIVE OVERLAY LAYER (Invisible Clickable Areas) */}
             {/* M1-M4 Click Areas */}
             <div className="absolute top-[300px] left-5 right-5 h-12 flex justify-between gap-3 z-30">
                {[0, 1, 2, 3].map((i) => (
                    <div 
                        key={i}
                        onClick={() => handleMButton(i)}
                        className="flex-1 cursor-pointer hover:bg-white/10 rounded-md transition-colors active:scale-95"
                        title={`Call M${i+1}`}
                    ></div>
                ))}
             </div>

             {/* Action Buttons Click Areas */}
             <div className="absolute top-[370px] left-5 right-5 h-20 flex justify-between gap-3 z-30">
                <div onClick={handleThreat} className="flex-1 cursor-pointer hover:bg-white/10 rounded-lg transition-colors active:scale-95" title="Threat Mode"></div>
                <div onClick={handleTheft} className="flex-1 cursor-pointer hover:bg-white/10 rounded-lg transition-colors active:scale-95" title="Theft Alert"></div>
                <div onClick={handleFire} className="flex-1 cursor-pointer hover:bg-white/10 rounded-lg transition-colors active:scale-95" title="Fire Alert"></div>
             </div>

             {/* Earthquake Sensor Click Area */}
             <div 
                onClick={handleEarthquake}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-56 h-12 cursor-pointer hover:bg-white/5 rounded-full transition-colors active:scale-95 z-30"
                title="Earthquake Sensor"
             ></div>

        </div>
      </div>

      {/* Feedback Popup */}
      <AnimatePresence>
        {feedback && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 z-50 ${feedback.color} border border-white/20`}
            >
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    {feedback.icon}
                </div>
                <span className="text-white font-bold text-base whitespace-nowrap">{feedback.message}</span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeviceSimulator;
