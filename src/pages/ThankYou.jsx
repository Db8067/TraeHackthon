import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-600 mb-8">
          Thank you for pre-booking E-ResQ. Your device is secured. We will email you with shipping updates shortly.
        </p>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-8 border border-slate-100">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">ERQ-{Math.floor(Math.random() * 100000)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-slate-900">₹2,499.00</span>
            </div>
        </div>

        <Link 
            to="/" 
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
        >
            Back to Home <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYou;
