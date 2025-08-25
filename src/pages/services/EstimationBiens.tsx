import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, CheckCircle, ArrowRight, Phone, TrendingUp, Clock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const EstimationBiens = () => {
  const criteria = [
    "Analyse comparative du marché local",
    "Étude des transactions récentes",
    "Évaluation de l'état général du bien",
    "Prise en compte des spécificités du quartier",
    "Analyse des travaux à prévoir",
    "Étude de la rentabilité locative",
    "Conseils d'optimisation de la valeur",
    "Rapport détaillé et argumenté"
  ];

  const types = [
    {
      icon: TrendingUp,
      title: "Vente",
      description: "Estimation précise pour optimiser votre prix de vente et réduire le délai de commercialisation."
    },
    {
      icon: FileText,
      title: "Succession",
      description: "Évaluation officielle pour les déclarations fiscales et partages successoraux."
    },
    {
      icon: Calculator,
      title: "Patrimoine",
      description: "Bilan patrimonial complet pour vos projets d'investissement et de transmission."
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
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Estimation de Biens</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Estimation de <span className="gradient-text">Biens</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Projets, succession, transmission de patrimoine : nous estimons votre bien selon le juste prix du marché. 
                Une expertise reconnue pour une évaluation précise et argumentée.
              </p>
              <Button size="lg" asChild className="hover-glow">
                <Link to="/contact">
                  Demander une estimation gratuite
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Une méthode <span className="gradient-text">rigoureuse</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Notre expertise du marché parisien nous permet de vous fournir une estimation 
                  précise et réaliste. Nous analysons tous les critères déterminants pour établir 
                  la juste valeur de votre bien immobilier.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {criteria.map((criterion, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Card className="glass-strong p-8 border-0 shadow-card">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Estimation en 24h</h3>
                    <p className="text-muted-foreground mb-6">
                      Recevez votre rapport d'estimation détaillé dans les 24 heures suivant notre visite
                    </p>
                    <div className="bg-primary/10 rounded-lg p-4">
                      <p className="text-sm font-medium text-primary">100% Gratuit & Sans Engagement</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Estimations */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Types d'<span className="gradient-text">estimation</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Selon votre projet, nous adaptons notre approche d'évaluation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {types.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card key={index} className="glass-strong p-8 text-center hover-lift border-0 shadow-card">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{type.title}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Comment ça <span className="gradient-text">fonctionne</span> ?
              </h2>
              <p className="text-lg text-muted-foreground">
                Un processus simple et transparent
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-sm text-muted-foreground">Prise de rendez-vous gratuit</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Visite</h3>
                <p className="text-sm text-muted-foreground">Analyse complète de votre bien</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Analyse</h3>
                <p className="text-sm text-muted-foreground">Étude comparative du marché</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Rapport</h3>
                <p className="text-sm text-muted-foreground">Remise du rapport détaillé</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Connaître la valeur de votre bien ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Bénéficiez gratuitement de notre expertise pour une estimation précise et réaliste
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
                    Demander une estimation
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

export default EstimationBiens;