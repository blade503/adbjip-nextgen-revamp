import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';
import { HORAIRES } from '@/config/legal';
import { Link } from 'react-router-dom';
import LogoJIP from '@/components/LogoJIP';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Les six entrées précédentes pointaient toutes vers la gestion locative, et
  // deux d'entre elles — « Conseil Immobilier », « Syndic de Copropriété » — ne
  // correspondaient à aucune page. Quatre services, quatre destinations.
  const services = [
    { name: "Gestion locative", href: "/services/gestion-locative" },
    { name: "Gestion de copropriété", href: "/services/gestion-copropriete" },
    { name: "Estimation de biens", href: "/services/estimation-biens" },
    { name: "Achats et ventes", href: "/services/achats-ventes" }
  ];

  // Le pied de page est le seul endroit qui garantit qu'aucune page n'est
  // orpheline : /equipe n'était atteignable que par un bouton en milieu de
  // page, et /partenaires par aucun lien du tout.
  const quickLinks = [
    { name: "Accueil", href: "/" },
    { name: "Nos biens", href: "/biens" },
    { name: "À propos", href: "/about" },
    { name: "Notre équipe", href: "/equipe" },
    { name: "Nos partenaires", href: "/partenaires" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <LogoJIP className="h-11 w-auto" />
              <div>
                <p className="text-xl font-bold">JIP</p>
                <p className="text-sm opacity-80">Excellence & Professionnalisme</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Gestion locative et syndic de copropriété à Paris 8ᵉ depuis 2011.
              Un interlocuteur unique pour votre bien ou votre immeuble.
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
                <li key={service.href}>
                  <Link
                    to={service.href}
                    className="text-sm opacity-80 transition-all duration-300 hover:text-primary hover:opacity-100"
                  >
                    {service.name}
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
                {/* Pas d'horaires ici : le bloc « Horaires d'ouverture » plus
                    bas les donne déjà, dans la même colonne. */}
                <div>
                  <p className="text-sm font-medium">01.42.25.78.24</p>
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
                  {HORAIRES.samedi && (
                    <p className="text-xs opacity-80">Samedi : {HORAIRES.samedi.toLowerCase()}</p>
                  )}
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
              <span className="mx-2 hidden opacity-50 sm:inline">·</span>
              <span className="block sm:inline">
                Réalisation{' '}
                <a
                  href="https://www.linkedin.com/in/alexandre-wetzler/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-transparent transition-all duration-300 hover:text-primary hover:decoration-current"
                >
                  Alexandre Wetzler
                </a>
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link to="/mentions-legales" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300">
                Mentions Légales
              </Link>
              <Link to="/mentions-legales#donnees-personnelles" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-300">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;