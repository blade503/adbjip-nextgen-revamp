import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Gérer son Bien', shortName: 'Gestion', href: '/services/gestion-locative' },
    { name: 'Gérer sa copropriété', shortName: 'Copropriété', href: '/services/gestion-copropriete' },
    { name: 'Trouver un bien', shortName: 'Trouver', href: '/services/achats-ventes' },
    { name: 'JIP et Moi', shortName: 'À propos', href: '/about' },
    { name: 'Contact', shortName: 'Contact', href: '/contact' },
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
        <nav className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex justify-between items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 lg:space-x-3 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant">
                <span className="text-primary-foreground font-bold text-lg lg:text-xl">JIP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold gradient-text">Jobard Immobilier Paris</h1>
                <p className="text-xs lg:text-sm text-muted-foreground">Excellence & Professionnalisme</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold gradient-text">JIP</h1>
              </div>
            </Link>

            {/* Desktop Navigation - Full text */}
            <div className="hidden xl:flex space-x-6 2xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-sm 2xl:text-base whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Medium Navigation - Short text */}
            <div className="hidden lg:flex xl:hidden space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.shortName}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-sm whitespace-nowrap"
                >
                  {item.shortName}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block flex-shrink-0">
              <Button variant="default" className="hover-glow text-sm lg:text-base px-3 lg:px-4 py-2" asChild>
                <Link to="/services/estimation-biens">
                  <span className="hidden xl:inline">Estimation Gratuite</span>
                  <span className="xl:hidden">Estimation</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
            >
              {isMenuOpen ? <X className="w-5 h-5 lg:w-6 lg:h-6" /> : <Menu className="w-5 h-5 lg:w-6 lg:h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 glass-strong border-b border-border/50 animate-slide-up z-50">
              <div className="container mx-auto px-4 lg:px-6 py-6">
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border/50">
                    <Button variant="default" className="w-full" asChild>
                      <Link to="/services/estimation-biens" onClick={() => setIsMenuOpen(false)}>
                        Estimation Gratuite
                      </Link>
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