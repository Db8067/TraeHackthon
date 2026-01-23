import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Lock, Flame, Activity, ArrowRight, Video, CheckCircle, Globe, PlayCircle, Star, Zap, Radio, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const FloatingIcon = ({ icon: Icon, color, top, left, delay }) => (
  <motion.div
    className={`absolute w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center ${color} z-20 hidden lg:flex`}
    style={{ top, left }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [0, -10, 0], opacity: 1 }}
    transition={{
      y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay },
      opacity: { duration: 0.5, delay: 0.2 }
    }}
  >
    <Icon className="w-6 h-6" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white rounded-full -z-10 animate-ping opacity-20"></div>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* SaaS Hero Section */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 skew-y-3 transform origin-top-left -translate-y-20 z-0"></div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wide">
                  <Star className="w-3 h-3 mr-1 fill-current" /> Trusted by Security Experts
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                  E-ResQ device for <br />
                  Residential emergency - <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-red to-orange-500">
                    one device solving many problems.
                  </span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
                  E-ResQ v3.0 bridges the gap between rugged hardware and cloud intelligence. The ultimate digital companion for your physical safety device.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/device-simulator" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <PlayCircle className="mr-2 w-5 h-5" /> Launch Simulator
                  </Link>
                  <Link to="/configure" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                    Configure Device
                  </Link>
                </div>

                <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className="font-bold text-slate-900">2,000+</span> families protected
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Visual - Animatic Device */}
            <div className="w-full lg:w-1/2 relative flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
              >
                {/* Pulse Effect Behind */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Floating Animation Container */}
                <div className="animate-[float_6s_ease-in-out_infinite] relative">
                  {/* CSS Representation of the Device (High Quality) */}
                  <div className="w-[280px] h-[580px] bg-slate-800 rounded-[3rem] border-[8px] border-slate-900 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative overflow-hidden ring-1 ring-slate-700 hover:shadow-[0_0_70px_rgba(59,130,246,0.5)] transition-shadow duration-500">
                    {/* Screen */}
                    <div className="absolute top-14 left-4 right-4 h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
                      <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-slate-900 relative p-4 flex flex-col justify-between">
                        <div className="flex justify-between text-[10px] text-white/60 font-mono">
                          <Activity className="w-3 h-3 text-green-500" />
                          <span>LTE: 5G</span>
                        </div>
                        <div className="text-center">
                          <ShieldCheck className="w-8 h-8 text-white mx-auto mb-2 opacity-90" />
                          <div className="text-white font-bold tracking-widest text-lg">E-ResQ</div>
                          <div className="text-[9px] text-blue-400 uppercase tracking-widest">System Active</div>
                        </div>
                        <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                      </div>
                    </div>

                    {/* Keypad Area */}
                    <div className="absolute top-[280px] left-5 right-5 bottom-8 flex flex-col justify-between">
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="h-10 bg-slate-700 rounded-md border-b-4 border-slate-900 flex items-center justify-center text-slate-400 text-xs font-bold">M{n}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-20 bg-red-700 rounded-lg border-b-4 border-red-900 flex flex-col items-center justify-center text-white/80"><Activity className="w-5 h-5 mb-1" /></div>
                        <div className="h-20 bg-slate-600 rounded-lg border-b-4 border-slate-800 flex flex-col items-center justify-center text-white/80"><Lock className="w-5 h-5 mb-1" /></div>
                        <div className="h-20 bg-orange-600 rounded-lg border-b-4 border-orange-800 flex flex-col items-center justify-center text-white/80"><Flame className="w-5 h-5 mb-1" /></div>
                      </div>
                      <div className="h-12 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                        <span className="text-[10px] text-emerald-500 font-mono tracking-widest">SEISMIC SENSOR</span>
                      </div>
                    </div>

                    {/* Camera notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-slate-900 rounded-b-xl flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full border border-slate-700"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Hardware Meets Cloud Intelligence</h2>
            <p className="text-slate-600">The most advanced personal safety ecosystem available today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Phone}
              title="Instant Dispatch"
              description="One-touch connection to family and emergency services with GPS location embedding."
              color="bg-red-500"
            />
            <FeatureCard
              icon={Video}
              title="AI Threat Cam"
              description="On-device AI detects aggression and auto-records evidence to the secure cloud."
              color="bg-blue-600"
            />
            <FeatureCard
              icon={Activity}
              title="Seismic Predictor"
              description="Connects to government arrays for early earthquake warning and post-event safety checks."
              color="bg-emerald-500"
            />
            <FeatureCard
              icon={Lock}
              title="Anti-Theft Lock"
              description="Remote lockdown and silent alarm triggering for stolen devices."
              color="bg-slate-700"
            />
            <FeatureCard
              icon={Flame}
              title="Fire Network"
              description="Community-based fire alerts that warn neighbors instantly."
              color="bg-orange-500"
            />
            <FeatureCard
              icon={Globe}
              title="Global Roaming"
              description="Built-in eSIM technology keeps you connected in 140+ countries."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Three Steps to Safety</h2>
            <p className="text-slate-600">Complex technology, simplified for critical moments.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Hidden on Mobile) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

            <div className="text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <Radio className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Detect</h3>
              <p className="text-slate-600 px-4">Sensors continuously monitor environment, movement, and audio for anomalies.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <Zap className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Alert</h3>
              <p className="text-slate-600 px-4">Instantly transmits encrypted distress signals via LTE-M and Satellite.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Secure</h3>
              <p className="text-slate-600 px-4">Authorities dispatched and family notified with real-time tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-bold text-slate-800">Secure<span className="text-blue-600">Tech</span></div>
            <div className="text-2xl font-bold text-slate-800">Global<span className="text-green-600">Guard</span></div>
            <div className="text-2xl font-bold text-slate-800">Safe<span className="text-red-600">Home</span></div>
            <div className="text-2xl font-bold text-slate-800">Res<span className="text-orange-600">Q</span></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
