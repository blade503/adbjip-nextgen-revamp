import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { HORAIRES } from '@/config/legal';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "Gestion Locative",
    "Gestion de Copropriété", 
    "Estimation de Biens",
    "Achats/Ventes",
    "Conseil Immobilier",
    "Syndic de Copropriété"
  ];

  const quickLinks = [
    { name: "Accueil", href: "/" },
    { name: "Services", href: "/services/gestion-locative" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Estimation Gratuite", href: "/services/estimation-biens#calculateur-rapide" },
    { name: "Mentions Légales", href: "/mentions-legales" }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">JIP</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">JIP</h3>
                <p className="text-sm opacity-80">Excellence & Professionnalisme</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Votre partenaire immobilier de confiance à Paris depuis plus de 15 ans. 
              Nous vous accompagnons dans tous vos projets avec expertise et passion.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="w-4 h-4 text-primary" />
              <span>Fait avec passion à Paris</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nos Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    to="/services/gestion-locative" 
                    className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liens Utiles</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href === '#' ? (
                    <a 
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">01.42.25.78.24</p>
                  <p className="text-xs opacity-80">{HORAIRES.semaine}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">j.immo.p@orange.fr</p>
                  <p className="text-xs opacity-80">Réponse sous 24h</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">27, Rue de Lisbonne</p>
                  <p className="text-xs opacity-80">75008 Paris</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Horaires d'ouverture</p>
                  <p className="text-xs opacity-80">{HORAIRES.semaine}</p>
                  <p className="text-xs opacity-80">Samedi : {HORAIRES.samedi.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80 text-center md:text-left">
              © {currentYear} JIP. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/mentions-legales" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300">
                Mentions Légales
              </Link>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300">
                Politique de Confidentialité
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;