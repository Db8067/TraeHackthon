import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Phone, Camera, Activity, Shield, CheckCircle, Play, Settings, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Preloader } from '../ui/Preloader';

// --- Constants ---
const FRAME_COUNT = 26;
const IMAGE_PATH_PREFIX = '/io2/ezgif-frame-';
const IMAGE_EXTENSION = '.jpg';

// --- Component: WatermarkCover ---
const WatermarkCover: React.FC = () => {
    return (
        <div className="absolute bottom-0 right-0 z-50 pointer-events-none">
            <div className="w-[300px] h-[100px] bg-[radial-gradient(circle_at_bottom_right,_#050505_60%,_transparent_100%)]"></div>
            <div className="absolute bottom-6 right-8 text-xs font-mono tracking-widest text-white/20 select-none">
                E-ResQ // SYSTEM ACTIVE
            </div>
        </div>
    );
};

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
             if (img.decode) { try { await img.decode(); } catch (e) { console.warn(e); } } 
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

// --- Component: Feature Stack Card ---
const StackCard: React.FC<{ 
    icon: any, 
    title: string, 
    subtitle: string, 
    active: boolean 
}> = ({ icon: Icon, title, subtitle, active }) => (
    <motion.div 
        animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className={`flex items-start gap-4 p-6 rounded-3xl border backdrop-blur-md transition-all duration-500 ${
            active 
                ? "bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105" 
                : "bg-black/20 border-white/5 grayscale"
        }`}
    >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
            active ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"
        }`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <h3 className="font-bold text-white text-xl leading-tight">{title}</h3>
            <p className="text-sm text-white/60 leading-snug mt-2">{subtitle}</p>
        </div>
    </motion.div>
);

// --- Component: DeviceScroll ---
const DeviceScroll: React.FC = () => {
  const { loaded, images, progress } = useImagePreloader();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRenderedIndex = useRef<number>(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { if (loaded) window.scrollTo(0, 0); }, [loaded]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // --- Rendering Logic ---
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imgIndex = Math.round(index);
    const clampedIndex = Math.min(Math.max(imgIndex, 0), images.length - 1);
    if (clampedIndex === lastRenderedIndex.current) return;
    
    const img = images[clampedIndex];
    if (!img) return;

    // Use CONTAIN logic for Desktop
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const canvasRatio = w / h;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    if (canvasRatio > imgRatio) {
      drawHeight = h;
      drawWidth = img.width * (h / img.height);
      offsetX = (w - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = w;
      drawHeight = img.height * (w / img.width);
      offsetX = 0;
      offsetY = (h - drawHeight) / 2;
    }

    // Shift image down slightly in laptop view to avoid header overlap
    const verticalShift = isMobile ? 0 : h * 0.08; 

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY + verticalShift, drawWidth, drawHeight);
    lastRenderedIndex.current = clampedIndex;
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (loaded) requestAnimationFrame(() => renderFrame(latest));
  });
  
  // Force initial render when loaded
  useEffect(() => {
    if (loaded && images.length > 0) {
        // Force render frame 0 immediately
        renderFrame(0);
        // And again after a small delay to ensure canvas is ready
        setTimeout(() => renderFrame(0), 100);
    }
  }, [loaded, images]);

  // --- Animation Transforms ---
  // Hero: 0-15%
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => v > 0.1 ? 'none' : 'auto');
  
  // Features Stack: 25-50%
  const stackOpacity = useTransform(scrollYProgress, [0.2, 0.25, 0.5, 0.55], [0, 1, 1, 0]);
  const stackY = useTransform(scrollYProgress, [0.2, 0.5], [50, -50]);
  
  // Use React state to track active card for simpler rendering logic
  const [activeCard, setActiveCard] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (latest < 0.33) setActiveCard(0);
      else if (latest < 0.41) setActiveCard(1);
      else setActiveCard(2);
  });

  // Split Layout: 60-80%
  const splitOpacity = useTransform(scrollYProgress, [0.6, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
  
  // Trusted: 85-100%
  const trustedOpacity = useTransform(scrollYProgress, [0.85, 0.9], [0, 1]);

  // Background Opacity for Transformation 2 & 3 (95% Black)
  // 0.2 -> 0.8: 95% Black. Before 0.2 and after 0.8: Transparent (shows canvas)
  const bgBlackOpacity = useTransform(scrollYProgress, [0.18, 0.22, 0.78, 0.82], [0, 0.95, 0.95, 0]);

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader progress={progress} />}
      </AnimatePresence>

      <div ref={containerRef} className="relative h-[600vh] bg-[#050505] text-white">
        
        {/* Sticky Canvas Container - CENTERED (h-screen, flex items-center) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
            
          {/* Background Overlay to mask lag (Only visible if canvas flickers) */}
          <div className="absolute inset-0 bg-[#050505] -z-10" />

          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          
          {/* SOLID BLACK Overlay for Transformation 2 & 3 */}
          {/* This completely HIDES the canvas during the middle sections */}
          <motion.div 
            style={{ opacity: bgBlackOpacity }}
            className="absolute inset-0 bg-[#050505] z-10" 
          />
          
          {/* Gradient Overlay for Text Readability (Global, Subtle) */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />

          <div className="z-50">
            <WatermarkCover />
          </div>

          <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-6 h-full w-full z-20">
            
            {/* 1. HERO (0-15%) */}
            {!isMobile && (
                <motion.div 
                    style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents }}
                    className="absolute top-[25vh] right-[5%] w-[45%] max-w-xl text-right"
                >
                    <h1 className="text-4xl font-bold leading-tight tracking-tighter text-white/90 md:text-5xl lg:text-6xl">
                        E-ResQ device for <br/> Residential emergency
                    </h1>
                    <p className="mt-4 text-lg text-white/60 md:text-xl font-light">
                        One device solving many problems.
                    </p>
                    
                    <p className="max-w-md ml-auto mt-4 text-base text-white/50 leading-relaxed">
                        E-ResQ v3.0 bridges the gap between rugged hardware and cloud intelligence. The ultimate digital companion for your physical safety device.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-end gap-4 pointer-events-auto">
                        <Link 
                        to="/device-simulator"
                        className="group relative flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        >
                        <Play className="h-4 w-4 fill-current" />
                        Launch Simulator
                        </Link>
                        
                        <Link
                        to="/pre-book" 
                        className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                        <Settings className="h-4 w-4" />
                        Pre-Book
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-4 rounded-xl border border-white/5 bg-transparent p-3">
                        <div className="text-right">
                            <div className="text-sm font-bold text-white">2,000+</div>
                            <div className="text-xs text-white/50">families protected</div>
                        </div>
                         <div className="flex -space-x-3">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050505] bg-slate-700 text-xs font-bold text-white">
                                    <User className="h-4 w-4 text-white/50" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 2. VERTICAL FEATURE STACK (25-50%) */}
            {!isMobile && (
                <motion.div 
                    style={{ opacity: stackOpacity, y: stackY }}
                    className="absolute top-[25vh] right-[5%] w-[400px] flex flex-col gap-6"
                >
                    <h2 className="text-4xl font-bold tracking-tight text-white mb-4 text-right">
                        System Intelligence
                    </h2>
                    <StackCard 
                        icon={Phone} 
                        title="Instant Dispatch" 
                        subtitle="Direct uplink to emergency services." 
                        active={activeCard === 0}
                    />
                    <StackCard 
                        icon={Camera} 
                        title="AI Threat Cam" 
                        subtitle="Computer vision detects weapons instantly." 
                        active={activeCard === 1}
                    />
                    <StackCard 
                        icon={Activity} 
                        title="Seismic Predictor" 
                        subtitle="Earthquake warnings seconds before impact." 
                        active={activeCard === 2}
                    />
                </motion.div>
            )}

            {/* 3. SPLIT LAYOUT (60-80%) */}
            {!isMobile && (
                <motion.div 
                    style={{ opacity: splitOpacity }}
                    className="absolute top-1/2 w-full -translate-y-1/2 flex justify-between px-10"
                >
                     <div className="flex flex-col items-center text-center max-w-xs ml-[5%]">
                        <div className="h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 backdrop-blur-md border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                            <Activity className="h-10 w-10 text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">1. Detect</h3>
                        <p className="text-white/50 text-lg">24/7 Environmental Monitoring</p>
                    </div>

                    {/* Fixed: Center Element (Alert) - Now Visible */}
                    <div className="flex flex-col items-center text-center max-w-xs self-end mb-[-5vh]">
                         <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 backdrop-blur-md border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                            <Bell className="h-10 w-10 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">2. Alert</h3>
                        <p className="text-white/50 text-lg">Instant Cloud Notification</p>
                    </div>

                    <div className="flex flex-col items-center text-center max-w-xs mr-[5%]">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 backdrop-blur-md border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                            <Shield className="h-10 w-10 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">3. Secure</h3>
                        <p className="text-white/50 text-lg">Instant Response Dispatch</p>
                    </div>
                </motion.div>
            )}

            {/* 4. TRUSTED (85-100%) */}
            {!isMobile && (
                <motion.div 
                    style={{ opacity: trustedOpacity }}
                    className="absolute top-[35vh] right-[5%] text-right"
                >
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 mb-8">Trusted Ecosystem</h3>
                    <div className="flex flex-col items-end gap-6">
                        {['SecureTech', 'GlobalGuard', 'SafeHome', 'ResQ Systems'].map((partner) => (
                            <div key={partner} className="flex items-center gap-3 text-3xl font-bold text-white/90">
                                {partner} <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceScroll;
