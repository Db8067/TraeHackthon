import React, { useState, useEffect } from 'react';
import { Activity, MapPin, Clock, AlertOctagon, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Earthquake = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('safe'); 

  useEffect(() => {
    // Simulate fetching USGS Data
    const generateData = () => {
      setLoading(true);
      setTimeout(() => {
        const locations = ["California, USA", "Tokyo, Japan", "Jakarta, Indonesia", "Santiago, Chile", "Anchorage, Alaska"];
        const newData = Array.from({ length: 6 }).map((_, i) => {
          const mag = (Math.random() * (7.5 - 2.5) + 2.5).toFixed(1);
          return {
            id: i,
            place: locations[i % locations.length] || "Unknown Location",
            mag,
            time: Date.now() - Math.floor(Math.random() * 86400000),
            depth: Math.floor(Math.random() * 100),
            isRecent: i === 0 
          };
        });
        
        setEarthquakes(newData);
        const maxMag = parseFloat(newData[0].mag);
        setStatus(maxMag > 6.0 ? 'danger' : maxMag > 4.5 ? 'warning' : 'safe');
        setLoading(false);
      }, 1000);
    };

    generateData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] p-4 pb-24 pt-24">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Activity className="mr-2 text-red-500" />
            Seismic Monitor
          </h1>
          <p className="text-white/50 text-sm">Real-time ground motion detection & AI Forecast</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            {/* Left Column: Visuals & AI */}
            <div className="space-y-6">
                {/* AI Prediction Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/5 border border-white/10 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Globe className="w-32 h-32 text-blue-500" />
                    </div>
                    <h2 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                        <Activity className="w-5 h-5 mr-2" /> AI Seismic Forecast
                    </h2>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Tectonic Pressure</span>
                            <span className="text-green-400 font-bold">NORMAL</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">P-Wave Analysis</span>
                            <span className="text-green-400 font-bold">STABLE</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-sm text-white/50">
                                AI Analysis: Tectonic pressure normal. Probability of quake &lt; 5% in the next 24h.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Globe/Map Placeholder */}
                <div className="bg-white/5 rounded-2xl shadow-sm border border-white/10 h-64 lg:h-80 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 invert grayscale"></div>
                    <div className="text-center z-10">
                        <Globe className="w-16 h-16 text-white/30 mx-auto mb-2" />
                        <p className="text-white/50 font-medium">Live Global Feed Active</p>
                    </div>
                    {/* Simulated pings */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full animate-ping delay-700"></div>
                </div>
            </div>

            {/* Right Column: Data Feed */}
            <div className="bg-white/5 rounded-2xl shadow-sm border border-white/10 overflow-hidden flex flex-col h-full min-h-[500px] backdrop-blur-sm">
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Live Feed & History</h3>
                    <span className="text-xs font-mono bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded">UPDATED JUST NOW</span>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center text-white/40 flex-1 flex items-center justify-center">Loading seismic data...</div>
                ) : (
                    <div className="overflow-y-auto flex-1 divide-y divide-white/5">
                        {earthquakes.map((quake) => (
                            <motion.div 
                                key={quake.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:scale-110 ${
                                        parseFloat(quake.mag) >= 6 ? 'bg-red-600 shadow-red-900/50' :
                                        parseFloat(quake.mag) >= 4 ? 'bg-orange-500 shadow-orange-900/50' : 'bg-green-500 shadow-green-900/50'
                                    }`}>
                                        <span className="text-lg leading-none">{quake.mag}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{quake.place}</h4>
                                        <div className="flex items-center text-xs text-white/50 space-x-3 mt-1">
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(quake.time).toLocaleTimeString()}</span>
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {quake.depth}km</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Earthquake;
