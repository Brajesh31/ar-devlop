import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

// --- ANIMATED BACKGROUND ELEMENT ---
const FloatingOrb = ({ className, delay }: { className: string, delay: number }) => (
    <motion.div
        className={`absolute rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none ${className}`}
        animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration: 12,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
    />
);

const AuthPage = () => {
    const [searchParams] = useSearchParams();

    // View State: 'login' | 'signup' | 'forgot'
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

    // Sync URL ?mode=signup
    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'signup') setView('signup');
    }, [searchParams]);

    return (
        <div className="min-h-screen w-full bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden selection:bg-orange-200 selection:text-orange-900">

            {/* --- ANIMATED BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden">
                <FloatingOrb className="w-[500px] h-[500px] bg-orange-200/60 top-[-10%] left-[-10%]" delay={0} />
                <FloatingOrb className="w-[600px] h-[600px] bg-indigo-200/50 bottom-[-10%] right-[-10%]" delay={2} />
                <FloatingOrb className="w-[300px] h-[300px] bg-pink-200/40 top-[40%] left-[40%]" delay={4} />
            </div>

            {/* --- MAIN GLASS CARD --- */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`
          relative z-10 w-full max-w-[1100px] 
          bg-white/60 backdrop-blur-xl shadow-2xl shadow-slate-200/50
          border border-white/80 rounded-[32px]
          flex flex-col lg:flex-row overflow-hidden
          ${view === 'signup' ? 'min-h-[750px] lg:h-[750px]' : 'min-h-[600px] lg:h-[600px]'}
        `}
            >
                {/* --- LEFT PANEL (Brand Visuals) --- */}
                <motion.div
                    layout
                    className={`
            hidden lg:flex flex-col justify-between p-12 text-white relative
            bg-gradient-to-br from-[#FF6B35] to-[#FF3F00]
            ${view === 'signup' ? 'w-[40%]' : 'w-[45%]'}
            transition-all duration-700 ease-in-out
          `}
                >
                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] mix-blend-overlay"></div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <img src="/Bharatxr.png" alt="Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">BharatXR</span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
                                    {view === 'login' && "Welcome Back."}
                                    {view === 'signup' && "Join the Revolution."}
                                    {view === 'forgot' && "Recover Access."}
                                </h1>
                                <p className="text-orange-50/90 text-lg font-medium leading-relaxed max-w-[90%]">
                                    {view === 'login' && "Log in to access your dashboard, courses, and community."}
                                    {view === 'signup' && "Create an account to start your journey in Extended Reality."}
                                    {view === 'forgot' && "Enter your registered email to reset your password securely."}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Stats */}
                    <div className="relative z-10 flex gap-6 pt-8 border-t border-white/20">
                        <div>
                            <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider">Members</p>
                            <p className="text-xl font-bold">12k+</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider">Courses</p>
                            <p className="text-xl font-bold">85+</p>
                        </div>
                    </div>
                </motion.div>

                {/* --- RIGHT PANEL (Forms) --- */}
                <div className="flex-1 bg-white/40 p-6 sm:p-12 flex flex-col justify-center items-center relative">
                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <img src="/Bharatxr.png" alt="Logo" className="w-12 h-12 mx-auto mb-2" />
                            <h2 className="text-xl font-bold text-slate-800">BharatXR</h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {view === 'login' && (
                                <LoginForm
                                    key="login-form"
                                    onForgotPassword={() => setView('forgot')}
                                    onSignup={() => setView('signup')}
                                />
                            )}

                            {view === 'signup' && (
                                <SignupForm
                                    key="signup-form"
                                    onLogin={() => setView('login')}
                                />
                            )}

                            {view === 'forgot' && (
                                <ForgotPasswordForm
                                    key="forgot-form"
                                    onBackToLogin={() => setView('login')}
                                />
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;