import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>01.42.25.78.24</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>j.immo.p@orange.fr</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>27, Rue de Lisbonne 75008 Paris</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-border/50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant">
                <span className="text-primary-foreground font-bold text-xl">JIP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">JIP Immobilier</h1>
                <p className="text-sm text-muted-foreground">Excellence & Professionnalisme</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button variant="default" className="hover-glow">
                Estimation Gratuite
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 glass-strong border-b border-border/50 animate-slide-up">
              <div className="container mx-auto px-6 py-6">
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-border/50">
                    <Button variant="default" className="w-full">
                      Estimation Gratuite
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;