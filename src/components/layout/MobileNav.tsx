import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Utensils, Info, Compass, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/stays', label: 'Stays', icon: Building2 },
  { href: '/services', label: 'Services', icon: Utensils },
  { href: '/safaris', label: 'Safaris', icon: Compass },
  { href: '/reviews', label: 'Reviews', icon: Star },
];

export function MobileNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border md:hidden safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 rounded-lg transition-colors min-w-[56px] ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
