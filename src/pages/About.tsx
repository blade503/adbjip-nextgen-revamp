import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, Users, Award, Target, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Building2,
      title: "Excellence",
      description: "Une expertise reconnue dans la gestion immobilière parisienne depuis de nombreuses années."
    },
    {
      icon: Users,
      title: "Proximité",
      description: "Un accompagnement personnalisé et une relation de confiance avec nos clients."
    },
    {
      icon: Award,
      title: "Transparence",
      description: "Une gestion rigoureuse et transparente de votre patrimoine immobilier."
    },
    {
      icon: Target,
      title: "Efficacité",
      description: "Des solutions adaptées et des résultats mesurables pour valoriser vos biens."
    }
  ];

  const stats = [
    { number: "25+", label: "Années d'expérience" },
    { number: "500+", label: "Biens gérés" },
    { number: "98%", label: "Clients satisfaits" },
    { number: "15", label: "Collaborateurs" }
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
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">À propos de nous</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Notre <span className="gradient-text">expertise</span> à votre service
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Depuis plus de 25 ans, nous accompagnons propriétaires et investisseurs 
                dans la gestion et la valorisation de leur patrimoine immobilier parisien.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Une histoire de <span className="gradient-text">confiance</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Fondée par des professionnels passionnés de l'immobilier parisien, 
                  notre société s'est développée autour de valeurs fortes : l'excellence du service, 
                  la proximité client et la transparence dans nos relations.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Aujourd'hui, nous gérons un portefeuille de plus de 500 biens et accompagnons 
                  nos clients dans tous leurs projets immobiliers, de la gestion locative à 
                  l'administration de copropriété, en passant par l'achat-vente et l'estimation.
                </p>
                <Button asChild className="hover-glow">
                  <Link to="/contact">
                    Nous contacter
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-6">
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Notre mission</h3>
                  <p className="text-muted-foreground">
                    Simplifier et optimiser la gestion de votre patrimoine immobilier 
                    grâce à notre expertise locale et notre approche personnalisée.
                  </p>
                </Card>
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Notre vision</h3>
                  <p className="text-muted-foreground">
                    Être le partenaire de référence pour la gestion immobilière à Paris, 
                    reconnu pour notre professionnalisme et notre innovation.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Nos <span className="gradient-text">valeurs</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Les piliers qui guident notre action quotidienne
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="glass-strong p-6 text-center hover-lift border-0 shadow-card">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Nos <span className="gradient-text">chiffres clés</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                La confiance se mesure aussi en chiffres
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à nous faire confiance ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Découvrez comment notre expertise peut valoriser votre patrimoine
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/equipe">
                    Rencontrer l'équipe
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

export default About;