import React, { useState, useEffect, useRef } from 'react';
import { getContacts } from '../utils/storage'; // Fallback
import { supabase } from '../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Flame, Lock, Activity, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeviceSimulator = () => {
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isFireActive, setIsFireActive] = useState(false);

  // Use Proxy URL (See vite.config.ts)
  const PROXY_URL = "/api/device";

  // Helper to communicate with ESP32
  const triggerDevice = async (endpoint) => {
    try {
      console.log(`Sending command to device: ${endpoint}`);
      // Use the proxy URL
      await fetch(`${PROXY_URL}/${endpoint}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error("Failed to connect to ESP32:", error);
      console.log("Make sure the device is on and connected to the same network.");
    }
  };

  useEffect(() => {
    const loadContacts = async () => {
        // Try Supabase first
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('priority', { ascending: true });
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                // Map to our structure
                const mapped = [];
                for(let i=0; i<4; i++) {
                    const found = data.find(c => c.priority === i);
                    if (found) mapped[i] = { ...found, id: `m${i+1}` };
                    else mapped[i] = { id: `m${i+1}`, name: '', phone: '' }; // Empty slot
                }
                setContacts(mapped);
                console.log("Loaded contacts from Supabase:", mapped);
            } else {
                // Fallback to local storage if DB empty
                setContacts(getContacts());
            }
        } catch (err) {
            console.error("Supabase load failed, falling back to local:", err);
            setContacts(getContacts());
        }
    };
    loadContacts();

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

    // Simplified Trigger
    const triggerTwilio = async (type, contact, message) => {
        // Dynamic Backend URL for Production vs Localhost
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';
        
        // Ensure we have a valid number
        let number = contact?.phone || '+918527296771'; 
        if (number.match(/^\d{10}$/)) number = `+91${number}`;
        
        console.log(`[Frontend] Requesting Call & WhatsApp to: ${number}`);

        // 1. TRIGGER CALL
        fetch(`${BACKEND_URL}/call`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ to: number }) 
        }).catch(e => console.error("Call Error:", e));

        // 2. TRIGGER WHATSAPP (Parallel)
        fetch(`${BACKEND_URL}/whatsapp`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ to: number, message: message }) 
        }).catch(e => console.error("WhatsApp Error:", e));
    };

    const handleMButton = (index) => {
        const contact = contacts[index] || { name: `M${index+1}`, phone: '' }; 
        showFeedback(`Calling ${contact.name}...`, <Phone className="w-6 h-6 text-white" />, 'bg-green-600');
        triggerDevice('call');
        
        // Custom Message for M-Buttons
        const msg = "Emergency at home, get back to home";
        triggerTwilio('emergency', contact, msg);
    };

    const handleThreat = () => {
        showFeedback("Threat Alert! Notifying M1...", <Activity className="w-6 h-6 text-white" />, 'bg-red-800');
        navigate('/threat'); // Keep navigation
        
        // Notify ONLY M1 (Index 0)
        const contactM1 = contacts[0];
        if (contactM1 && contactM1.phone) {
             const msg = "Someone at home... Watch the CCTV";
             triggerTwilio('threat', contactM1, msg);
        } else {
             console.warn("M1 Contact not configured for Threat Alert");
        }
    };

    const handleTheft = () => {
        showFeedback("Silent Alarm: Alerting M1 & Police...", <Lock className="w-6 h-6 text-white" />, 'bg-blue-600');
        
        // Notify ONLY M1 (Index 0)
        const contactM1 = contacts[0];
        if (contactM1 && contactM1.phone) {
            const msg = "Someone at home... Watch the CCTV";
            triggerTwilio('theft', contactM1, msg);
        } else {
             console.warn("M1 Contact not configured for Theft Alert");
        }
    };

    const handleFire = () => {
        if (isFireActive) {
            showFeedback("Fire Alert Acknowledged. Stopping Alarm.", <ShieldAlert className="w-6 h-6 text-white" />, 'bg-green-600');
            triggerDevice('stop');
            setIsFireActive(false);
        } else {
            showFeedback("Fire Alert: Dialing Fire Dept...", <Flame className="w-6 h-6 text-white" />, 'bg-orange-600');
            triggerDevice('fire');
            setIsFireActive(true);
            
            // Notify all contacts about Fire
            const msg = "Fire, Get back home Immediately";
            contacts.forEach(contact => {
                if (contact && contact.phone) triggerTwilio('fire', contact, msg);
            });
        }
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
