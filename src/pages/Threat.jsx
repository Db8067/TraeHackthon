import React, { useState, useRef, useEffect } from 'react';
import { Camera, StopCircle, UploadCloud, CheckCircle, Video, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContacts } from '../utils/storage';

const Threat = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [stream, setStream] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setContacts(getContacts());
    startCamera();
    return () => {
        stopCamera();
        clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      const constraints = { 
        video: { 
          facingMode: 'environment' // Prefer back camera for threat recording
        }, 
        audio: true 
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access denied:", err);
      // Fallback
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(fallbackStream);
      } catch (fallbackErr) {
        console.error("Fallback camera failed:", fallbackErr);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop Recording
      clearInterval(timerRef.current);
      setIsRecording(false);
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      setIsSending(true);
      
      // Simulate Cloud Upload
      setTimeout(() => {
        setIsSending(false);
        setIsSent(true);
      }, 2500);
    } else {
      // Start Recording
      setIsRecording(true);
      setIsSent(false);
      setTimer(0);
      chunksRef.current = [];
      
      if (stream) {
        try {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `threat_evidence_${Date.now()}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            
            mediaRecorder.start();
        } catch (e) {
            console.error("MediaRecorder error:", e);
        }
      }

      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
  };

  const m1Name = contacts.find(c => c.id === 'm1')?.name || 'Emergency Contact';

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
                        <span className="text-xs font-bold text-red-500 flex items-center">
                            REC {formatTime(timer)}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlays */}
            {isSending && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <UploadCloud className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
                    <h2 className="text-xl font-bold text-blue-400">Encrypting & Uploading...</h2>
                    <p className="text-slate-400 text-sm mt-2">Saving Video_00{Math.floor(Math.random() * 100)}.mp4</p>
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
                        Video sent to <span className="font-bold text-white">{m1Name}</span> via Cloud API.
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

export default Threat;
