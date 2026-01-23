import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Play, Settings, ShieldCheck, User, Phone, Camera, Activity, Shield, Bell, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Constants ---
const FRAME_COUNT = 26;
const IMAGE_PATH_PREFIX = '/io2/ezgif-frame-';
const IMAGE_EXTENSION = '.jpg';

// --- Hook: Image Preloader ---
const useImagePreloader = () => {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = [];

    const updateProgress = () => {
      loadedCount++;
      if (loadedCount === FRAME_COUNT) {
        setImages(imgArray);
        setLoaded(true);
      }
    };

    // Load in batches
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

  return { loaded, images };
};

// --- Component: Glass Card ---
const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl ${className}`}>
        {children}
    </div>
);

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
  const { loaded, images } = useImagePreloader();
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
    // Set canvas dimensions to match window (fixed background)
    if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // BIG & CENTERED Logic
    // Scale based on HEIGHT (85%) so device looks TALL
    const scale = (h / img.height) * 0.85; 
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    
    // Centering with RIGHT SHIFT (15% offset)
    // The device in the source image is slightly to the left, so we shift rendering to the RIGHT to center it.
    const offsetX = (w - drawWidth) / 2 + (w * 0.15);
    const offsetY = (h - drawHeight) / 2;

    // Fill with black first
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
        // Initial render
        renderFrame(0);
        const handleResize = () => renderFrame(frameIndex.get());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaded, images]);

  if (!loaded) return <div className="fixed inset-0 bg-[#050505] z-50" />;

  return (
    <div ref={containerRef} className="relative bg-[#050505] min-h-[350vh]">
      
      {/* 1. Fixed Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* 2. Scrollable Foreground Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-[0] pb-32 gap-[40vh]">
        
        {/* Section 1: Hero (Vertically Centered) */}
        <div className="h-screen flex items-center justify-center w-full max-w-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full"
            >
                <GlassCard className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                        <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">System Online</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">E-ResQ v3.0</h1>
                    <p className="text-white/60 mb-6 text-sm">
                        The ultimate digital companion for your physical safety device. Rugged hardware meets cloud intelligence.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/device-simulator" className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-bold text-white border border-white/10">
                            <Play className="w-4 h-4" /> Simulator
                        </Link>
                        <Link to="/pre-book" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                            <Settings className="w-4 h-4" /> Pre-Book
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </div>

        {/* Section 1.3: Durability Visual */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ margin: "-100px" }}
            className="w-full max-w-sm"
        >
             <GlassCard className="flex flex-row items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner border border-white/10">
                    <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Military Grade</h3>
                    <p className="text-sm text-white/50 leading-tight mt-1">
                        IP68 Water Resistant & Shockproof casing designed for extreme conditions.
                    </p>
                </div>
            </GlassCard>
        </motion.div>


        {/* Section 1.5: Intermediate Visuals (Pulse Animation) */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: "-100px" }}
            className="w-full max-w-sm"
        >
            <GlassCard className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30 h-16 w-16"></div>
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/50">
                        <Zap className="h-8 w-8 text-white fill-current" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Always Ready</h2>
                <p className="text-white/60 text-sm">
                    Advanced sensors constantly monitoring for threats, even when you sleep.
                </p>
            </GlassCard>
        </motion.div>

        {/* Section 2: Features (Cards) */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            className="w-full max-w-sm"
        >
            <GlassCard>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Core Systems</h2>
                <FeatureItem 
                    icon={Phone} 
                    title="Instant Dispatch" 
                    subtitle="One-touch connection to family & emergency services within milliseconds." 
                />
                <FeatureItem 
                    icon={Camera} 
                    title="AI Threat Cam" 
                    subtitle="On-device computer vision detects aggression and weapons instantly." 
                />
                <FeatureItem 
                    icon={Activity} 
                    title="Seismic Sensor" 
                    subtitle="Advanced hardware sensors provide early earthquake warnings." 
                />
            </GlassCard>
        </motion.div>

        {/* Section 3: Process Steps */}
        <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ margin: "-100px" }}
             className="w-full max-w-sm"
        >
            <GlassCard>
                 <div className="space-y-8">
                    <div className="text-center">
                        <div className="h-14 w-14 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/30">
                            <Activity className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white">1. Detect</h3>
                        <p className="text-sm text-white/50 mt-1">24/7 Environmental Monitoring</p>
                    </div>
                    
                     <div className="text-center">
                        <div className="h-14 w-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3 border border-red-500/30">
                            <Bell className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white">2. Alert</h3>
                        <p className="text-sm text-white/50 mt-1">Instant Cloud Notification</p>
                    </div>

                     <div className="text-center">
                        <div className="h-14 w-14 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-3 border border-green-500/30">
                            <Shield className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white">3. Secure</h3>
                        <p className="text-sm text-white/50 mt-1">Emergency Response Dispatched</p>
                    </div>
                 </div>
            </GlassCard>
        </motion.div>

        {/* Section 4: CTA */}
        <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ margin: "-50px" }}
             className="w-full max-w-sm mb-20"
        >
            <div className="text-center bg-gradient-to-br from-blue-900 to-black p-8 rounded-3xl border border-white/10 shadow-2xl">
                <ShieldCheck className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Total Protection</h2>
                <p className="text-white/60 mb-8">Join 2,000+ families secured by E-ResQ.</p>
                <Link to="/pre-book" className="block w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.02] transition-transform">
                    Pre-Book Now
                </Link>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MobileDeviceScroll;
