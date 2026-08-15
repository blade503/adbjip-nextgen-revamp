import { Card } from '@/components/ui/card';
import gestionLocativeImage from '@/assets/GestionLocative.webp';
import gestionCoproImage from '@/assets/GestionDeCopropriete2.webp';
import estimationImage from '@/assets/EstimationBien.webp';
import achatVenteImage from '@/assets/VenteDeBiens.webp';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Calculator, 
  Handshake,
  ArrowRight,
  } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Gestion Locative",
      route: "/services/gestion-locative",
      image: gestionLocativeImage,
      // Illustration décorative : le titre juste à côté nomme déjà le service,
      // un texte alternatif ne ferait que le répéter aux lecteurs d'écran.
      alt: "",
      description: "Nous assurons la gestion de votre patrimoine. Les revenus c'est pour vous, la gestion c'est pour nous.",
      color: "bg-blue-500"
    },
    {
      icon: Building2,
      title: "Gestion de Copropriété",
      route: "/services/gestion-copropriete",
      image: gestionCoproImage,
      alt: "",
      description: "La pérennité au service de votre immeuble avec une gestion professionnelle et transparente.",
      color: "bg-green-500"
    },
    {
      icon: Calculator,
      title: "Estimation de Biens",
      route: "/services/estimation-biens",
      image: estimationImage,
      alt: "",
      description: "Projets, succession, transmission de patrimoine, nous estimons votre bien selon le juste prix du marché.",
      color: "bg-primary"
    },
    {
      icon: Handshake,
      title: "Achats/Ventes de Biens",
      route: "/services/achats-ventes",
      image: achatVenteImage,
      alt: "",
      description: "N'oubliez pas votre syndic pour la vente de votre bien ! Accompagnement de A à Z.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="gradient-text">Prestations</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Gérance, syndic, estimation et transaction : quatre métiers, une seule agence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="glass-strong hover-lift group overflow-hidden border-0 shadow-card"
              >
                {/* Illustration — la même que sur la page du service, pour que le
                    visiteur retrouve le repère visuel en arrivant. */}
                <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                  <img
                    src={service.image}
                    alt={service.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className={`absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl ${service.color} shadow-elegant`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="p-6">
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <Link
                  to={service.route}
                  className="inline-flex items-center text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
                >
                  En savoir plus
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;