import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, CheckCircle, ArrowRight, Phone, Euro, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const GestionLocative = () => {
  const advantages = [
    "Recherche et sélection rigoureuse des locataires",
    "Encaissement automatique des loyers",
    "Gestion complète des travaux et entretien",
    "Suivi administratif et comptable",
    "État des lieux détaillés",
    "Gestion des assurances",
    "Révision annuelle des loyers",
    "Support juridique en cas de litige"
  ];

  const processSteps = [
    {
      step: "1",
      title: "Analyse de votre bien",
      description: "Évaluation précise et conseils d'optimisation"
    },
    {
      step: "2", 
      title: "Recherche de locataires",
      description: "Diffusion d'annonces et présélection des candidats"
    },
    {
      step: "3",
      title: "Signature du bail",
      description: "Accompagnement juridique et administratif complet"
    },
    {
      step: "4",
      title: "Gestion au quotidien",
      description: "Suivi permanent et reporting mensuel détaillé"
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
                <Home className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Gestion Locative</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Gestion <span className="gradient-text">Locative</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Nous assurons la gestion de votre patrimoine immobilier. Les revenus c'est pour vous, 
                la gestion c'est pour nous. Profitez de votre investissement en toute sérénité.
              </p>
              <Button size="lg" asChild className="hover-glow">
                <Link to="/contact">
                  Demander un devis gratuit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Details */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Une gestion <span className="gradient-text">complète</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Notre équipe d'experts s'occupe de tous les aspects de la gestion locative, 
                  de la recherche de locataires à l'encaissement des loyers, en passant par 
                  l'entretien et les travaux.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Euro className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Tarifs transparents</h3>
                      <p className="text-sm text-muted-foreground">Commission de 8% HT des loyers encaissés</p>
                    </div>
                  </div>
                </Card>
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Disponibilité</h3>
                      <p className="text-sm text-muted-foreground">Service client du lundi au vendredi</p>
                    </div>
                  </div>
                </Card>
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Garanties</h3>
                      <p className="text-sm text-muted-foreground">Assurance loyers impayés incluse</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Notre <span className="gradient-text">processus</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une méthode éprouvée pour une gestion locative efficace et sereine
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <Card key={index} className="glass-strong p-6 text-center hover-lift border-0 shadow-card">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à confier la gestion de votre bien ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contactez-nous pour un audit gratuit de votre patrimoine locatif
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

export default GestionLocative;