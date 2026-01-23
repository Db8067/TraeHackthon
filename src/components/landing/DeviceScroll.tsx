import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Play, Settings, ShieldCheck, User, Phone, Camera, Activity, Shield, Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Constants ---
const FRAME_COUNT = 26;
const IMAGE_PATH_PREFIX = '/io2/ezgif-frame-';
const IMAGE_EXTENSION = '.jpg';
const FRAME_SKIP_THRESHOLD = 2;

// --- Component: WatermarkCover ---
const WatermarkCover: React.FC = () => {
    return (
        <div className="absolute bottom-0 right-0 z-50 pointer-events-none">
             {/* Increased width to 300px to hide 'Klir' logo */}
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
             
             if (img.decode) {
               try { await img.decode(); } catch (e) { console.warn(e); }
             } 
             
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

// --- Component: Preloader Screen ---
const PreloaderScreen: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      <div className="relative h-24 w-24 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-medical-red/30 animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-medical-blue/50 animate-[spin_2s_linear_infinite_reverse]"></div>
        <div className="absolute inset-8 rounded-full bg-white/10 animate-pulse"></div>
      </div>

      <h2 className="text-xl font-mono tracking-widest text-white/80 animate-pulse">
        E-ResQ Device is Loading...
      </h2>
      <div className="mt-2 font-mono text-sm text-white/50">
        SYSTEM INITIALIZING... {progress}%
      </div>
      
      <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-medical-blue to-medical-red"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

// --- Component: Feature Card ---
const FeatureCard: React.FC<{ icon: any, title: string, subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
    <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-medical-blue group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <h3 className="font-bold text-white text-lg leading-tight">{title}</h3>
            <p className="text-sm text-white/50 leading-snug mt-1">{subtitle}</p>
        </div>
    </div>
);

// --- Component: DeviceScroll ---
const DeviceScroll: React.FC = () => {
  const { loaded, images, progress } = useImagePreloader();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRenderedIndex = useRef<number>(-1);

  // Responsive Check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (loaded) window.scrollTo(0, 0);
  }, [loaded]);

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

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
    }
  };

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

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const canvasRatio = rect.width / rect.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawHeight = rect.height;
      drawWidth = img.width * (rect.height / img.height);
      offsetX = (rect.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = rect.width;
      drawHeight = img.height * (rect.width / img.width);
      offsetX = 0;
      offsetY = (rect.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastRenderedIndex.current = clampedIndex;
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (loaded) requestAnimationFrame(() => renderFrame(latest));
  });

  useEffect(() => {
    if (loaded) {
      const handleResize = () => {
        updateCanvasSize();
        renderFrame(frameIndex.get());
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaded, images]);

  // --- Animations ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => v > 0.1 ? 'none' : 'auto');

  const opacity2 = useTransform(scrollYProgress, [0.20, 0.30, 0.45, 0.5], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.20, 0.45], [50, -50]);

  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.8], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.75], [50, -50]);

  // 90% Section (Trusted By)
  const opacity4 = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const y4 = useTransform(scrollYProgress, [0.85, 0.95], [50, 0]);

  return (
    <>
      <AnimatePresence>
        {!loaded && <PreloaderScreen progress={progress} />}
      </AnimatePresence>

      <div ref={containerRef} className="relative h-[600vh] bg-[#050505] text-white">
        
        {/* Sticky Canvas Container - CENTERED (h-screen, flex items-center) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full" 
            style={{ width: '100%', height: '100%' }}
          />

          <WatermarkCover />

          <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-6 h-full w-full">
            
            {/* 1. Hero UI (0-15%) */}
            {/* Mobile: Bottom Sheet logic */}
            <motion.div 
              style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents }}
              className={`absolute z-20 ${
                isMobile 
                  ? "bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/90 to-transparent text-center" 
                  : "top-[15vh] right-[5%] w-[45%] max-w-xl text-right"
              }`}
            >
              <h1 className="text-4xl font-bold leading-tight tracking-tighter text-white/90 md:text-5xl lg:text-6xl">
                E-ResQ device for <br/> Residential emergency
              </h1>
              <p className="mt-4 text-lg text-white/60 md:text-xl font-light">
                One device solving many problems.
              </p>
              
              <div className={`mt-6 flex flex-col gap-4 ${isMobile ? "items-center" : "items-end"}`}>
                 {!isMobile && (
                    <p className="max-w-md text-base text-white/50 leading-relaxed">
                        E-ResQ v3.0 bridges the gap between rugged hardware and cloud intelligence. The ultimate digital companion for your physical safety device.
                    </p>
                 )}
                 
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
                 
                 {!isMobile && (
                    <div className="mt-8 flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map((i) => (
                                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050505] bg-slate-700 text-xs font-bold text-white">
                                    <User className="h-4 w-4 text-white/50" />
                                </div>
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white">2,000+</div>
                            <div className="text-xs text-white/50">families protected</div>
                        </div>
                    </div>
                 )}
              </div>
            </motion.div>

            {/* 2. Feature Cards (30-45%) */}
            <motion.div 
              style={{ opacity: opacity2, y: y2 }}
              className={`absolute z-20 ${
                isMobile 
                  ? "bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent" 
                  : "top-[30vh] right-[5%] w-[35%] max-w-md"
              }`}
            >
              <h2 className={`text-3xl font-bold tracking-tighter text-white/90 mb-6 ${isMobile ? "text-center" : "text-right"}`}>
                Hardware Meets <br/> Cloud Intelligence
              </h2>
              <div className="flex flex-col gap-4">
                  <FeatureCard icon={Phone} title="Instant Dispatch" subtitle="One-touch connection to family & emergency services." />
                  <FeatureCard icon={Camera} title="AI Threat Cam" subtitle="On-device computer vision detects aggression instantly." />
                  <FeatureCard icon={Activity} title="Seismic Predictor" subtitle="Advanced sensors provide early earthquake warning." />
              </div>
            </motion.div>

            {/* 3. Split Layout (60-75%) - Fixed Spacing */}
            <motion.div 
              style={{ opacity: opacity3, y: y3 }}
              className={`absolute top-1/2 w-full -translate-y-1/2 flex z-20 ${isMobile ? "flex-col items-center gap-8 justify-end h-full pb-20" : "justify-between px-4"}`}
            >
                {/* Left Text - Pushed further left */}
                <div className={`flex flex-col items-center text-center max-w-xs ${!isMobile && "ml-[2%]"}`}>
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                        <Activity className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">1. Detect</h3>
                    <p className="text-white/60">Sensors monitor environment for anomalies 24/7.</p>
                </div>

                {/* Center Text (Alert) - Only on Desktop or handled via scroll logic */}
                 {!isMobile && (
                    <div className="flex flex-col items-center text-center max-w-xs self-end mb-[-10vh]">
                         <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                            <Bell className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">2. Alert</h3>
                        <p className="text-white/60">Instant notifications sent to your circle.</p>
                    </div>
                 )}

                {/* Right Text - Pushed further right */}
                <div className={`flex flex-col items-center text-center max-w-xs ${!isMobile && "mr-[2%]"}`}>
                     <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">3. Secure</h3>
                    <p className="text-white/60">Authorities dispatched instantly upon confirmation.</p>
                </div>
            </motion.div>

            {/* 4. CTA & Trusted (90-100%) */}
            <motion.div 
              style={{ opacity: opacity4, y: y4 }}
              className={`absolute z-20 w-full max-w-3xl ${isMobile ? "bottom-20 left-1/2 -translate-x-1/2 text-center" : "top-[40%] right-[5%] text-right"}`}
            >
              {isMobile ? (
                  // Mobile CTA Layout
                   <div className="flex flex-col items-center">
                        <h2 className="text-4xl font-bold tracking-tighter text-white/90 mb-4">Peace of Mind</h2>
                        <Link to="/pre-book" className="inline-block rounded-full bg-white px-8 py-4 text-lg font-bold text-black">Pre-Book Device</Link>
                   </div>
              ) : (
                  // Desktop Trusted Layout (Right Side)
                  <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Trusted by Industry Leaders</h3>
                       <div className="flex flex-col items-end gap-4 text-xl font-bold text-white/80">
                           <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-medical-blue"/> SecureTech</span>
                           <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-medical-blue"/> GlobalGuard</span>
                           <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-medical-blue"/> SafeHome</span>
                           <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-medical-blue"/> ResQ Systems</span>
                       </div>
                       
                       <div className="mt-12">
                            <Link to="/pre-book" className="inline-block rounded-full bg-white px-10 py-5 text-xl font-bold text-black hover:scale-105 transition-transform">
                                Pre-Book Now
                            </Link>
                       </div>
                  </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceScroll;
