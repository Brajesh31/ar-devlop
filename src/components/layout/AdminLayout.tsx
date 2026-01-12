import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LogOut,
    Menu,
    ChevronRight,
    ChevronDown,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { adminNavigation, NavItem } from '@/data/adminNavigation';
import { motion, AnimatePresence } from 'framer-motion';

// --- Recursive Sidebar Item Component ---
const SidebarItem = ({ item, depth = 0, isOpen, currentPath }: { item: NavItem, depth?: number, isOpen: boolean, currentPath: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.items && item.items.length > 0;
    const isActive = item.url ? currentPath === item.url : false;

    useEffect(() => {
        if (hasChildren && item.items?.some(child => checkActive(child, currentPath))) {
            setIsExpanded(true);
        }
    }, [currentPath, hasChildren, item.items]);

    const checkActive = (nav: NavItem, path: string): boolean => {
        if (nav.url === path) return true;
        if (nav.items) return nav.items.some(child => checkActive(child, path));
        return false;
    };

    const Icon = item.icon;

    return (
        <div className="w-full">
            <div
                className={`
          flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg cursor-pointer transition-all duration-200 select-none
          ${isActive && !hasChildren ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
          ${depth > 0 ? 'ml-4 border-l border-slate-200 pl-4' : ''}
        `}
                onClick={() => {
                    if (hasChildren) setIsExpanded(!isExpanded);
                }}
            >
                {item.url && !hasChildren ? (
                    <Link to={item.url} className="flex-1 flex items-center gap-3">
                        {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B35]' : 'text-slate-400'}`} />}
                        <span className="text-sm">{item.title}</span>
                    </Link>
                ) : (
                    <div className="flex-1 flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                        <span className="text-sm font-medium">{item.title}</span>
                    </div>
                )}

                {hasChildren && (
                    <div className="text-slate-400">
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {item.items?.map((child, idx) => (
                            <SidebarItem
                                key={idx}
                                item={child}
                                depth={depth + 1}
                                isOpen={isOpen}
                                currentPath={currentPath}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Layout Component (Fixed Scroll) ---
const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Mock User
    const adminUser = { name: "Admin User", email: "admin@bharatxr.com" };

    const handleLogout = async () => {
        localStorage.removeItem('bharatxr_admin_user');
        toast({ title: "Logged Out", description: "See you next time." });
        navigate('/bharatxrpannelpanneladmin');
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex font-sans">

            {/* === SIDEBAR (Sticky) === */}
            {/* This sidebar stays pinned to the left while you scroll down */}
            <aside
                className={`
          flex-none bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 sticky top-0 h-screen
          ${sidebarOpen ? 'w-72' : 'w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden'}
        `}
            >
                {/* Header */}
                <div className="h-16 flex-none flex items-center px-6 border-b border-slate-100 bg-white">
                    <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-[#FF6B35]/20 mr-3">
                        B
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800 whitespace-nowrap">
            Bharat<span className="text-[#FF6B35]">XR</span>
          </span>
                </div>

                {/* Scrollable Nav Area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200">
                    {adminNavigation.map((item, idx) => (
                        <SidebarItem
                            key={idx}
                            item={item}
                            isOpen={sidebarOpen}
                            currentPath={location.pathname}
                        />
                    ))}
                    <div className="h-10"></div>
                </div>

                {/* User Footer */}
                <div className="flex-none p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white shadow-sm">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${adminUser.name}`} />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{adminUser.name}</p>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 ml-auto h-8 w-8">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* === MAIN CONTENT (Flows Naturally) === */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Header (Sticky) */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm/50">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Menu className="w-5 h-5 text-slate-600" />
                        </Button>

                        <div className="hidden md:flex items-center text-sm text-slate-500">
                            <span className="hover:text-slate-800 cursor-pointer">Admin</span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="font-medium text-slate-800 capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative text-slate-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                {/* Removed 'overflow-y-auto' so it uses the browser's main scrollbar */}
                <main className="flex-1 p-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;