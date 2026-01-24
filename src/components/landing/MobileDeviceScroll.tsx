import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Twitter, Github, Linkedin, Disc, ChevronDown } from 'lucide-react';
import { Preloader } from '../ui/Preloader';

// --- Component: Gaming Loading Fallback ---
const GamingTextFallback = () => {
    return (
        <div className="absolute inset-0 z-[75] flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <p className="text-green-500 font-mono text-xl tracking-widest animate-pulse">
                        &gt; SYSTEM_LOADING...
                    </p>
                    <p className="text-green-500/50 font-mono text-xs mt-2 text-center">
                        INITIALIZING VIDEO DRIVERS
                    </p>
                </div>
                {/* Glitch bar */}
                <div className="w-48 h-1 bg-green-900 overflow-hidden relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-green-500 w-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </div>
        </div>
    );
};

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
    objectPosition = "center",
    onReady,
    alwaysVisible = false
}: {
    src: string;
    opacity: MotionValue<number>;
    zIndex: number;
    className?: string;
    objectPosition?: string;
    onReady?: () => void;
    alwaysVisible?: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Minimal display logic: Only hide if NOT alwaysVisible and fully transparent
    const display = useTransform(opacity, (v) => (alwaysVisible || v > 0.01) ? "block" : "none");

    // Check availability on mount (if cached)
    useEffect(() => {
        if (videoRef.current && videoRef.current.readyState >= 3) {
            onReady?.();
        }
    }, [onReady]);

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
                autoPlay
                playsInline
                preload="auto"
                // Performance: Signal when enough data is loaded to play
                onLoadedData={() => onReady?.()}
                onCanPlay={() => onReady?.()}
                onPlaying={() => onReady?.()} // Extra signal
                style={{ objectPosition }}
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
};

// --- Hook: Simulated Preloader (Decoupled) ---
const useSimulatedPreloader = () => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoaded(true), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return { loaded, progress };
};

const MobileDeviceScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [heroReady, setHeroReady] = useState(false); // Track real video load status
    const { loaded, progress } = useSimulatedPreloader(); // Standard timer

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // --- Transform Logic (6 Stages) ---
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

                    {/* Fallback Layer: Covers everything if Hero video is NOT ready */}
                    <AnimatePresence>
                        {!heroReady && <GamingTextFallback />}
                    </AnimatePresence>

                    {/* --- VIDEO STACK --- */}
                    {/* Hero: ALWAYS VISIBLE */}
                    <VideoLayer
                        src="/hero%20section.mp4"
                        opacity={heroOpacity}
                        zIndex={60}
                        objectPosition="center"
                        onReady={() => setHeroReady(true)}
                        alwaysVisible={true}
                    />

                    <VideoLayer src="/trans2.mp4" opacity={trans2Opacity} zIndex={50} objectPosition="25% 50%" />
                    <VideoLayer src="/trans3.mp4" opacity={trans3Opacity} zIndex={40} objectPosition="60% 50%" />
                    <VideoLayer src="/trans4.mp4" opacity={trans4Opacity} zIndex={30} objectPosition="35% 50%" />
                    <VideoLayer src="/trans5.mp4" opacity={trans5Opacity} zIndex={20} objectPosition="25% 50%" />
                    <VideoLayer src="/fotterbg.mp4" opacity={footerOpacity} zIndex={10} objectPosition="40% 50%" />

                    {/* --- OVERLAYS --- */}
                    <WatermarkCover />

                    {/* 1. MOBILE HERO UI - Removed Simulator Buttons */}
                    {heroReady && ( // Only show UI when video is ready (prevent overlap)
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
                                <p className="text-lg text-white/80 font-light mb-8 drop-shadow-lg leading-relaxed">
                                    One device. Total protection. <br />
                                    <span className="text-xs opacity-60">Automated defense active.</span>
                                </p>

                                {/* Removed "Launch Simulator" and "Pre-Book" buttons as requested */}

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
                    )}

                    {/* 6. MOBILE FOOTER UI */}
                    <motion.div
                        style={{ opacity: footerUIOpacity, pointerEvents: footerPointerEvents }}
                        className="absolute inset-x-0 bottom-0 z-[70] h-[80vh] flex flex-col justify-end pb-28 p-6"
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
