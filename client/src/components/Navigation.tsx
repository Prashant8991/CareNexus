import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { 
  Home, 
  Camera, 
  Heart, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/skin-check', label: 'Skin Check', icon: Camera },
  { path: '/first-aid', label: 'First Aid', icon: Heart },
  { path: '/hospitals', label: 'Hospitals', icon: MapPin },
  { path: '/sos', label: 'SOS', icon: AlertTriangle },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50">
      {/* Gradient header background */}
      <div className="absolute inset-0 h-16 bg-gradient-to-r from-primary/15 via-chart-2/15 to-primary/10 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center shadow hover:shadow-md transition-all group-hover:scale-105">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg text-foreground tracking-tight">
              AI Health Companion
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 transition-transform hover:scale-[1.02] ${isActive ? 'shadow-sm' : ''}`}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              className="ml-2 hover:rotate-12 transition-transform"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle-mobile"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start space-x-2 hover:translate-x-1 transition-transform"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`nav-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}