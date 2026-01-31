import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, User, LogOut, Calendar, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/rafiki-house-logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/stays', label: 'Stays' },
  { href: '/services', label: 'Services' },
  { href: '/safaris', label: 'Safaris & Game Drives' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img
            src={logo}
            alt="Rafiki House Nanyuki"
            className="h-10 w-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
          <span className="font-display text-xl font-semibold text-navy hidden sm:block">
            Rafiki House Nanyuki
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="relative py-2"
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {link.label}
              </span>
              {isActive(link.href) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/bookings" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-4 w-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu - Sheet Drawer */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <img src={logo} alt="Rafiki House Nanyuki" className="h-8 w-auto" />
                <span className="font-display text-lg">Rafiki House Nanyuki</span>
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeSheet}
                  className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                    isActive(link.href) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-4" />
              
              {user ? (
                <>
                  <Link
                    to="/bookings"
                    onClick={closeSheet}
                    className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeSheet();
                    }}
                    className="flex items-center gap-3 text-lg font-medium py-3 px-4 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-left w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/login" onClick={closeSheet}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="lg" asChild>
                    <Link to="/signup" onClick={closeSheet}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}
