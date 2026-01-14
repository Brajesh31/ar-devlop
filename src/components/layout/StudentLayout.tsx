import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, CalendarRange, Trophy, Layers,
    FileSignature, UserCircle, LogOut, Menu, BellRing, Sparkles, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

const StudentLayout = () => {
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // 🔒 Security Check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth?mode=login" replace />;
    }

    const navItems = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
        { title: 'My Events', icon: CalendarRange, path: '/student/events' },
        { title: 'Hackathons', icon: Trophy, path: '/student/hackathons' },
        { title: 'Showcase', icon: Layers, path: '/student/showcase' },
        { title: 'Lens Studio', icon: Sparkles, path: '/student/lens' },
        { title: 'Surveys', icon: FileSignature, path: '/student/surveys' },
        { title: 'Profile', icon: UserCircle, path: '/student/profile' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-6 px-4 bg-white border-r border-slate-100">
            {/* Brand */}
            <div className="mb-10 px-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8F50] flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-xl">
                    B
                </div>
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                        Bharat<span className="text-[#FF6B35]">XR</span>
                    </h2>
                    <span className="text-[10px] font-semibold text-green-600 uppercase tracking-widest mt-1">Student Panel</span>
                </div>
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
                            className="relative group block"
                        >
                            <div className={`
                relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive
                                ? 'bg-orange-50/50 text-[#FF6B35] font-medium'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }
              `}>
                                {/* Active Indicator (Green Strip for Balance) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-500 rounded-r-full"
                                    />
                                )}

                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FF6B35]' : 'text-slate-400 group-hover:text-green-600'}`} />
                                <span className="text-sm">{item.title}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* User Mini Profile (Bottom) */}
            <div className="mt-auto pt-6 border-t border-slate-100">
                <button
                    onClick={() => { logout(); navigate('/auth?mode=login'); }}
                    className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-orange-100 selection:text-orange-900">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-72 z-50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <SidebarContent />
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">

                {/* Modern Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-20 flex items-center justify-between lg:justify-end">
                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-bold">B</div>
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="w-6 h-6 text-slate-700" /></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 border-none"><SidebarContent /></SheetContent>
                        </Sheet>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Notification with Green Dot */}
                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors rounded-full">
                            <BellRing className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"></span>
                        </Button>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 h-10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">{user.role || "Student"}</p>
                            </div>
                            <Avatar className="h-10 w-10 ring-2 ring-white shadow-md cursor-pointer hover:scale-105 transition-transform">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=FF6B35&color=fff&bold=true`} />
                                <AvatarFallback className="bg-orange-50 text-[#FF6B35]">ST</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 p-6 lg:p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;