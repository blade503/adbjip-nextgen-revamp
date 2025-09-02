import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, CheckCircle, ArrowRight, Phone, TrendingUp, Clock, FileText, Home, MapPin, Euro, Send, Star, Award, Users, MessageSquare, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import estimationBienImage from '@/assets/EstimationBien.png';

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
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={estimationBienImage}
              alt="Estimation de biens immobiliers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6">
                <Calculator className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Estimation de Biens</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Connaissez la <span className="gradient-text">vraie valeur</span> de votre bien
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Estimation gratuite et sans engagement par nos experts. 
                Une évaluation précise basée sur l'analyse du marché parisien et notre expertise de 15 ans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="#estimation-form">
                    <Calculator className="mr-2 w-5 h-5" />
                    Estimation gratuite
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="glass border-primary/30">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                  <Award className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Années d'expérience</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                  <Calculator className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">2000+</div>
                <div className="text-sm text-muted-foreground">Biens estimés</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Clients satisfaits</div>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Délai de réponse</div>
              </div>
            </div>
          </div>
        </section>

        {/* Estimation Form */}
        <section id="estimation-form" className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Demandez votre <span className="gradient-text">estimation gratuite</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Remplissez ce formulaire et recevez une estimation personnalisée de votre bien 
                dans les 24 heures par nos experts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="space-y-6">
                <Card className="glass-strong p-8 border-0 shadow-elegant">
                  <h3 className="text-2xl font-bold mb-6">Informations sur votre bien</h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          Prénom *
                        </label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Votre prénom"
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Nom *
                        </label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Votre nom"
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Téléphone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01.42.25.78.24"
                          className="glass border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-2">
                        Adresse du bien *
                      </label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Ex: 15 rue de Rivoli, 75001 Paris"
                        className="glass border-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-2">
                          Type de bien *
                        </label>
                        <select
                          id="type"
                          className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
                          required
                        >
                          <option value="">Sélectionnez</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="studio">Studio</option>
                          <option value="duplex">Duplex</option>
                          <option value="loft">Loft</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="surface" className="block text-sm font-medium mb-2">
                          Surface (m²) *
                        </label>
                        <Input
                          id="surface"
                          type="number"
                          placeholder="Ex: 75"
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="rooms" className="block text-sm font-medium mb-2">
                          Pièces *
                        </label>
                        <Input
                          id="rooms"
                          type="number"
                          placeholder="Ex: 3"
                          className="glass border-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium mb-2">
                        Objectif de l'estimation *
                      </label>
                      <select
                        id="purpose"
                        className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="vente">Vente</option>
                        <option value="succession">Succession</option>
                        <option value="patrimoine">Patrimoine</option>
                        <option value="investissement">Investissement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Informations complémentaires
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez les spécificités de votre bien (étage, exposition, travaux récents, etc.)"
                        rows={4}
                        className="glass border-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-primary hover:bg-primary-glow text-primary-foreground hover-glow group"
                    >
                      <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Demander mon estimation gratuite
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Benefits */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Pourquoi choisir JIP ?</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Expertise reconnue</h4>
                        <p className="text-sm text-muted-foreground">
                          15 ans d'expérience sur le marché parisien
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Rapidité</h4>
                        <p className="text-sm text-muted-foreground">
                          Estimation détaillée sous 24h
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Euro className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">100% Gratuit</h4>
                        <p className="text-sm text-muted-foreground">
                          Aucun frais, aucun engagement
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Rapport détaillé</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyse complète avec justifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="glass-strong p-6 border-0 shadow-elegant">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Besoin d'aide ?</h4>
                    <p className="text-muted-foreground mb-4">
                      Nos experts sont disponibles pour vous accompagner
                    </p>
                    <Button variant="outline" className="w-full glass border-primary/30">
                      <Phone className="mr-2 w-4 h-4" />
                      01.42.25.78.24
                    </Button>
                  </div>
                </Card>
              </div>
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
                  <Link to="#estimation-form">
                    Demander une estimation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
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
                      <div className="text-sm text-muted-foreground">Estimation personnalisée</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-3" asChild>
                  <Link to="/services/gestion-locative">
                    <Building className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <div className="font-semibold">Gestion locative</div>
                      <div className="text-sm text-muted-foreground">Faites gérer votre bien</div>
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

export default EstimationBiens;