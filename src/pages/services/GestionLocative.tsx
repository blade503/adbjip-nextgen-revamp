import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, CheckCircle, ArrowRight, Phone, Euro, Clock, Shield, Star, Users, TrendingUp, Heart, Award, Coffee, MessageSquare, Calculator, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import gestionLocativeImage from '@/assets/GestionLocative.png';

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
      description: "Évaluation précise et conseils d'optimisation",
      icon: TrendingUp
    },
    {
      step: "2", 
      title: "Recherche de locataires",
      description: "Diffusion d'annonces et présélection des candidats",
      icon: Users
    },
    {
      step: "3",
      title: "Signature du bail",
      description: "Accompagnement juridique et administratif complet",
      icon: Shield
    },
    {
      step: "4",
      title: "Gestion au quotidien",
      description: "Suivi permanent et reporting mensuel détaillé",
      icon: Heart
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Propriétaire 16ème",
      content: "Depuis que JIP gère mon appartement, je dors sur mes deux oreilles ! Plus de stress, plus de tracas, juste mes loyers qui tombent chaque mois.",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Investisseur",
      content: "Une équipe réactive et professionnelle. Ils ont trouvé un locataire parfait en moins de 15 jours et gèrent tout impeccablement.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Propriétaire 8ème",
      content: "JIP a transformé mon investissement locatif en véritable source de revenus passifs. Je recommande vivement !",
      rating: 5
    }
  ];

  const stats = [
    { number: "98%", label: "Taux de satisfaction", icon: Star },
    { number: "15j", label: "Délai moyen de location", icon: Clock },
    { number: "500+", label: "Biens gérés", icon: Home },
    { number: "15ans", label: "D'expérience", icon: Award }
  ];

  const whyChooseUs = [
    {
      icon: Coffee,
      title: "Relation humaine",
      description: "Une équipe à votre écoute, disponible et bienveillante. Parce que l'immobilier, c'est avant tout une histoire de confiance."
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Assurance loyers impayés, vérifications approfondies des locataires, et suivi juridique permanent."
    },
    {
      icon: TrendingUp,
      title: "Rentabilité optimisée",
      description: "Nous maximisons vos revenus locatifs grâce à notre connaissance fine du marché parisien."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section - Plus émotionnel */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={gestionLocativeImage}
              alt="Gestion locative professionnelle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
          </div>
          
          {/* Floating elements for visual appeal */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6 animate-slide-up">
                <Home className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Gestion Locative</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up text-white">
                Vous gardez vos <span className="gradient-text">revenus</span>,<br />
                nous gérons <span className="gradient-text">tout le reste</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto animate-slide-up">
                Transformez votre investissement immobilier en véritable source de revenus passifs. 
                Notre équipe passionnée s'occupe de tout pendant que vous profitez de la vie ! ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Button size="lg" className="hover-glow group" asChild>
                  <Link to="/contact">
                    <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Découvrir nos services
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="glass border-primary/30" asChild>
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Nouveau */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Details - Amélioré */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Une gestion <span className="gradient-text">sur-mesure</span> qui vous ressemble
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Parce que chaque propriétaire est unique, nous adaptons nos services à vos besoins spécifiques. 
                Votre tranquillité d'esprit est notre priorité absolue.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="glass-strong rounded-2xl p-8 hover-lift">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elegant">
                      <Euro className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Tarifs transparents</h3>
                      <p className="text-primary font-medium">Seulement 8% HT des loyers encaissés</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Pas de frais cachés, pas de mauvaises surprises. Notre commission ne s'applique que sur les loyers effectivement perçus.
                  </p>
                </div>

                <div className="glass-strong rounded-2xl p-8 hover-lift">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-elegant">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Disponibilité totale</h3>
                      <p className="text-green-600 font-medium">7j/7 pour les urgences</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Notre équipe est là quand vous en avez besoin. Service client privilégié du lundi au vendredi, urgences 24h/24.
                  </p>
                </div>

                <div className="glass-strong rounded-2xl p-8 hover-lift">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center shadow-elegant">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Protection maximale</h3>
                      <p className="text-blue-600 font-medium">Assurance loyers impayés incluse</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Dormez tranquille ! Nous prenons en charge tous les risques locatifs pour que vous n'ayez aucun souci.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold mb-8">
                  Ce que nous faisons <span className="gradient-text">pour vous</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 glass rounded-xl hover-lift">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="font-medium">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Nouveau */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pourquoi nos clients nous <span className="gradient-text">adorent</span> ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Au-delà de la gestion immobilière, nous créons des relations durables basées sur la confiance et l'excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {whyChooseUs.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="glass-strong p-8 text-center hover-lift border-0 shadow-card group">
                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <Icon className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials - Nouveau */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ils nous font <span className="gradient-text">confiance</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Découvrez les témoignages de nos clients satisfaits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-strong p-8 hover-lift border-0 shadow-card">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process - Amélioré */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Notre <span className="gradient-text">méthode</span> en 4 étapes
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Un processus rodé et personnalisé pour une gestion locative sans stress
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="glass-strong p-8 text-center hover-lift border-0 shadow-card group relative">
                    {/* Connection line */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-primary"></div>
                    )}
                    
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-bold text-primary mb-2">ÉTAPE {step.step}</div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Plus engageant */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6 text-center">
            <div className="glass-strong rounded-3xl p-16 max-w-5xl mx-auto relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-elegant">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Prêt à transformer votre investissement ?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                  Rejoignez nos 500+ propriétaires satisfaits et découvrez ce que signifie vraiment 
                  "revenus passifs". Votre première consultation est gratuite ! 🎯
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button size="lg" className="hover-glow group px-8 py-4 text-lg" asChild>
                    <Link to="/contact">
                      <Phone className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                      Appelez-nous maintenant
                      <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="glass border-primary/30 px-8 py-4 text-lg" asChild>
                    <Link to="/contact">
                      <Coffee className="mr-3 w-6 h-6" />
                      Rencontrons-nous
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  ✨ Consultation gratuite • Sans engagement • Réponse sous 24h
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-3" asChild>
                  <Link to="/contact">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold">Demander un devis</div>
                      <div className="text-sm text-muted-foreground">Gestion locative</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-3" asChild>
                  <Link to="/services/estimation-biens">
                    <Calculator className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold">Estimation gratuite</div>
                      <div className="text-sm text-muted-foreground">Évaluez votre bien</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-3" asChild>
                  <a href="tel:0142257824">
                    <Phone className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold">Appel direct</div>
                      <div className="text-sm text-muted-foreground">01.42.25.78.24</div>
                    </div>
                  </a>
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