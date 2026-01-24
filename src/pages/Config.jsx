import React, { useState, useEffect } from 'react';
import { Save, User, Phone, Mail, Heart, AlertCircle, Check } from 'lucide-react';
import { getContacts, saveContacts } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Config = () => {
  const [contacts, setContacts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const handleChange = (id, field, value) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    setSaved(false);
    setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const m1 = contacts.find(c => c.id === 'm1');
    if (!m1 || !m1.name || !m1.phone) {
      setError('Contact M1 (Name & Phone) is compulsory.');
      return;
    }
    saveContacts(contacts);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white">Device Configuration</h1>
          <p className="mt-4 text-lg text-white/60">
            Set up your Emergency Contacts. <span className="font-bold text-red-500">M1 is mandatory</span>, others are optional.
          </p>
        </div>

        <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm" 
            onSubmit={handleSave}
        >
          <div className="p-8 space-y-8">
            {contacts.map((contact, index) => {
              const isRequired = contact.id === 'm1';
              return (
              <div key={contact.id} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${isRequired ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
                    {contact.id.toUpperCase()}
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    Contact {index + 1} 
                    {isRequired && <span className="text-red-400 ml-1 text-sm">(Required)</span>}
                    {!isRequired && <span className="text-white/40 ml-1 text-sm">(Optional)</span>}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-white/40" />
                      </div>
                      <input
                        type="text"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 bg-white/5 border text-white placeholder-white/20 focus:ring-2 focus:outline-none transition-all ${isRequired ? 'focus:ring-red-500/50 border-red-500/30' : 'focus:ring-blue-500/50 border-white/10'}`}
                        placeholder="Jane Doe"
                        value={contact.name}
                        onChange={(e) => handleChange(contact.id, 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Relationship</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Heart className="h-4 w-4 text-white/40" />
                      </div>
                      <input
                        type="text"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 bg-white/5 border text-white placeholder-white/20 focus:ring-2 focus:outline-none transition-all ${isRequired ? 'focus:ring-red-500/50 border-red-500/30' : 'focus:ring-blue-500/50 border-white/10'}`}
                        placeholder="Parent, Spouse, etc."
                        value={contact.relation}
                        onChange={(e) => handleChange(contact.id, 'relation', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Phone Number</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-white/40" />
                      </div>
                      <input
                        type="tel"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 bg-white/5 border text-white placeholder-white/20 focus:ring-2 focus:outline-none transition-all ${isRequired ? 'focus:ring-red-500/50 border-red-500/30' : 'focus:ring-blue-500/50 border-white/10'}`}
                        placeholder="+1 (555) 000-0000"
                        value={contact.phone}
                        onChange={(e) => handleChange(contact.id, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-white/40" />
                      </div>
                      <input
                        type="email"
                        required={false}
                        className="block w-full pl-10 sm:text-sm rounded-md py-2 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
                        placeholder="jane@example.com"
                        value={contact.email}
                        onChange={(e) => handleChange(contact.id, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
          
          <div className="bg-white/5 px-8 py-4 flex items-center justify-between border-t border-white/10 sticky bottom-0 z-10 backdrop-blur-md">
            <div>
              {error && (
                <p className="text-sm text-red-400 flex items-center font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
              )}
              {!error && <p className="text-sm text-white/40">All data stored locally.</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg shadow-red-900/20 text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
            >
              <Save className="mr-2 h-5 w-5" />
              {saved ? 'Saved!' : 'Save Configuration'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Config;
