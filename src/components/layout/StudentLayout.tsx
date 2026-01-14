import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutGrid, Calendar, Trophy, Layers, Send,
    FileText, User, LogOut, Menu, Bell, Sparkles, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

const StudentLayout = () => {
    const { user, logout, isLoading } = useAuth(); // Ensure useAuth returns isLoading
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // 🔒 SECURITY CHECK: Redirect if not logged in
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
            </div>
        );
    }

    // If loading is done and there is no user, redirect to login
    if (!user) {
        return <Navigate to="/auth?mode=login" replace />;
    }

    const navItems = [
        { title: 'Overview', icon: LayoutGrid, path: '/student/dashboard' },
        { title: 'My Events', icon: Calendar, path: '/student/events' },
        { title: 'Hackathons', icon: Trophy, path: '/student/hackathons' },
        { title: 'Showcase', icon: Layers, path: '/student/showcase' },
        { title: 'Lens Studio', icon: Sparkles, path: '/student/lens' },
        { title: 'Surveys', icon: FileText, path: '/student/surveys' },
        { title: 'Profile', icon: User, path: '/student/profile' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-6 px-4">
            {/* Brand */}
            <div className="mb-10 px-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    B
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">
          Student<span className="text-[#FF6B35]">Panel</span>
        </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'bg-orange-50 text-[#FF6B35] font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 w-1 h-6 bg-[#FF6B35] rounded-r-full"
                                />
                            )}
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-[#FF6B35]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Logout */}
            <div className="mt-auto pt-6 border-t border-slate-100">
                <button
                    onClick={() => {
                        logout();
                        navigate('/auth?mode=login');
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* === DESKTOP SIDEBAR (FLOATING DOCK) === */}
            <aside className="hidden lg:block fixed left-4 top-4 bottom-4 w-72 bg-white rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden border border-slate-100/50">
                <SidebarContent />
            </aside>

            {/* === MAIN CONTENT AREA === */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-80 transition-all duration-300">

                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-bold">B</div>
                        <span className="font-bold text-slate-800">BharatXR</span>
                    </div>
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="w-6 h-6 text-slate-600" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Desktop Header (Profile & Notifs) */}
                <header className="hidden lg:flex items-center justify-end h-20 px-8 gap-6">
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-orange-50 hover:text-[#FF6B35] transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
                    </Button>
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                        <div className="text-right">
                            {/* ✅ PERSONALIZED USER DETAILS */}
                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role || "Student"}</p>
                        </div>
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer">
                            {/* ✅ Generates Avatar based on THEIR name */}
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=FF6B35&color=fff`} />
                            <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 pt-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;