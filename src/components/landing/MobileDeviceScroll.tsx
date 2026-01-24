import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence, MotionValue } from 'framer-motion';
import { Play, Settings, Twitter, Github, Linkedin, Disc, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Preloader } from '../ui/Preloader';

// --- Component: WatermarkCover ---
const WatermarkCover: React.FC = () => {
    return (
        <div className="absolute bottom-0 right-0 z-[100] pointer-events-none">
            <div className="w-[180px] h-[80px] bg-[radial-gradient(circle_at_bottom_right,_#050505_60%,_transparent_100%)]"></div>
            <div className="absolute bottom-4 right-4 text-[10px] font-mono tracking-widest text-white/20 select-none">
                E-ResQ // MOBILE
            </div>
        </div>
    );
};

// --- Helper: Playback-Smart Video Layer ---
const VideoLayer = ({
    src,
    opacity,
    zIndex,
    className = "",
    forcePlay = false,
    objectPosition = "center",
    onReady,
    alwaysVisible = false // NEW: crucial for hero video
}: {
    src: string;
    opacity: MotionValue<number>;
    zIndex: number;
    className?: string;
    forcePlay?: boolean;
    objectPosition?: string;
    onReady?: () => void;
    alwaysVisible?: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // optimize performance: hide when opacity is 0 (UNLESS alwaysVisible is true)
    // This prevents the browser from discarding the video frame when it's technically "hidden" by the preloader
    const display = useTransform(opacity, (v) => (alwaysVisible || v > 0.01) ? "block" : "none");

    // Smart Play/Pause Logic
    useMotionValueEvent(opacity, "change", (latest) => {
        const video = videoRef.current;
        if (!video) return;

        if (latest > 0.01 || alwaysVisible) {
            if (video.paused) video.play().catch(() => { });
        } else {
            if (!video.paused) video.pause();
        }
    });

    // Force Play Effect
    useEffect(() => {
        if (forcePlay && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [forcePlay]);

    // Check availability on mount (if cached)
    useEffect(() => {
        if (videoRef.current && videoRef.current.readyState >= 3) {
            onReady?.();
        }
    }, []);

    return (
        <motion.div
            style={{ opacity, display, zIndex }}
            className={`absolute inset-0 w-full h-full ${className}`}
        >
            <video
                ref={videoRef}
                src={src}
                muted
                loop
                autoPlay // Explicitly request autoplay
                playsInline
                preload="auto" // Aggressive loading
                // Performance: Signal when enough data is loaded to play
                onLoadedData={() => onReady?.()}
                // Fallback: Signal on mount if already cached/ready
                onCanPlay={() => onReady?.()}
                style={{ objectPosition }} // Custom positioning
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
};

// --- Hook: Simulated Preloader ---
const useSimulatedPreloader = (videoReady: boolean) => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    // Check if video is truly ready before completing 100%
                    if (videoReady) {
                        if (prev >= 100) {
                            clearInterval(interval);
                            setTimeout(() => setLoaded(true), 500);
                            return 100;
                        }
                        return prev + 1; // Finish smoothly
                    }
                    return 95; // Wait at 95% for video
                }
                return prev + 2; // Normal progress
            });
        }, 30);
        return () => clearInterval(interval);
    }, [videoReady]);

    return { loaded, progress };
};

const MobileDeviceScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [heroReady, setHeroReady] = useState(false); // Track real video load status

    // Safety Timeout: Force ready after 4s (prevents getting stuck)
    useEffect(() => {
        const timer = setTimeout(() => setHeroReady(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    const { loaded, progress } = useSimulatedPreloader(heroReady);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // --- Transform Logic (6 Stages - Exact Match to Desktop) ---
    const heroOpacity = useTransform(smoothProgress, [0.12, 0.18], [1, 0]);
    const trans2Opacity = useTransform(smoothProgress, [0.12, 0.18, 0.29, 0.35], [0, 1, 1, 0]);
    const trans3Opacity = useTransform(smoothProgress, [0.29, 0.35, 0.45, 0.51], [0, 1, 1, 0]);
    const trans4Opacity = useTransform(smoothProgress, [0.45, 0.51, 0.61, 0.67], [0, 1, 1, 0]);
    const trans5Opacity = useTransform(smoothProgress, [0.61, 0.67, 0.77, 0.83], [0, 1, 1, 0]);
    const footerOpacity = useTransform(smoothProgress, [0.77, 0.83], [0, 1]);

    // --- UI Opacity Logic ---
    const heroUIOpacity = useTransform(smoothProgress, [0, 0.07, 0.08, 0.15, 0.18], [0, 0, 1, 1, 0]);
    const heroPointerEvents = useTransform(smoothProgress, (v) => (v > 0.07 && v < 0.18) ? 'auto' : 'none');

    const footerUIOpacity = useTransform(smoothProgress, [0.85, 0.9], [0, 1]);
    const footerPointerEvents = useTransform(smoothProgress, (v) => v > 0.85 ? 'auto' : 'none');

    return (
        <>
            <AnimatePresence>
                {!loaded && <Preloader progress={progress} />}
            </AnimatePresence>

            <div ref={containerRef} className="relative h-[600vh] bg-[#050505]">

                <div className="sticky top-0 h-screen w-full overflow-hidden">

                    {/* --- VIDEO STACK WITH CUSTOM SHIFTS --- */}
                    {/* Hero: ALWAYS VISIBLE */}
                    <VideoLayer
                        src="/hero%20section.mp4"
                        opacity={heroOpacity}
                        zIndex={60}
                        forcePlay={loaded}
                        objectPosition="center"
                        onReady={() => setHeroReady(true)}
                        alwaysVisible={true}
                    />

                    {/* Trans2: Shift Left (25%) */}
                    <VideoLayer src="/trans2.mp4" opacity={trans2Opacity} zIndex={50} objectPosition="25% 50%" />

                    {/* Trans3: Shift Right (60% - Little bit right) */}
                    <VideoLayer src="/trans3.mp4" opacity={trans3Opacity} zIndex={40} objectPosition="60% 50%" />

                    {/* Trans4: Shift Left (35% - Little bit left) */}
                    <VideoLayer src="/trans4.mp4" opacity={trans4Opacity} zIndex={30} objectPosition="35% 50%" />

                    {/* Trans5: Shift Left (25%) */}
                    <VideoLayer src="/trans5.mp4" opacity={trans5Opacity} zIndex={20} objectPosition="25% 50%" />

                    {/* Footer: Slight Left (40%) */}
                    <VideoLayer src="/fotterbg.mp4" opacity={footerOpacity} zIndex={10} objectPosition="40% 50%" />


                    {/* --- OVERLAYS --- */}
                    <WatermarkCover />

                    {/* 1. MOBILE HERO UI */}
                    <motion.div
                        style={{ opacity: heroUIOpacity, pointerEvents: heroPointerEvents }}
                        className="absolute inset-0 z-[70] flex flex-col items-center justify-center p-6 text-center"
                    >
                        {/* Gradient Backdrop */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                        </div>

                        <div className="relative z-10 w-full max-w-sm">
                            <h1 className="text-4xl font-bold tracking-tighter text-white mb-4 drop-shadow-2xl">
                                E-ResQ device for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                                    Residential
                                </span>
                            </h1>
                            <p className="text-lg text-white/80 font-light mb-8 drop-shadow-lg">
                                One device. Total protection.
                            </p>

                            <div className="flex flex-col gap-3 pointer-events-auto">
                                <Link
                                    to="/device-simulator"
                                    className="flex items-center justify-center gap-3 bg-white text-black px-6 py-4 rounded-full font-bold shadow-lg"
                                >
                                    <Play className="fill-black h-4 w-4" />
                                    Launch Simulator
                                </Link>
                                <Link
                                    to="/pre-book"
                                    className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-full font-bold"
                                >
                                    <Settings className="h-4 w-4" />
                                    Pre-Book Unit
                                </Link>
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-4 opacity-80">
                                <div className="text-center">
                                    <p className="font-bold text-white text-2xl">2,000+</p>
                                    <p className="text-xs text-white/60">Families Protected</p>
                                </div>
                            </div>
                        </div>

                        {/* Scroll Down Indicator */}
                        <motion.div
                            className="absolute bottom-12 left-0 right-0 flex justify-center text-white/50"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] tracking-widest uppercase">Scroll Down</span>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 6. MOBILE FOOTER UI */}
                    <motion.div
                        style={{ opacity: footerUIOpacity, pointerEvents: footerPointerEvents }}
                        className="absolute inset-x-0 bottom-0 z-[70] h-[80vh] flex flex-col justify-end pb-28 p-6" // Increased pb-28 to clear watermark
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                        <div className="relative z-10 w-full space-y-8 text-white/80">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Disc className="animate-spin-slow h-5 w-5 text-blue-500" /> E-ResQ
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed">
                                    Hybrid defense system. Neural cloud intelligence.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Product</h4>
                                    <ul className="space-y-3 text-sm text-white/60">
                                        <li>Features</li>
                                        <li>Simulator</li>
                                        <li>Safety Specs</li>
                                        <li>Pricing</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Connect</h4>
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Twitter className="h-4 w-4" /></div>
                                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Github className="h-4 w-4" /></div>
                                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Linkedin className="h-4 w-4" /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex flex-col gap-4 text-xs text-white/30 text-center">
                                <p>© 2026 E-ResQ Inc.</p>
                                <div className="flex justify-center gap-6">
                                    <span>Privacy</span>
                                    <span>Terms</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default MobileDeviceScroll;
