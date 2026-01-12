import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import heroImg from '@/assets/bharat-xr-hero.png';

// --- AESTHETIC ASSETS (LIGHT THEME) ---
// Clean, architectural, white/grey abstract geometric
const GLOBAL_BG_IMAGE = "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2940&auto=format&fit=crop";
// --- 3D FLOATING BACKGROUND ORBS ---
const FloatingOrb = ({ className, delay, duration = 20 }: { className: string, delay: number, duration?: number }) => (
    <motion.div
        className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none ${className}`}
        animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
    />
);

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

    // --- 3D TILT LOGIC ---
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]); // Reduced tilt for elegance
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'signup') setView('signup');
    }, [searchParams]);

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden selection:bg-orange-200 selection:text-orange-900 font-sans text-slate-800">

            {/* === GLOBAL BACKGROUND LAYER (LIGHT THEME) === */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* 1. Base Light Image */}
                <img src={GLOBAL_BG_IMAGE} alt="" className="w-full h-full object-cover opacity-90" />

                {/* 2. White Wash Overlay (Softens the image) */}
                <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>

                {/* 3. Subtle Warm Gradient (Matches Orange theme without being overwhelming) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/50 via-white/80 to-green-50/30 opacity-60"></div>

                {/* 4. Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
            </div>

            {/* === FLOATING ORBS (Vibrant against light bg) === */}
            <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
                <FloatingOrb className="w-[800px] h-[800px] bg-green-200/60 top-[-30%] left-[-10%]" delay={0} duration={30} />
                <FloatingOrb className="w-[600px] h-[600px] bg-orange-200/50 bottom-[-20%] right-[-10%]" delay={2} duration={35} />
            </div>

            {/* === 3D TILT CARD CONTAINER === */}
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[1200px] perspective-1000 my-8"
            >
                {/* Glass Card: White border, soft shadow */}
                <div className="relative bg-white/60 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 rounded-[36px] flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

                    {/* --- LEFT PANEL (Brand Identity) --- */}
                    <motion.div
                        layout
                        className={`
              hidden lg:flex flex-col justify-between p-12 relative overflow-hidden
              ${view === 'signup' ? 'w-[40%]' : 'w-[45%]'}
              transition-all duration-700 ease-in-out
            `}
                    >
                        {/* Left Panel Background: Keeps the brand feel but slightly brighter */}
                        <div className="absolute inset-0 z-0">
                            <img src={heroImg} alt="Community" className="w-full h-full object-cover opacity-60 grayscale contrast-125 scale-110" />

                            {/* Gradient: Slate to Dark Green (Provides contrast for White Text) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0d2e1f] to-slate-900 mix-blend-multiply opacity-95"></div>

                            {/* Bottom Glow */}
                            <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-[#FF6B35]/20 to-transparent"></div>

                            {/* Noise */}
                            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
                        </div>

                        <div className="relative z-10 h-full flex flex-col text-white">
                            <div className="mb-auto">
                                <Link to="/" className="inline-block group">
                                    <motion.img
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        src="/Bharatxr.png" alt="BharatXR Logo"
                                        className="w-48 h-auto object-contain drop-shadow-lg"
                                    />
                                </Link>
                            </div>

                            <div className="my-12">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={view}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="space-y-6"
                                    >
                                        <h1 className="text-5xl font-extrabold leading-none tracking-tight drop-shadow-xl">
                                            {view === 'login' && <span className="block">Welcome <br/> Back.</span>}
                                            {view === 'signup' && <span className="block">Join the <br/> Future.</span>}
                                            {view === 'forgot' && <span className="block">Recover <br/> Access.</span>}
                                        </h1>

                                        <div className="w-20 h-1.5 bg-gradient-to-r from-[#FF6B35] to-green-400 rounded-full shadow-lg"></div>

                                        <p className="text-slate-100 text-lg font-medium leading-relaxed max-w-[90%] drop-shadow-md">
                                            {view === 'login' && "Access India's largest XR developer community and premium resources."}
                                            {view === 'signup' && "Start building your career in Extended Reality with top mentors."}
                                            {view === 'forgot' && "We'll help you get back into your account safely and quickly."}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT PANEL (Forms - Clean Light Mode) --- */}
                    {/* increased opacity to 80% white for crispness */}
                    <div className="flex-1 bg-white/80 backdrop-blur-xl p-8 sm:p-14 lg:p-20 flex flex-col justify-center items-center relative">

                        {/* Soft inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white pointer-events-none"></div>

                        <div className="w-full max-w-[440px] relative z-10">

                            {/* Mobile Logo */}
                            <div className="lg:hidden mb-10 text-center">
                                <img src="/Bharatxr.png" alt="Logo" className="w-40 h-auto mx-auto mb-4 object-contain" />
                            </div>

                            <motion.div layout className="relative">
                                <AnimatePresence mode="wait">
                                    {view === 'login' && <LoginForm key="login" onForgotPassword={() => setView('forgot')} onSignup={() => setView('signup')} />}
                                    {view === 'signup' && <SignupForm key="signup" onLogin={() => setView('login')} />}
                                    {view === 'forgot' && <ForgotPasswordForm key="forgot" onBackToLogin={() => setView('login')} />}
                                </AnimatePresence>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;