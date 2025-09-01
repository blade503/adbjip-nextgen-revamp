import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Handshake, Building, Scale, Calculator, Users, ArrowRight, Phone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Partners = () => {
  const partnerTypes = [
    {
      icon: Scale,
      title: "Partenaires Juridiques",
      description: "Notaires, avocats spécialisés en droit immobilier et experts-comptables pour sécuriser vos transactions."
    },
    {
      icon: Building,
      title: "Professionnels du Bâtiment",
      description: "Artisans qualifiés, architectes et entreprises de rénovation pour valoriser vos biens."
    },
    {
      icon: Calculator,
      title: "Services Financiers",
      description: "Courtiers en crédit immobilier et conseillers financiers pour optimiser vos investissements."
    },
    {
      icon: FileText,
      title: "Services Techniques",
      description: "Diagnostiqueurs, experts en assurance et syndics professionnels certifiés."
    }
  ];

  const benefits = [
    {
      title: "Réseau de confiance",
      description: "Des partenaires sélectionnés pour leur expertise et leur professionnalisme reconnus."
    },
    {
      title: "Tarifs négociés",
      description: "Des conditions préférentielles obtenues grâce à notre volume d'affaires."
    },
    {
      title: "Réactivité garantie",
      description: "Des interventions prioritaires et des délais d'exécution optimisés."
    },
    {
      title: "Qualité contrôlée",
      description: "Un suivi rigoureux de la qualité des prestations de nos partenaires."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
                <Handshake className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Nos Partenaires</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Un réseau de <span className="gradient-text">partenaires</span> d'exception
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Nous collaborons avec un réseau de professionnels qualifiés pour vous offrir 
                un service complet et des solutions adaptées à tous vos besoins immobiliers.
              </p>
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Nos <span className="gradient-text">domaines</span> d'expertise
              </h2>
              <p className="text-lg text-muted-foreground">
                Un écosystème complet de professionnels à votre service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partnerTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card key={index} className="glass-strong p-8 hover-lift border-0 shadow-card">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                        <p className="text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Les <span className="gradient-text">avantages</span> de notre réseau
              </h2>
              <p className="text-lg text-muted-foreground">
                Bénéficiez de notre pouvoir de négociation et de notre expérience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Services <span className="gradient-text">partenaires</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Des prestations complémentaires pour tous vos projets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glass-strong p-6 border-0 shadow-card">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-center">Conseil Juridique</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Rédaction de baux commerciaux et d'habitation</li>
                  <li>• Contentieux locatifs et recouvrement</li>
                  <li>• Conseils en droit de la copropriété</li>
                  <li>• Optimisation fiscale immobilière</li>
                </ul>
              </Card>

              <Card className="glass-strong p-6 border-0 shadow-card">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-center">Travaux & Rénovation</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Home staging et mise en valeur</li>
                  <li>• Rénovation complète d'appartements</li>
                  <li>• Travaux de copropriété</li>
                  <li>• Diagnostics techniques obligatoires</li>
                </ul>
              </Card>

              <Card className="glass-strong p-6 border-0 shadow-card">
                <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-center">Financement</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Courtage en crédit immobilier</li>
                  <li>• Montage de dossiers de financement</li>
                  <li>• Renégociation de prêts existants</li>
                  <li>• Conseil en investissement locatif</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Partnership Process */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Comment nous <span className="gradient-text">collaborons</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Un processus simple et efficace pour vos projets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Analyse</h3>
                <p className="text-sm text-muted-foreground">Évaluation de vos besoins spécifiques</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Sélection</h3>
                <p className="text-sm text-muted-foreground">Mise en relation avec le bon partenaire</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Coordination</h3>
                <p className="text-sm text-muted-foreground">Suivi et coordination des interventions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Livraison</h3>
                <p className="text-sm text-muted-foreground">Réception et validation des prestations</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Besoin d'un service spécialisé ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Faites appel à notre réseau de partenaires qualifiés pour tous vos projets immobiliers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">
                    Demander un devis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;