import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Building, Users, TrendingUp, ArrowRight, Phone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const References = () => {
  const testimonials = [
    {
      name: "Marie Dupont",
      role: "Propriétaire, 16ème arrondissement",
      rating: 5,
      text: "Une gestion locative exemplaire depuis 3 ans. Réactivité, transparence et professionnalisme. Je recommande vivement leurs services.",
      property: "Appartement 3 pièces - Passy"
    },
    {
      name: "Jean-Pierre Martin",
      role: "Copropriétaire, 8ème arrondissement",
      rating: 5,
      text: "Excellent suivi de notre copropriété. Les assemblées générales sont parfaitement organisées et les comptes irréprochables.",
      property: "Immeuble haussmannien - 24 lots"
    },
    {
      name: "Sophie Lemaire",
      role: "Investisseur, 11ème arrondissement",
      rating: 5,
      text: "Accompagnement de qualité pour mon investissement locatif. Estimation précise et négociation efficace. Très satisfaite !",
      property: "Studio - République"
    },
    {
      name: "Pierre Dubois",
      role: "Propriétaire, 7ème arrondissement",
      rating: 5,
      text: "Service client remarquable. Toujours disponibles et de bon conseil. Cela fait 5 ans que je leur fais confiance.",
      property: "Duplex - Saint-Germain"
    }
  ];

  const projects = [
    {
      title: "Résidence Haussmann",
      location: "8ème arrondissement",
      type: "Gestion de Copropriété",
      details: "64 lots - Rénovation façade et parties communes",
      year: "2023",
      results: "Valorisation +15% - Économies charges -8%"
    },
    {
      title: "Immeuble Saint-Germain",
      location: "6ème arrondissement",
      type: "Gestion Locative Premium",
      details: "12 appartements de standing",
      year: "2022-2024",
      results: "Taux occupation 98% - Rentabilité optimisée"
    },
    {
      title: "Programme Investisseur",
      location: "11ème arrondissement",
      type: "Achat-Vente & Gestion",
      details: "Portefeuille de 8 studios",
      year: "2023",
      results: "ROI +12% - Délai vente réduit de 30%"
    }
  ];

  const stats = [
    { number: "500+", label: "Biens gérés", icon: Building },
    { number: "95%", label: "Clients satisfaits", icon: Star },
    { number: "25", label: "Ans d'expérience", icon: TrendingUp },
    { number: "1200+", label: "Transactions réalisées", icon: Users }
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
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Nos Références</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                La satisfaction <span className="gradient-text">client</span> avant tout
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Découvrez les témoignages de nos clients et les projets que nous avons menés 
                avec succès depuis plus de 25 ans dans l'immobilier parisien.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="glass-strong p-6 text-center border-0 shadow-card">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Ce que disent nos <span className="gradient-text">clients</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Leurs témoignages sont notre plus belle récompense
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-strong p-8 border-0 shadow-card">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div className="border-t border-muted pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{testimonial.property}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Projets <span className="gradient-text">réalisés</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Quelques exemples de nos réussites récentes
              </p>
            </div>
            <div className="space-y-8">
              {projects.map((project, index) => (
                <Card key={index} className="glass-strong p-8 hover-lift border-0 shadow-card">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-primary font-semibold mb-2">{project.location}</p>
                      <p className="text-sm text-muted-foreground">{project.details}</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{project.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Année : {project.year}</p>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-green-600 font-semibold">{project.results}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Notre engagement <span className="gradient-text">qualité</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Des processus rigoureux pour garantir votre satisfaction
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">Suivi Personnalisé</h3>
                  <p className="text-sm text-muted-foreground">
                    Un interlocuteur dédié pour chaque client et un suivi régulier de vos dossiers
                  </p>
                </Card>
                
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">Qualité Contrôlée</h3>
                  <p className="text-sm text-muted-foreground">
                    Processus qualité certifié et évaluation continue de nos prestations
                  </p>
                </Card>
                
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">Amélioration Continue</h3>
                  <p className="text-sm text-muted-foreground">
                    Innovation constante et adaptation aux évolutions du marché
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Rejoignez nos clients satisfaits
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Découvrez pourquoi plus de 500 clients nous font confiance pour leur patrimoine immobilier
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">
                    En savoir plus sur nous
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

export default References;