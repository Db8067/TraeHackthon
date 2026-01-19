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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Device Configuration</h1>
          <p className="mt-4 text-lg text-slate-600">
            Set up your Emergency Contacts. <span className="font-bold text-red-600">M1 is mandatory</span>, others are optional.
          </p>
        </div>

        <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-2xl overflow-hidden" 
            onSubmit={handleSave}
        >
          <div className="p-8 space-y-8">
            {contacts.map((contact, index) => {
              const isRequired = contact.id === 'm1';
              return (
              <div key={contact.id} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${isRequired ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    {contact.id.toUpperCase()}
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">
                    Contact {index + 1} 
                    {isRequired && <span className="text-red-500 ml-1 text-sm">(Required)</span>}
                    {!isRequired && <span className="text-slate-400 ml-1 text-sm">(Optional)</span>}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 border ${isRequired ? 'focus:ring-red-500 focus:border-red-500 border-slate-300' : 'focus:ring-blue-500 focus:border-blue-500 border-slate-200'}`}
                        placeholder="Jane Doe"
                        value={contact.name}
                        onChange={(e) => handleChange(contact.id, 'name', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Heart className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 border ${isRequired ? 'focus:ring-red-500 focus:border-red-500 border-slate-300' : 'focus:ring-blue-500 focus:border-blue-500 border-slate-200'}`}
                        placeholder="Parent, Spouse, etc."
                        value={contact.relation}
                        onChange={(e) => handleChange(contact.id, 'relation', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        required={isRequired}
                        className={`block w-full pl-10 sm:text-sm rounded-md py-2 border ${isRequired ? 'focus:ring-red-500 focus:border-red-500 border-slate-300' : 'focus:ring-blue-500 focus:border-blue-500 border-slate-200'}`}
                        placeholder="+1 (555) 000-0000"
                        value={contact.phone}
                        onChange={(e) => handleChange(contact.id, 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required={false}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-200 rounded-md py-2 border"
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
          
          <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-200 sticky bottom-0 z-10">
            <div>
              {error && (
                <p className="text-sm text-red-600 flex items-center font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-1" /> {error}
                </p>
              )}
              {!error && <p className="text-sm text-slate-500">All data stored locally.</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-medical-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-red transition-colors"
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
