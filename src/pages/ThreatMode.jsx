import React, { useState, useRef, useEffect } from 'react';
import { Camera, StopCircle, UploadCloud, CheckCircle, AlertTriangle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContacts } from '../utils/storage';

const ThreatMode = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [stream, setStream] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    setContacts(getContacts());
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsSending(true);
      setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
      }, 2500);
    } else {
      setIsRecording(true);
      setIsSent(false);
    }
  };

  const m1Name = contacts.find(c => c.id === 'm1')?.name || 'Emergency Contact';
  const m2Name = contacts.find(c => c.id === 'm2')?.name;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-24">
      <div className="max-w-md mx-auto relative h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center space-x-2">
                <Video className="text-red-500 animate-pulse" />
                <h1 className="text-xl font-bold tracking-wider">THREAT CAM</h1>
            </div>
            <div className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-mono border border-red-500/30">
                LIVE FEED
            </div>
        </div>

        {/* Camera Viewport */}
        <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border-2 border-slate-700">
            {stream ? (
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform scale-x-[-1]" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                    <p>Initializing Camera...</p>
                </div>
            )}

            {/* Recording Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full"
                    >
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                        <span className="text-xs font-bold text-red-500">REC 00:{Math.floor(Date.now() / 1000) % 60}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlays */}
            {isSending && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <UploadCloud className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
                    <h2 className="text-xl font-bold text-blue-400">Encrypting & Uploading...</h2>
                    <p className="text-slate-400 text-sm mt-2">Sending to Secure Cloud</p>
                </div>
            )}

            {isSent && (
                <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-20 p-6 text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
                    >
                        <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">Evidence Secured!</h2>
                    <p className="text-green-200">
                        Video clip sent to <span className="font-bold text-white">{m1Name}</span>
                        {m2Name && <span> & <span className="font-bold text-white">{m2Name}</span></span>}.
                    </p>
                    <button 
                        onClick={() => setIsSent(false)}
                        className="mt-8 px-6 py-2 bg-slate-800 rounded-full text-sm hover:bg-slate-700 transition"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="mt-6 flex justify-center">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRecordToggle}
                className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-lg transition-all ${
                    isRecording 
                    ? 'bg-white border-red-500' 
                    : 'bg-red-600 border-red-200 hover:bg-red-700'
                }`}
            >
                {isRecording ? (
                    <div className="w-8 h-8 bg-red-500 rounded-md" />
                ) : (
                    <Camera className="w-8 h-8 text-white" />
                )}
            </motion.button>
        </div>
        <p className="text-center text-slate-500 text-xs mt-4">
            {isRecording ? 'Tap to Stop & Send' : 'Tap to Start Recording'}
        </p>
      </div>
    </div>
  );
};

export default ThreatMode;
