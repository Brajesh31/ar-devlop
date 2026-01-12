import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Resources', href: '/resources' },
  { label: 'Partner', href: '/partner' },
  { label: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // --- MOCK AUTH STATE (Change to 'true' to see Logged In View) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
      <header
          className={cn(
              "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
              scrolled ? "py-2" : "py-3"
          )}
      >
        {/* Expanded container max-width and adjusted padding to push elements to edges */}
        <div className="w-full px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between relative">

            {/* --- 1. Logo (Increased Size & Pushed Left) --- */}
            <div className="flex items-center justify-start shrink-0 z-50">
              <Link
                  to="/"
                  className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 hover:bg-black/60 transition-all"
              >
                <img
                    src="/Bharatxr.png"
                    alt="Bharat XR"
                    // UPDATED: h-10 (mobile) -> md:h-14 (laptop, ~30% bigger)
                    className="h-10 w-auto object-contain md:h-14"
                />
              </Link>
            </div>

            {/* --- 2. Center Oval Navigation Box (Desktop) --- */}
            <nav className={cn(
                "hidden lg:flex items-center justify-center gap-1",
                "absolute left-1/2 -translate-x-1/2",
                "rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2 shadow-lg",
                "h-14"
            )}>
              {navItems.map((item) => (
                  <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                          'flex items-center px-4 h-full text-base font-medium rounded-full transition-all duration-200',
                          isActive(item.href)
                              ? 'text-white bg-white/15 shadow-sm'
                              : 'text-white/80 hover:text-white hover:bg-white/5'
                      )}
                  >
                    {item.label}
                  </Link>
              ))}
            </nav>

            {/* --- 3. Auth Section (Right Side) --- */}
            <div className="hidden lg:flex items-center justify-end z-50 shrink-0">

              {isLoggedIn ? (
                  // --- LOGGED IN STATE: Dashboard + Avatar ---
                  <div className="flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-1.5 pl-6 pr-2">
                    <Link to="/dashboard">
                      <Button variant="ghost" className="text-white hover:text-accent hover:bg-transparent font-medium text-base p-0 mr-2">
                        Dashboard
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer border-2 border-accent hover:opacity-90 transition-opacity">
                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-black/95 border-white/10 text-white" align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="focus:bg-white/10 cursor-pointer text-red-400 focus:text-red-400"
                            onClick={() => setIsLoggedIn(false)}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
              ) : (
                  // --- LOGGED OUT STATE: Single Oval (Half Black / Half Orange) ---
                  <div className="flex items-center bg-black/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-lg">
                    <Link to="/login">
                      <Button
                          variant="ghost"
                          className="rounded-full text-white hover:bg-white/10 hover:text-white px-6 h-10 text-base font-medium"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button
                          className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-10 text-base font-bold ml-1 shadow-md shadow-accent/20"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
              )}
            </div>

            {/* --- Mobile Menu Trigger --- */}
            <div className="lg:hidden z-50">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                      variant="ghost"
                      size="icon"
                      className="text-white h-12 w-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/95 border-white/10 text-white">
                  <SheetHeader className="text-left border-b border-white/10 pb-6 mb-6">
                    <SheetTitle className="text-white">
                      <img
                          src="/Bharatxr.png"
                          alt="Bharat XR"
                          className="h-8 w-auto"
                      />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'block px-4 py-3 text-lg font-medium rounded-lg transition-colors',
                                isActive(item.href)
                                    ? 'bg-accent/20 text-accent'
                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                            )}
                        >
                          {item.label}
                        </Link>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                    {isLoggedIn ? (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-bold">
                            Go to Dashboard
                          </Button>
                        </Link>
                    ) : (
                        <>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent h-12 text-base">
                              Login
                            </Button>
                          </Link>
                          <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-bold">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </header>
  );
};