import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid, Calendar, Trophy, Layers,
    FileText, User, LogOut, Menu, Bell, Sparkles, Loader2,
    ChevronRight, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

// --- ANIMATION VARIANTS ---
const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
};

const blobVariants = {
    animate: {
        scale: [1, 1.1, 0.9, 1],
        rotate: [0, 90, -90, 0],
        transition: { duration: 20, repeat: Infinity, ease: "linear" }
    }
};

const StudentLayout = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Scroll effect for header glass
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 🔒 Security Check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-[#FF6B35]" />
                </motion.div>
            </div>
        );
    }

    if (!user) return <Navigate to="/auth?mode=login" replace />;

    const navItems = [
        { title: 'Dashboard', icon: LayoutGrid, path: '/student/dashboard' },
        { title: 'My Events', icon: Calendar, path: '/student/events' },
        { title: 'Hackathons', icon: Trophy, path: '/student/hackathons' },
        { title: 'Showcase', icon: Layers, path: '/student/showcase' },
        { title: 'Lens Studio', icon: Sparkles, path: '/student/lens' },
        { title: 'Surveys', icon: FileText, path: '/student/surveys' },
        { title: 'Profile', icon: User, path: '/student/profile' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Abstract Decorative Line */}
            <div className="absolute top-0 left-6 w-[1px] h-full bg-gradient-to-b from-orange-200/50 via-green-200/50 to-transparent" />

            {/* Brand Section */}
            <div className="pt-8 pb-10 px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-orange-500 rounded-xl blur-lg opacity-40 animate-pulse" />
                        <div className="relative w-full h-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F50] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/20 ring-1 ring-white/50">
                            B
                        </div>
                    </div>
                    <div>
                        <h2 className="font-bold text-xl tracking-tight text-slate-900 leading-none">
                            Bharat<span className="text-[#FF6B35]">XR</span>
                        </h2>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Hub</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 px-4 space-y-2 relative z-10"
            >
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className="relative block group"
                        >
                            <motion.div
                                variants={itemVariants}
                                className={`
                  relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                  ${isActive ? 'text-white shadow-lg shadow-orange-500/20 translate-x-2' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'}
                `}
                            >
                                {/* Active Background - The "Liquid" Effect */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8F50] rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}

                                {/* Icon */}
                                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#FF6B35]'}`} />

                                {/* Text */}
                                <span className={`text-sm font-semibold relative z-10 ${isActive ? 'text-white' : ''}`}>
                  {item.title}
                </span>

                                {/* Active Chevron */}
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute right-4 text-white/80"
                                    >
                                        <ChevronRight size={16} />
                                    </motion.div>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>

            {/* Bottom Profile Card */}
            <div className="p-4 mt-auto relative z-10">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                    {/* Shine Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors" />

                    <div className="flex items-center gap-3 relative z-10">
                        <Avatar className="h-10 w-10 ring-2 ring-white/20">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=22c55e&color=fff`} />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role || 'Student'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/auth?mode=login'); }}
                        className="mt-3 flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-red-300 hover:text-red-200"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-orange-100 selection:text-orange-900 relative overflow-x-hidden">

            {/* === 1. DYNAMIC BACKGROUND LAYER === */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Top Right Orange Orb */}
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#FF6B35]/5 rounded-full blur-3xl mix-blend-multiply filter"
                />
                {/* Bottom Left Green Orb */}
                <motion.div
                    variants={blobVariants}
                    animate="animate"
                    className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-green-400/5 rounded-full blur-3xl mix-blend-multiply filter"
                />
                {/* Center Yellow Accent */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-yellow-200/10 rounded-full blur-3xl"
                />
            </div>

            {/* === 2. SIDEBAR (Floating Glass) === */}
            <aside className="hidden lg:block fixed left-6 top-6 bottom-6 w-80 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[8px_0_30px_-10px_rgba(0,0,0,0.05)] rounded-[2.5rem] z-50">
                <SidebarContent />
            </aside>

            {/* === 3. MAIN CONTENT AREA === */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-[23rem] transition-all duration-300 relative z-10">

                {/* HEADER */}
                <header
                    className={`
            sticky top-0 z-40 px-6 lg:px-10 h-24 flex items-center justify-between transition-all duration-300
            ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100/50' : 'bg-transparent'}
          `}
                >
                    {/* Mobile Toggle */}
                    <div className="lg:hidden">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="bg-white shadow-sm border border-slate-100">
                                    <Menu className="w-6 h-6 text-slate-700" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 border-none bg-white/95 backdrop-blur-xl">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Search Bar (Fake for visual) */}
                    <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/60 px-4 py-2.5 rounded-full shadow-sm w-96 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[#FF6B35]/20">
                        <Search className="w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search events, hackathons..."
                            className="border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative p-3 bg-white border border-white/60 rounded-full shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-[#FF6B35]"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                        </motion.button>

                        {/* Profile Dropdown Trigger (Simplified for Layout) */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="hidden sm:flex items-center gap-3 bg-white pl-4 pr-2 py-1.5 rounded-full border border-white/60 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-800 leading-tight">Hi, {user.name?.split(' ')[0]}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                            </div>
                            <Avatar className="h-9 w-9 ring-2 ring-orange-50">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=FF6B35&color=fff`} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        </motion.div>
                    </div>
                </header>

                {/* PAGE CONTENT CONTAINER */}
                <main className="flex-1 p-6 lg:p-10 pt-2">
                    {/* This wrapper handles the page transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="h-full"
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