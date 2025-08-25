import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Calculator, 
  Handshake,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Gestion Locative",
      description: "Nous assurons la gestion de votre patrimoine. Les revenus c'est pour vous, la gestion c'est pour nous.",
      features: [
        "Recherche et sélection de locataires",
        "Encaissement des loyers",
        "Gestion des travaux et entretien",
        "Suivi administratif complet"
      ],
      color: "bg-blue-500"
    },
    {
      icon: Building2,
      title: "Gestion de Copropriété",
      description: "La pérennité au service de votre immeuble avec une gestion professionnelle et transparente.",
      features: [
        "Assemblées générales",
        "Gestion comptable",
        "Suivi des travaux",
        "Conseil juridique"
      ],
      color: "bg-green-500"
    },
    {
      icon: Calculator,
      title: "Estimation de Biens",
      description: "Projets, succession, transmission de patrimoine, nous estimons votre bien selon le juste prix du marché.",
      features: [
        "Analyse de marché approfondie",
        "Rapport détaillé gratuit",
        "Conseils personnalisés",
        "Estimation en 24h"
      ],
      color: "bg-primary"
    },
    {
      icon: Handshake,
      title: "Achats/Ventes de Biens",
      description: "N'oubliez pas votre syndic pour la vente de votre bien ! Accompagnement de A à Z.",
      features: [
        "Négociation optimisée",
        "Accompagnement juridique",
        "Réseau d'acquéreurs qualifiés",
        "Suivi jusqu'à la signature"
      ],
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-medium text-primary">Excellence & Expertise</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Nos <span className="gradient-text">Prestations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nous vous proposons de nombreuses prestations, que ce soit dans la location, l'achat, 
            la vente de bien. Une expertise complète pour tous vos projets immobiliers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="glass-strong p-8 hover-lift group border-0 shadow-card"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  className="group w-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <Link to={
                    service.title === "Gestion Locative" ? "/services/gestion-locative" :
                    service.title === "Gestion de Copropriété" ? "/services/gestion-copropriete" :
                    service.title === "Estimation de Biens" ? "/services/estimation-biens" :
                    "/services/achats-ventes"
                  }>
                    En savoir plus
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un conseil personnalisé ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nos experts sont à votre disposition pour étudier votre projet
            </p>
            <Button size="lg" className="hover-glow">
              Contactez-nous
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;