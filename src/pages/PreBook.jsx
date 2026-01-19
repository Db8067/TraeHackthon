import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Cloud, Clock, Zap, Star, Activity, Lock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    const res = await loadRazorpayScript();

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
    }

    // Simulate order ID generation or just use client-side options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: "100", // Amount is in currency subunits. 100 paise = 1 Rupee
      currency: "INR",
      name: "E-ResQ Technologies",
      description: "Pre-Order E-ResQ Device v3.0",
      handler: function (response) {
        // Payment Success
        console.log(response);
        setLoading(false);
        navigate('/thank-you');
      },
      theme: {
        color: "#dc2626", // Medical Red
      },
      modal: {
        ondismiss: () => {
            setLoading(false);
        }
      }
    };

    const rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(`Payment Failed: ${response.error.description}`);
      setLoading(false);
    });

    rzp1.open();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Product Visuals */}
            <div className="lg:w-1/2 bg-slate-900 p-12 relative overflow-hidden flex flex-col justify-center items-center text-center">
               {/* Background Effects */}
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>

               {/* Device Visual (Reused CSS Device) */}
               <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 scale-75 lg:scale-90"
               >
                   <div className="w-[280px] h-[580px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-slate-700">
                        {/* Screen */}
                        <div className="absolute top-14 left-4 right-4 h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                            <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-900 relative p-4 flex flex-col justify-between">
                                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                                    <Activity className="w-3 h-3 text-green-500" />
                                    <span>LTE: 5G</span>
                                </div>
                                <div className="text-center">
                                    <Shield className="w-8 h-8 text-white mx-auto mb-2 opacity-90" />
                                    <div className="text-white font-bold tracking-widest text-lg">E-ResQ</div>
                                </div>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="absolute top-[280px] left-5 right-5 bottom-8 flex flex-col justify-between">
                            <div className="grid grid-cols-4 gap-2">
                                {[1,2,3,4].map(n => <div key={n} className="h-10 bg-slate-700 rounded-md border-b-4 border-slate-900"></div>)}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-20 bg-red-700 rounded-lg border-b-4 border-red-900"></div>
                                <div className="h-20 bg-slate-600 rounded-lg border-b-4 border-slate-800"></div>
                                <div className="h-20 bg-orange-600 rounded-lg border-b-4 border-orange-800"></div>
                            </div>
                        </div>
                   </div>
               </motion.div>

               <div className="mt-8 z-10">
                   <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur px-4 py-2 rounded-full border border-slate-700">
                       <Star className="w-4 h-4 text-yellow-500 fill-current" />
                       <span className="text-slate-300 text-sm font-medium">Rated #1 Safety Device 2024</span>
                   </div>
               </div>
            </div>

            {/* Right: Sales Content */}
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center bg-white">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="uppercase tracking-widest text-sm font-bold text-blue-600 mb-4">Limited Time Pre-Order</div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Secure Your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Safety Today.</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Be the first to own the ultimate personal safety companion. E-ResQ v3.0 brings military-grade protection to your family.
                    </p>

                    {/* Pricing Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 relative overflow-hidden group hover:border-blue-100 transition-colors">
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            50% OFF
                        </div>
                        <div className="flex items-baseline space-x-4 mb-2">
                            <span className="text-4xl font-bold text-slate-900">₹2,499</span>
                            <span className="text-lg text-slate-400 line-through decoration-red-500/50">₹4,999</span>
                        </div>
                        <p className="text-sm text-green-600 font-bold flex items-center">
                            <Zap className="w-4 h-4 mr-1" /> Early Bird Offer Ends Soon
                        </p>
                    </div>

                    {/* Benefits List */}
                    <ul className="space-y-4 mb-10">
                        {[
                            { icon: Clock, text: "Priority Delivery (Ships in 24h)" },
                            { icon: Cloud, text: "1 Year Free Cloud Evidence Storage" },
                            { icon: Shield, text: "Lifetime Premium Support" }
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-slate-700 font-medium">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                {item.text}
                            </li>
                        ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <>Pre-Book Now for ₹1</>
                        )}
                    </button>
                    
                    <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center">
                        <Lock className="w-3 h-3 mr-1" /> Secured by Razorpay • 100% Refundable
                    </p>
                </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PreBook;
