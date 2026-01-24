import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, MapPin, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContacts } from '../utils/storage';

const EmergencyDialer = () => {
  const [contacts, setContacts] = useState([]);
  const [calling, setCalling] = useState(null); // Contact object or null
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleCall = (contact) => {
    if (!contact.name) return;
    setCalling(contact);
    // Simulate call duration
    setTimeout(() => {
        setCalling(null);
    }, 4000);
  };

  const handleSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 pb-24 pt-24">
      <div className="max-w-md mx-auto">
        <header className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full mb-4">
                <Phone className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Emergency Dialer</h1>
            <p className="text-white/50">Tap a contact to dial immediately.</p>
        </header>

        {/* SOS Button */}
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSOS}
            className="w-full bg-red-600 text-white rounded-2xl p-6 shadow-lg shadow-red-900/30 mb-8 flex items-center justify-between group overflow-hidden relative border border-red-500/50"
        >
            <div className="absolute inset-0 bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex items-center">
                <ShieldAlert className="w-10 h-10 mr-4" />
                <div className="text-left">
                    <h2 className="text-2xl font-bold">SOS MESSAGE</h2>
                    <p className="text-red-100 text-sm">Send Location to All Contacts</p>
                </div>
            </div>
            <MessageSquare className="relative z-10 w-6 h-6 opacity-50 group-hover:opacity-100" />
        </motion.button>

        {/* SOS Feedback */}
        <AnimatePresence>
            {sosSent && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-900/20 border border-green-500/30 text-white p-4 rounded-xl mb-6 shadow-lg text-sm backdrop-blur-md"
                >
                    <div className="flex items-center font-bold text-green-400 mb-1">
                        <MapPin className="w-4 h-4 mr-2" /> SOS SENT
                    </div>
                    <p className="opacity-80">
                        SMS Sent to all contacts: "HELP! Medical Emergency at 34.0522° N, 118.2437° W"
                    </p>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Contact Grid */}
        <div className="grid grid-cols-2 gap-4">
            {contacts.map((contact, index) => (
                <motion.button
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(contact)}
                    disabled={!contact.name}
                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        contact.name 
                        ? 'bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-white/10 cursor-pointer backdrop-blur-sm' 
                        : 'bg-white/5 border-white/5 opacity-30 cursor-not-allowed'
                    }`}
                >
                    <div className="text-xs font-bold text-white/30 mb-2">M{index + 1}</div>
                    <div className="font-bold text-white truncate text-lg">
                        {contact.name || 'Not Set'}
                    </div>
                    <div className="text-sm text-white/50 truncate">
                        {contact.relation || '---'}
                    </div>
                    {contact.phone && (
                        <div className="text-xs text-white/30 mt-2 font-mono">
                            {contact.phone}
                        </div>
                    )}
                </motion.button>
            ))}
        </div>

        {/* Calling Overlay */}
        <AnimatePresence>
            {calling && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-md"
                >
                    <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8 relative border border-white/10">
                        <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping"></div>
                        <Phone className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{calling.name}</h2>
                    <p className="text-white/50 text-lg mb-1">Calling {calling.relation}...</p>
                    <p className="text-white/30 font-mono mb-8">{calling.phone}</p>
                    <button 
                        onClick={() => setCalling(null)}
                        className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center hover:bg-red-700 transition shadow-lg shadow-red-900/40"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmergencyDialer;
