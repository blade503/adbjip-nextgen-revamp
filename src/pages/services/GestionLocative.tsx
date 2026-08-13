import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimizedImage from '@/components/SEOOptimizedImage';
import SEOHead from '@/components/SEOHead';
import { Home, CheckCircle, ArrowRight, Phone, Euro, Clock, Shield, Star, Users, TrendingUp, Heart, Award, Coffee, MessageSquare, Calculator, Building, FileText, Settings, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import gestionLocativeImage from '@/assets/GestionLocative.webp';

const GestionLocative = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Gestion Locative Paris 8ème",
    "description": "Service complet de gestion locative à Paris. Encaissement des loyers, sélection de locataires, suivi administratif et juridique.",
    "provider": {
      "@type": "RealEstateAgent",
      "name": "JIP",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Paris",
        "addressRegion": "Île-de-France",
        "postalCode": "75008",
        "addressCountry": "FR"
      }
    },
    "serviceType": "Gestion Locative",
    "areaServed": "Paris",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "description": "8% HT des loyers encaissés"
    }
  };
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

  // Aucun chiffre de performance tant que l'agence ne les a pas fournis :
  // taux de satisfaction, délai moyen et volume géré étaient inventés.
  const stats = [
    { number: "2011", label: "Agence créée en", icon: Award },
    { number: "Paris 8ᵉ", label: "27, rue de Lisbonne", icon: Home },
    { number: "24h", label: "Délai de réponse", icon: Clock },
    { number: "2", label: "Mandats au choix", icon: Star }
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
      <SEOHead 
        title="Gestion Locative Paris 8ème | JIP - Service Complet & Professionnel"
        description="Gestion locative professionnelle à Paris 8ème. Encaissement loyers, sélection locataires, suivi juridique. 8% HT seulement. Devis gratuit !"
        keywords="gestion locative paris, syndic paris 8ème, encaissement loyers, sélection locataires, gestion bien locatif"
        canonicalUrl="https://www.adbjip.fr/services/gestion-locative"
        structuredData={structuredData}
      />
      <Header />
      <main role="main">
        {/* Hero Section - Plus émotionnel */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <SEOOptimizedImage 
              src={gestionLocativeImage}
              alt="Gestion locative professionnelle à Paris 8ème - Service complet de gestion immobilière"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              loading="eager"
              fetchpriority="high"
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
                <Button 
                  size="lg" 
                  className="hover-glow group"
                  onClick={() => document.getElementById('mandats-gestion')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Découvrir nos services
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
        <section className="py-16 bg-gray-50">
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

        <section id="mandats-gestion" className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Nos <span className="gradient-text">mandats</span> de gestion
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choisissez le mandat qui correspond le mieux à vos besoins. 
                Du service essentiel au suivi complet, nous nous adaptons à votre situation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Mandat Sérénité */}
              <Card className="glass-strong p-8 hover-lift border-0 shadow-card">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-blue-600">Mandat Sérénité</h3>
                  <p className="text-muted-foreground">
                    Gestion administrative complète de votre bien
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Gestion Administrative du bien</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Recherche du locataire / étude de solvabilité</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Rédaction, renouvellement, actualisation des loyers</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">États des lieux</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Résiliation du bail</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Contrôle et validation des assurances obligatoires pour le locataire</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Rédaction des avenants (baux commerciaux)</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Revalorisation du loyer en fonction de l'indice de référence des loyers et des facteurs économiques</span>
                    </div>
                    </div>
              </Card>

              {/* Mandat Dynamique */}
              <Card className="glass-strong p-8 hover-lift border-0 shadow-card border-2 border-primary/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-primary">Mandat Dynamique</h3>
                  <p className="text-muted-foreground">
                    Des options complémentaires pour une location sécuritaire
                  </p>
                  <div className="mt-4 inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    <span>Options personnalisables</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Services de base du mandat dynamique */}
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Réalisation de l'état des lieux d'entrée et de sortie des locataires à l'amiable avec reportage photos</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Gestion des congés des locataires: conformité du congé, régularisation des charges, restitution du dépôt de garantie</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Participation aux assemblées générales des copropriétaires, rapport sur le Procès Verbal</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">En cas de litige concernant le bien, présence et représentation de votre voix devant les administrations et organisations publiques ou privées</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">En cas de sinistre, démarches auprès des assurances et du locataire, gestion de l'indemnité d'assurance</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Demande de travaux entretien du locataire ou entreprise sous contrat, étude comparative</span>
                </div>
              </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Après accord de votre part, suivi de l'exécution de tous les travaux entretiens ou indispensables, et règlement des factures associées</span>
                    </div>
                      </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm">Proposition d'une solution très revalorisante pour améliorer l'état de votre bien et faciliter sa relocation</span>
                    </div>
                  </div>

                  {/* Accordéon pour les options complémentaires */}
                  <div className="mt-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="options-complementaires" className="border border-primary/20 rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                          <div className="flex items-center space-x-2">
                            <Plus className="w-5 h-5 text-primary" />
                            <span className="text-lg font-semibold text-primary">Options complémentaires</span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium ml-2">8 options</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4 pt-2">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Constitution et suivi des dossiers de demandes de subventions ou de crédits</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Demande d'établissement des diagnostics obligatoires ainsi que des documents indispensables à l'information du locataire dans le cadre du Dossier de Diagnostic Technique</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Appels des loyers, encaissement des loyers, charges, dépôt de garantie, cautionnements, indemnité d'occupation, assurances, provisions, subventions, avances sur travaux</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Règlement des charges de copropriétés, auprès du syndic ou ensemble des chargés d'immeubles</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">En cas de conflit ou de défaut de paiement du locataire, intervention pour toutes les poursuites judiciaires et envois aux locataires des commandements, sommations, assignation devant les tribunaux</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Établissement de la déclaration de revenus fonciers</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">Établissement de la déclaration de TVA</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-sm">L'ensemble des frais de gestion locative sont déductibles de vos revenus fonciers</span>
                                <div className="inline-block ml-2">
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Option</span>
                </div>
              </div>
            </div>
          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
            </div>
                    </div>
                  </Card>
            </div>


          </div>
        </section>

        {/* Process - Amélioré */}
        <section className="py-20 bg-gray-50">
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
        <section className="py-20 bg-gray-50">
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
                  Confiez-nous votre bien et découvrez ce que signifie vraiment
                  « revenus passifs ». Votre première consultation est gratuite.
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