import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Play, Settings, ShieldCheck, Phone, Camera, Activity, Shield, Bell, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Preloader } from '../ui/Preloader';

// --- Constants ---
const FRAME_COUNT = 26;
const IMAGE_PATH_PREFIX = '/io2/ezgif-frame-';
const IMAGE_EXTENSION = '.jpg';

// --- Hook: Image Preloader ---
const useImagePreloader = () => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const updateProgress = () => {
      loadedCount++;
      const currentProgress = Math.round((loadedCount / FRAME_COUNT) * 100);
      setProgress(currentProgress);
      
      if (loadedCount === FRAME_COUNT) {
        setImages(imgArray);
        setTimeout(() => setLoaded(true), 500);
      }
    };

    const loadBatch = async (startIndex: number, batchSize: number) => {
        for (let i = startIndex; i < Math.min(startIndex + batchSize, FRAME_COUNT + 1); i++) {
             const img = new Image();
             const paddedIndex = i.toString().padStart(3, '0');
             img.src = `${IMAGE_PATH_PREFIX}${paddedIndex}${IMAGE_EXTENSION}`;
             if (img.decode) { try { await img.decode(); } catch (e) {} }
             imgArray[i-1] = img;
             updateProgress();
        }
    };

    const loadAll = async () => {
         const batchSize = 5;
         for (let i = 1; i <= FRAME_COUNT; i += batchSize) {
             await loadBatch(i, batchSize);
         }
    };
    loadAll();
  }, []);

  return { loaded, images, progress };
};

// --- Component: Feature Item ---
const FeatureItem: React.FC<{ icon: any, title: string, subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-4 mb-6 last:mb-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/10">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-sm text-white/60 leading-relaxed mt-1">{subtitle}</p>
        </div>
    </div>
);

// --- Component: MobileDeviceScroll ---
const MobileDeviceScroll: React.FC = () => {
  const { loaded, images, progress } = useImagePreloader();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRenderedIndex = useRef<number>(-1);

  // Scroll Restoration Fix
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  // --- Rendering Logic (Big & Centered) ---
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const imgIndex = Math.round(index);
    const clampedIndex = Math.min(Math.max(imgIndex, 0), images.length - 1);
    
    if (clampedIndex === lastRenderedIndex.current) return;
    const img = images[clampedIndex];
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // BIG & CENTERED Logic
    const scale = (h / img.height) * 0.85; 
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const offsetX = (w - drawWidth) / 2 + (w * 0.15);
    const offsetY = (h - drawHeight) / 2;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    lastRenderedIndex.current = clampedIndex;
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (loaded) requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    if (loaded) {
        renderFrame(0);
        const handleResize = () => renderFrame(frameIndex.get());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaded, images]);

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader progress={progress} />}
      </AnimatePresence>

      <div ref={containerRef} className="relative bg-[#050505] min-h-[300vh]">
        
        {/* 1. Fixed Canvas Background */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        />

        {/* 2. Fixed Hero Title (Fades out) */}
        <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="fixed top-0 left-0 w-full h-[60vh] flex flex-col items-center justify-center z-10 pointer-events-none text-center px-6"
        >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">System Online</span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter text-white leading-none">
                E-ResQ
            </h1>
            <p className="text-xl font-medium text-white/60 mt-2 tracking-tight">
                Guardian.
            </p>
        </motion.div>

        {/* 3. Scrollable Bottom Sheet */}
        <div className="relative z-20 pt-[65vh]">
            <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] min-h-screen pb-32">
                
                {/* Sheet Handle */}
                <div className="w-full flex justify-center pt-4 pb-8">
                    <div className="w-12 h-1.5 rounded-full bg-white/20"></div>
                </div>

                <div className="px-6 space-y-12">
                    
                    {/* Intro Text */}
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Total Protection</h2>
                        <p className="text-white/60 leading-relaxed">
                            The ultimate digital companion for your physical safety device. Rugged hardware meets cloud intelligence.
                        </p>
                         <div className="grid grid-cols-2 gap-3 pt-4">
                            <Link to="/device-simulator" className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-bold text-white border border-white/10">
                                <Play className="w-4 h-4" /> Simulator
                            </Link>
                            <Link to="/pre-book" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                                <Settings className="w-4 h-4" /> Pre-Book
                            </Link>
                        </div>
                    </div>

                    {/* Bento Grid: Durability */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                            <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Military Grade</h3>
                            <p className="text-sm text-white/50">IP68 Water & Shock Resistant</p>
                        </div>
                    </div>

                    {/* Bento Grid: Monitoring */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Zap className="h-24 w-24 text-blue-500" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/30">
                                <Activity className="h-7 w-7 text-blue-400 animate-pulse" />
                            </div>
                            <h3 className="font-bold text-white text-xl">Always Ready</h3>
                            <p className="text-sm text-white/50 mt-2">
                                24/7 Threat Monitoring active even when you sleep.
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 border-b border-white/10 pb-2">Core Systems</h3>
                        <FeatureItem icon={Phone} title="Instant Dispatch" subtitle="Direct uplink to emergency services." />
                        <FeatureItem icon={Camera} title="AI Threat Cam" subtitle="Computer vision detects weapons." />
                        <FeatureItem icon={Activity} title="Seismic Sensor" subtitle="Earthquake warnings seconds before." />
                    </div>

                     {/* Process Steps (Horizontal Scroll) */}
                     <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                        {[
                            { icon: Activity, title: "1. Detect", desc: "24/7 Monitoring" },
                            { icon: Bell, title: "2. Alert", desc: "Cloud Notify" },
                            { icon: Shield, title: "3. Secure", desc: "Dispatch Sent" }
                        ].map((step, i) => (
                            <div key={i} className="min-w-[140px] bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <step.icon className="h-8 w-8 mx-auto text-white/80 mb-3" />
                                <div className="font-bold text-white">{step.title}</div>
                                <div className="text-xs text-white/50">{step.desc}</div>
                            </div>
                        ))}
                     </div>

                    {/* Final CTA */}
                    <div className="bg-gradient-to-br from-blue-900 to-black p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
                        <ShieldCheck className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Secure Your Home</h2>
                        <Link to="/pre-book" className="block w-full py-3 mt-6 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-transform">
                            Pre-Book Now
                        </Link>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default MobileDeviceScroll;
