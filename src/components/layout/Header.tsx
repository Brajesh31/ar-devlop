import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, LogOut, LayoutDashboard, User, BellRing, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// --- CONFIG ---
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Hackathons', path: '/hackathons' },
  { name: 'Showcase', path: '/showcase' },
  { name: 'Resources', path: '/resources' },
];

// --- PHYSICS ANIMATIONS ---
const springTransition = { type: "spring", stiffness: 400, damping: 30 };

const headerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const pillVariant = {
  hidden: { y: -20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// --- MOBILE ANIMATIONS ---
const menuContainer = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { type: "spring", stiffness: 300, damping: 35, staggerChildren: 0.05, staggerDirection: -1 }
  },
  open: {
    opacity: 1,
    height: "100vh",
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const menuItem = {
  closed: { x: -30, opacity: 0 },
  open: { x: 0, opacity: 1 }
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  // --- THEME CONFIGURATION ---
  const desktopPillStyle = "bg-[#1F1F1F]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20";
  const mobileToggleStyle = "bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl text-slate-900";

  return (
      <>
        <motion.header
            initial="hidden"
            animate="visible"
            variants={headerContainer}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
                isScrolled ? "py-3" : "py-6"
            )}
        >
          {/* SCROLL BLUR BACKGROUND (LIGHT THEME) */}
          <div
              className={cn(
                  "absolute inset-0 w-full h-full transition-opacity duration-500 pointer-events-none",
                  isScrolled
                      ? "opacity-100 bg-white/75 backdrop-blur-md border-b border-black/5 shadow-sm"
                      : "opacity-0"
              )}
          />

          <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between relative z-10">

            {/* PILL 1: LOGO (DEEP BLACK) */}
            <Link to="/" className="relative z-50 group">
              <motion.div
                  variants={pillVariant}
                  whileHover={{ scale: 1.05, width: 180 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                      "flex items-center justify-center rounded-full transition-all duration-300",
                      "bg-[#0F0F0F] border border-white/10 shadow-2xl",
                      "h-[68px] w-[170px]"
                  )}
              >
                <img
                    src="/Bharatxr.png"
                    alt="BharatXR"
                    className="h-10 w-auto object-contain brightness-110 contrast-125"
                />
              </motion.div>
            </Link>

            {/* PILL 2: NAV (CHARCOAL GREY) */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <motion.div
                  variants={pillVariant}
                  className={cn(
                      "flex items-center px-4 py-3 rounded-full transition-all duration-500",
                      desktopPillStyle
                  )}
              >
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                      <Link
                          key={link.path}
                          to={link.path}
                          className="relative px-8 py-3 rounded-full text-[16px] font-bold transition-all duration-300 group overflow-hidden"
                      >
                        {active && (
                            <motion.div
                                layoutId="nav-bg"
                                className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                                transition={springTransition}
                            />
                        )}

                        <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                        <span className={cn(
                            "relative z-10 transition-all duration-300 block",
                            active
                                ? "bg-gradient-to-r from-[#FF6B35] via-[#FF9F43] to-[#10B981] bg-clip-text text-transparent font-extrabold"
                                : "text-white/90 group-hover:text-white"
                        )}>
                      {link.name}
                    </span>

                        {active && (
                            <motion.div
                                layoutId="active-dot"
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#10B981]"
                            />
                        )}
                      </Link>
                  );
                })}
              </motion.div>
            </nav>

            {/* PILL 3: AUTH (GRADIENT BORDER "LOGGED IN" STATE) */}
            <div className="hidden lg:flex items-center">
              {isAuthenticated && user ? (
                  // === UPGRADED LOGGED IN PILL ===
                  <div className="flex items-center gap-3">
                    {/* Notification Bell (Matches Middle Pill Theme) */}
                    <motion.button
                        variants={pillVariant}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            "p-3 rounded-full",
                            desktopPillStyle
                        )}
                    >
                      <BellRing size={20} className="text-white/90" />
                    </motion.button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* The Gradient Border Container */}
                        <motion.div
                            variants={pillVariant}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-[2px] rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF9F43] to-[#10B981] shadow-xl cursor-pointer"
                        >
                          {/* The Inner Dark Content */}
                          <div className="flex items-center gap-3 pl-2 pr-6 py-2 rounded-full bg-[#121212] transition-all h-full">
                            <div className="relative">
                              <Avatar className="h-10 w-10 border border-white/20">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=333&color=fff`} />
                                <AvatarFallback className="text-white bg-slate-800">U</AvatarFallback>
                              </Avatar>
                              {/* Pulsing Online Dot */}
                              <span className="absolute bottom-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-black"></span>
                          </span>
                            </div>

                            <div className="text-left">
                              <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                              <p className="text-[10px] font-medium text-white/50 mt-0.5 uppercase tracking-wide">Innovator</p>
                            </div>

                            <ChevronRight size={16} className="text-white/40" />
                          </div>
                        </motion.div>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-64 p-2 rounded-[24px] bg-[#1F1F1F]/95 backdrop-blur-3xl border-white/10 shadow-2xl mt-3 text-white animate-in zoom-in-95">
                        <DropdownMenuItem onClick={() => navigate('/student/dashboard')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                          <LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/student/profile')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white">
                          <User className="mr-3 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 font-bold cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400">
                          <LogOut className="mr-3 h-4 w-4" /> Log Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
              ) : (
                  // LOGGED OUT
                  <motion.div
                      variants={pillVariant}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                          "flex items-center p-1.5 rounded-full transition-all gap-1",
                          desktopPillStyle
                      )}
                  >
                    <Link to="/auth?mode=login">
                      <Button
                          variant="ghost"
                          className="rounded-full text-white/90 hover:text-white hover:bg-white/10 font-bold px-6 h-12 text-[15px] transition-colors"
                      >
                        Log In
                      </Button>
                    </Link>

                    <Link to="/auth?mode=signup">
                      <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="h-12 px-8 rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF9F43] to-[#10B981] text-white font-bold text-[15px] shadow-lg flex items-center gap-2 hover:shadow-orange-500/20"
                      >
                        Join Now
                        <ArrowRight size={16} className="text-white/90" />
                      </motion.button>
                    </Link>
                  </motion.div>
              )}
            </div>

            {/* MOBILE TOGGLE (WHITE GLASS) */}
            <motion.button
                variants={pillVariant}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                    "lg:hidden p-4 rounded-full z-50",
                    mobileToggleStyle
                )}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </motion.button>

          </div>
        </motion.header>

        {/* MOBILE DRAWER (LIGHT THEME) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <motion.div
                  variants={menuContainer}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-3xl overflow-hidden flex flex-col pt-32"
              >
                <div className="flex-1 overflow-y-auto px-6 pb-12 flex flex-col gap-3">
                  {navLinks.map((link, idx) => (
                      <motion.div key={link.path} variants={menuItem}>
                        <Link
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center justify-between p-6 rounded-[28px] text-xl font-bold tracking-tight transition-all border",
                                isActive(link.path)
                                    ? "bg-slate-100 border-slate-200 shadow-sm text-black scale-[1.02]"
                                    : "border-transparent text-slate-600 hover:text-black hover:bg-slate-50"
                            )}
                        >
                    <span className={cn(isActive(link.path) && "bg-gradient-to-r from-[#FF6B35] to-[#10B981] bg-clip-text text-transparent")}>
                      {link.name}
                    </span>
                          {isActive(link.path) && <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#10B981]" />}
                        </Link>
                      </motion.div>
                  ))}

                  <motion.div variants={menuItem} className="h-px bg-slate-200 my-6" />

                  {/* MOBILE AUTH */}
                  {isAuthenticated && user ? (
                      <motion.div variants={menuItem} className="space-y-4">
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 shadow-sm">
                          <Avatar className="h-14 w-14 border border-slate-200">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=000&color=fff`} />
                            <AvatarFallback className="text-white bg-slate-900">U</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 text-lg">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <Button onClick={() => { navigate('/student/dashboard'); setIsMobileMenuOpen(false); }} className="w-full h-16 bg-black text-white rounded-[24px] text-lg font-bold shadow-lg">
                          Dashboard
                        </Button>
                        <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full h-16 border-slate-200 text-red-600 rounded-[24px] text-lg font-bold bg-white">
                          Log Out
                        </Button>
                      </motion.div>
                  ) : (
                      <motion.div variants={menuItem} className="grid grid-cols-1 gap-4">
                        <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full h-16 rounded-[24px] bg-gradient-to-r from-[#FF6B35] to-[#10B981] text-white font-bold text-2xl shadow-lg">
                            Join Community
                          </Button>
                        </Link>

                        <Link to="/auth?mode=login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                              variant="outline"
                              className="w-full h-16 rounded-[24px] border-slate-200 font-bold text-2xl bg-slate-100 text-slate-900 hover:bg-slate-200 backdrop-blur-md"
                          >
                            Log In
                          </Button>
                        </Link>
                      </motion.div>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </>
  );
};

export default Header;