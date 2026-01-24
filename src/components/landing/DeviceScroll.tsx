import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Play, Settings, Twitter, Github, Linkedin, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Preloader } from '../ui/Preloader';

// --- Component: WatermarkCover ---
const WatermarkCover: React.FC = () => {
    return (
        <div className="absolute bottom-0 right-0 z-[100] pointer-events-none">
            <div className="w-[300px] h-[100px] bg-[radial-gradient(circle_at_bottom_right,_#050505_60%,_transparent_100%)]"></div>
            <div className="absolute bottom-6 right-8 text-xs font-mono tracking-widest text-white/20 select-none">
                E-ResQ // SYSTEM ACTIVE
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
    forcePlay = false
}: {
    src: string;
    opacity: MotionValue<number>;
    zIndex: number;
    className?: string;
    forcePlay?: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // optimize performance: hide when opacity is 0
    const display = useTransform(opacity, (v) => v <= 0.01 ? "none" : "block");

    // Smart Play/Pause Logic
    useMotionValueEvent(opacity, "change", (latest) => {
        const video = videoRef.current;
        if (!video) return;

        if (latest > 0.01) {
            if (video.paused) video.play().catch(() => { });
        } else {
            if (!video.paused) video.pause();
        }
    });

    // Force Play Effect (e.g., when preloader ends)
    useEffect(() => {
        if (forcePlay && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [forcePlay]);

    return (
        <motion.div
            style={{ opacity, display, zIndex }}
            className={`absolute inset-0 w-full h-full ${className}`}
        >
            <video
                ref={videoRef}
                src={src}
                muted // Muted required for autoplay
                loop
                playsInline
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
};

// --- Hook: Simulated Preloader ---
const useSimulatedPreloader = () => {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoaded(true), 500); // Small delay after 100%
                    return 100;
                }
                return prev + 2; // Speed of loader
            });
        }, 30); // ~1.5 seconds total
        return () => clearInterval(interval);
    }, []);

    return { loaded, progress };
};

const DeviceScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const { loaded, progress } = useSimulatedPreloader();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // --- Transform Logic (6 Stages) ---

    // 1. Hero: 0% -> 15% (Fade Out)
    const heroOpacity = useTransform(smoothProgress, [0.12, 0.18], [1, 0]);

    // 2. Trans 2: 15% -> 32%
    const trans2Opacity = useTransform(smoothProgress, [0.12, 0.18, 0.29, 0.35], [0, 1, 1, 0]);

    // 3. Trans 3: 32% -> 48%
    const trans3Opacity = useTransform(smoothProgress, [0.29, 0.35, 0.45, 0.51], [0, 1, 1, 0]);

    // 4. Trans 4: 48% -> 64%
    const trans4Opacity = useTransform(smoothProgress, [0.45, 0.51, 0.61, 0.67], [0, 1, 1, 0]);

    // 5. Trans 5: 64% -> 80%
    const trans5Opacity = useTransform(smoothProgress, [0.61, 0.67, 0.77, 0.83], [0, 1, 1, 0]);

    // 6. Footer: 80% -> 100%
    const footerOpacity = useTransform(smoothProgress, [0.77, 0.83], [0, 1]);


    // --- UI Opacity Logic ---

    // Hero UI Split Logic:
    // 0% - 7%: Opacity 0 (Clean Video)
    // 7% - 8%: Fade In
    // 8% - 15%: Visible
    // 15% - 18%: Fade Out
    const heroUIOpacity = useTransform(smoothProgress, [0, 0.07, 0.08, 0.15, 0.18], [0, 0, 1, 1, 0]);
    const heroPointerEvents = useTransform(smoothProgress, (v) => (v > 0.07 && v < 0.18) ? 'auto' : 'none');

    const footerUIOpacity = useTransform(smoothProgress, [0.85, 0.9], [0, 1]);
    const footerPointerEvents = useTransform(smoothProgress, (v) => v > 0.85 ? 'auto' : 'none');


    if (isMobile) {
        return null; // Logic handled by MobileDeviceScroll
    }

    return (
        <>
            <AnimatePresence>
                {!loaded && <Preloader progress={progress} />}
            </AnimatePresence>

            <div ref={containerRef} className="relative h-[600vh] bg-[#050505]">

                <div className="sticky top-0 h-screen w-full overflow-hidden">

                    {/* --- VIDEO STACK --- */}

                    {/* 1. Hero */}
                    <VideoLayer src="/hero%20section.mp4" opacity={heroOpacity} zIndex={60} forcePlay={loaded} />

                    {/* 2. Trans 2 */}
                    <VideoLayer src="/trans2.mp4" opacity={trans2Opacity} zIndex={50} />

                    {/* 3. Trans 3 */}
                    <VideoLayer src="/trans3.mp4" opacity={trans3Opacity} zIndex={40} />

                    {/* 4. Trans 4 */}
                    <VideoLayer src="/trans4.mp4" opacity={trans4Opacity} zIndex={30} />

                    {/* 5. Trans 5 */}
                    <VideoLayer src="/trans5.mp4" opacity={trans5Opacity} zIndex={20} />

                    {/* 6. Footer */}
                    <VideoLayer src="/fotterbg.mp4" opacity={footerOpacity} zIndex={10} />


                    {/* --- UI OVERLAYS --- */}

                    {/* GLOBAL: Watermark (Always Visible) */}
                    <WatermarkCover />

                    {/* 1. HERO UI (Appears after 7% scroll) */}
                    <motion.div
                        style={{ opacity: heroUIOpacity, pointerEvents: heroPointerEvents }}
                        className="absolute inset-0 z-[70] flex flex-col items-center justify-center"
                    >
                        {/* Cinematic Gradient Backdrop */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-[60vh] bg-gradient-to-r from-black/80 via-black/40 to-transparent blur-xl scale-150 transform" />
                        </div>

                        <div className="relative z-10 text-center max-w-4xl px-6">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                                E-ResQ device for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                                    Residential emergency
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 font-light mb-10 tracking-wide drop-shadow-lg">
                                One device solving many problems.
                            </p>

                            <div className="flex items-center justify-center gap-6 pointer-events-auto">
                                <Link
                                    to="/device-simulator"
                                    className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                                >
                                    <Play className="fill-black h-5 w-5" />
                                    Launch Simulator
                                </Link>
                                <Link
                                    to="/pre-book"
                                    className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold transition-all hover:bg-white/20 hover:border-white/40"
                                >
                                    <Settings className="h-5 w-5" />
                                    Pre-Book Unit
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-4 opacity-80 mix-blend-screen">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center">
                                            <span className="text-[10px] text-white/50">USR</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white leading-none">2,000+ Families</p>
                                    <p className="text-sm text-white/60">Protected by E-ResQ</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* 6. FOOTER UI (Glassmorphism) */}
                    <motion.div
                        style={{ opacity: footerUIOpacity, pointerEvents: footerPointerEvents }}
                        className="absolute inset-x-0 bottom-0 z-[70] h-[50vh] flex flex-col justify-end pb-12"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-white/80">
                            {/* Column 1 */}
                            <div className="col-span-2">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Disc className="animate-spin-slow h-6 w-6 text-blue-500" /> E-ResQ
                                </h3>
                                <p className="max-w-sm text-white/50 leading-relaxed">
                                    The world's first hybrid defense system. Combining physical ruggedness with neural cloud intelligence.
                                </p>
                            </div>

                            {/* Column 2 */}
                            <div>
                                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Product</h4>
                                <ul className="space-y-4 text-sm text-white/60">
                                    <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                                    <li className="hover:text-white cursor-pointer transition-colors">Simulator</li>
                                    <li className="hover:text-white cursor-pointer transition-colors">Safety Specs</li>
                                    <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                                </ul>
                            </div>

                            {/* Column 3 */}
                            <div>
                                <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Connect</h4>
                                <div className="flex gap-4">
                                    <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                        <Twitter className="h-4 w-4" />
                                    </a>
                                    <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                        <Github className="h-4 w-4" />
                                    </a>
                                    <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                        <Linkedin className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/30">
                            <p>© 2026 E-ResQ Inc. All rights reserved.</p>
                            <div className="flex gap-6">
                                <span>Privacy Policy</span>
                                <span>Terms of Service</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </>
    );
};

export default DeviceScroll;
