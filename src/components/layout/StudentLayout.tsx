import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    LayoutGrid, Calendar, Trophy, Layers,
    FileText, User, LogOut, Menu, BellRing, Sparkles,
    Search, Command, ChevronRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

// --- VISUAL ASSETS & VARIANTS ---

// 1. Noise Texture for that "Tactile" Premium Feel
const NoiseOverlay = () => (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

// 2. Sidebar Animation Stagger
const sidebarVariants = {
    hidden: { x: -40, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            staggerChildren: 0.05
        }
    }
};

const navItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
};

const StudentLayout = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll Progress Bar Logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Handle Scroll Effect for Header
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 🔒 Security Redirect
    if (isLoading) return null; // Or a custom premium loader
    if (!user) return <Navigate to="/auth?mode=login" replace />;

    const navItems = [
        { title: 'Overview', icon: LayoutGrid, path: '/student/dashboard' },
        { title: 'My Events', icon: Calendar, path: '/student/events' },
        { title: 'Hackathons', icon: Trophy, path: '/student/hackathons' },
        { title: 'Showcase', icon: Layers, path: '/student/showcase' },
        { title: 'Lens Studio', icon: Sparkles, path: '/student/lens' },
        { title: 'Surveys', icon: FileText, path: '/student/surveys' },
        { title: 'Profile', icon: User, path: '/student/profile' },
    ];

    // --- COMPONENT: SIDEBAR ---
    const SidebarContent = () => (
        <div className="flex flex-col h-full relative z-20">
            {/* Brand Header */}
            <div className="pt-10 pb-8 px-8 flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="relative h-12 w-12 bg-gradient-to-tr from-[#FF6B35] to-[#FF9F43] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl ring-1 ring-white/20">
                        B
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="font-bold text-xl tracking-tight text-slate-900">
                        Bharat<span className="text-[#FF6B35]">XR</span>
                    </h1>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Student Hub</span>
                </div>
            </div>

            {/* Navigation List */}
            <div className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className="group relative block"
                        >
                            <motion.div
                                variants={navItemVariants}
                                className={`
                  relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 z-10
                  ${isActive ? 'text-[#FF6B35]' : 'text-slate-500 hover:text-slate-900'}
                `}
                            >
                                {/* ACTIVE STATE: LIQUID BACKGROUND */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabBackground"
                                        className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white border border-orange-100/50 shadow-[0_2px_12px_-4px_rgba(255,107,53,0.3)] rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}

                                {/* ICON */}
                                <item.icon
                                    size={20}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                />

                                {/* TEXT */}
                                <span className="relative z-10 text-sm font-semibold tracking-wide">
                  {item.title}
                </span>

                                {/* ACTIVE INDICATOR DOT */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#FF6B35] shadow-[0_0_8px_rgba(255,107,53,0.6)]"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Profile Card */}
            <div className="p-5 mt-auto">
                <motion.div
                    whileHover={{ y: -2 }}
                    className="relative overflow-hidden rounded-3xl bg-slate-900 p-1 shadow-2xl"
                >
                    {/* Animated Gradient Border inside card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-[#FF6B35] to-purple-500 opacity-20 animate-spin-slow" style={{ animationDuration: '3s' }} />

                    <div className="relative bg-slate-950 rounded-[1.3rem] p-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-800">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=FF6B35&color=fff`} />
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-white text-xs font-bold truncate">{user.name}</p>
                            <p className="text-slate-400 text-[10px] uppercase tracking-wider">Level 5 Pro</p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/auth?mode=login'); }}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#FF6B35] selection:text-white overflow-hidden flex">

            {/* === 1. GLOBAL PROGRESS BAR (Top) === */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6B35] to-green-500 origin-left z-[100]" style={{ scaleX }} />

            {/* === 2. AURORA BACKGROUND WRAPPER === */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <NoiseOverlay />
                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -50, 50, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[100px] mix-blend-multiply"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 30, 0],
                        y: [0, 30, -30, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-[100px] mix-blend-multiply"
                />
            </div>

            {/* === 3. DESKTOP SIDEBAR (Floating Glass Dock) === */}
            <motion.aside
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="hidden lg:block fixed left-6 top-6 bottom-6 w-[280px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[8px_0_40px_-10px_rgba(0,0,0,0.05)] rounded-[2.5rem] z-40"
            >
                <SidebarContent />
            </motion.aside>

            {/* === 4. MAIN CONTENT === */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-[320px] relative z-10 transition-all duration-300">

                {/* HEADER */}
                <header
                    className={`
            sticky top-0 z-30 px-6 lg:px-10 h-24 flex items-center justify-between transition-all duration-500
            ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100/50' : 'bg-transparent'}
          `}
                >
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="bg-white/50 backdrop-blur-md border border-white/60 shadow-sm">
                                    <Menu className="text-slate-700" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-[280px] border-none bg-white/95 backdrop-blur-xl">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Search Bar (Floating) */}
                    <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-lg border border-white/60 px-4 py-3 rounded-2xl shadow-sm w-96 group focus-within:ring-2 focus-within:ring-[#FF6B35]/20 focus-within:shadow-md transition-all">
                        <Search className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B35] transition-colors" />
                        <Input
                            placeholder="Type / to search..."
                            className="border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-slate-400 text-sm font-medium"
                        />
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-400 border border-slate-200">
                            <Command size={10} /> K
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-full shadow-sm text-slate-500 hover:text-[#FF6B35] transition-colors"
                        >
                            <BellRing size={20} />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                        </motion.button>

                        {/* Streak / XP Pill */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-full text-white shadow-lg shadow-slate-900/10">
                            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold">1,250 XP</span>
                        </div>
                    </div>
                </header>

                {/* CONTENT VIEWPORT */}
                <main className="flex-1 p-6 lg:p-10 pt-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="min-h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

            </div>
        </div>
    );
};

export default StudentLayout;