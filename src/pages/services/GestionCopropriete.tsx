import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, CheckCircle, ArrowRight, Phone, Users, FileText, Calculator, MessageSquare, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import gestionCoproImage from '@/assets/GestionDeCopropriete2.webp';

const GestionCopropriete = () => {
  const services = [
    "Organisation d'assemblées générales",
    "Gestion comptable et budgétaire",
    "Suivi et coordination des travaux",
    "Conseil juridique spécialisé",
    "Gestion des contrats d'entretien",
    "Suivi des charges et répartition",
    "Relations avec les copropriétaires",
    "Tenue des registres obligatoires"
  ];

  const expertise = [
    {
      icon: Users,
      title: "Assemblées Générales",
      description: "Organisation complète : convocations, ordre du jour, procès-verbaux et suivi des décisions."
    },
    {
      icon: Calculator,
      title: "Gestion Comptable",
      description: "Tenue rigoureuse des comptes, budgets prévisionnels et décomptes annuels détaillés."
    },
    {
      icon: FileText,
      title: "Conseil Juridique",
      description: "Accompagnement sur tous les aspects légaux et réglementaires de la copropriété."
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
              src={gestionCoproImage}
              alt="Gestion de copropriété à Paris"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '4s'}}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6 animate-slide-up">
                <Building2 className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Gestion de Copropriété</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-slide-up" style={{animationDelay: '0.2s'}}>
                Gestion de <span className="gradient-text animate-pulse">Copropriété</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
                La pérennité au service de votre immeuble avec une gestion professionnelle et transparente. 
                Nous garantissons la valorisation et la préservation de votre patrimoine collectif.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.6s'}}>
                <Button size="lg" asChild className="hover-glow group">
                  <Link to="/contact">
                    Demander un audit gratuit
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="glass border-primary/30 group" asChild>
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    01.42.25.78.24
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>


                {/* Pourquoi choisir JIP - Design Sexy */}
                <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-2xl animate-pulse"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Header avec effet wow */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md border border-primary/20 rounded-full px-8 py-4 mb-8 animate-slide-up">
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-primary">Excellence & Innovation</span>
                  <div className="w-3 h-3 bg-gradient-primary rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  Pourquoi choisir <span className="gradient-text animate-pulse">JIP</span> ?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  Avec plus de 15 ans d'expérience dans la gestion de copropriétés parisiennes, 
                  JIP s'impose comme le partenaire de confiance pour la préservation et la valorisation de votre patrimoine immobilier.
                </p>
                
                {/* Stats intégrées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">2011</div>
                    <div className="text-sm text-muted-foreground">Agence créée en</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">Paris 8ᵉ</div>
                    <div className="text-sm text-muted-foreground">27, rue de Lisbonne</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">24h</div>
                    <div className="text-sm text-muted-foreground">Délai de réponse</div>
                  </div>
                </div>
              </div>

              {/* Grille 2x3 avec design premium */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                
                {/* Carte 1 - Suivi individuel */}
                <div className="group animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 border border-blue-200/50 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/30">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-blue-800 group-hover:text-blue-900 transition-colors">Suivi Individuel</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-blue-600">Personnalisé</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-blue-700/80 leading-relaxed">
                        Chaque copropriété bénéficie d'un accompagnement sur-mesure et d'une attention particulière de nos experts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte 2 - Contrat transparent */}
                <div className="group animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-green-100/50 p-8 border border-green-200/50 hover:border-green-300 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-500/30">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-green-800 group-hover:text-green-900 transition-colors">Contrat Transparent</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-600">Sans Surprise</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-green-700/80 leading-relaxed">
                        Des conditions claires, une tarification transparente et des engagements précis pour votre tranquillité.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte 3 - Équipe réactive */}
                <div className="group animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 border border-purple-200/50 hover:border-purple-300 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-purple-500/30">
                          <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors">Équipe Réactive</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-purple-600">24h/7j</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-purple-700/80 leading-relaxed">
                        Une équipe disponible et à l'écoute pour répondre rapidement à tous vos besoins et questions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte 4 - Rigueur comptable */}
                <div className="group animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 border border-orange-200/50 hover:border-orange-300 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-orange-500/30">
                          <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-orange-800 group-hover:text-orange-900 transition-colors">Rigueur Comptable</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-orange-600">Optimisation</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-orange-700/80 leading-relaxed">
                        Notre contrôle rigoureux conduit à une réduction significative des principaux postes de dépenses de votre immeuble.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carte 5 - Analyse des charges */}
                <div className="group animate-slide-up" style={{animationDelay: '0.5s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100/50 p-8 border border-teal-200/50 hover:border-teal-300 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-teal-500/30">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-teal-800 group-hover:text-teal-900 transition-colors">Analyse des Charges</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-teal-600">Performance</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-teal-700/80 leading-relaxed">
                        Une analyse approfondie de vos charges et engagements pour optimiser votre gestion et réduire vos coûts.
                      </p>
                    </div>
                </div>
              </div>

                {/* Carte 6 - Équipe fournisseurs */}
                <div className="group animate-slide-up" style={{animationDelay: '0.6s'}}>
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/50 p-8 border border-pink-200/50 hover:border-pink-300 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-pink-500/30">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-pink-800 group-hover:text-pink-900 transition-colors">Réseau Fournisseurs</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-pink-600">Qualité</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-pink-700/80 leading-relaxed">
                        Un réseau de fournisseurs triés sur le volet, au service exclusif des copropriétaires pour des prestations de qualité.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte spéciale - Observatoire */}
              <div className="animate-slide-up" style={{animationDelay: '0.7s'}}>
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-12 border border-primary/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center space-x-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold gradient-text mb-2">Observatoire de Charges</h3>
                        <div className="flex items-center justify-center space-x-4">
                          <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">UNIS</span>
                          <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">FNAIM</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                      En collaboration avec <strong>UNIS</strong> et <strong>FNAIM</strong>, nous comparons les dépenses de votre copropriété 
                      à celles d'autres copropriétés pour une gestion optimale et des économies garanties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rôle du syndic - Design Hexagones */}
        <section className="py-16 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-1/4 w-16 h-16 bg-secondary/5 rounded-full blur-xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center animate-slide-up">
                Quel est le <span className="gradient-text">rôle du syndic</span> ?
              </h2>
              
              {/* Rôles par catégories */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Catégorie Administrative */}
                <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">Administratif</h3>
                    <p className="text-sm text-muted-foreground">Gestion administrative et organisationnelle</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-800">Préservation du patrimoine</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-800">Mise en œuvre des décisions d'AG</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-800">Gestion du quotidien et de l'avenir</span>
                    </div>
                  </div>
                </div>

                {/* Catégorie Juridique */}
                <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Juridique</h3>
                    <p className="text-sm text-muted-foreground">Conseil et conformité réglementaire</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-800">Devoir de conseil</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-800">Suivi des évolutions réglementaires</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-800">Respect du règlement</span>
                    </div>
                  </div>
                </div>

                {/* Catégorie Financière */}
                <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">Financière</h3>
                    <p className="text-sm text-muted-foreground">Transparence et gestion comptable</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calculator className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-purple-800">Transparence comptable et financière</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gercop Copropriété - Style Tech/Digital */}
        <section className="py-20 bg-background relative overflow-hidden">
          {/* Background Effects Tech */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="grid grid-cols-8 gap-4 opacity-5 rotate-12">
                {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              {/* Header avec badge tech */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full mb-8 animate-slide-up shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <span className="text-sm font-bold">PLATEFORME EN LIGNE 24/7</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-pulse">Gercop</span> 
                  <span className="text-foreground"> Copropriété</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
                  Interface digitale moderne pour une gestion transparente et accessible
                </p>
              </div>

              {/* Layout différent - Cards asymétriques */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Grande carte - Informations personnelles */}
                <div className="col-span-12 lg:col-span-7 animate-slide-up" style={{animationDelay: '0.1s'}}>
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200/50 h-full hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 group">
                      <div className="flex items-start space-x-6 mb-8">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-blue-800 mb-2">Espace Personnel</h3>
                          <p className="text-blue-600 font-medium">Accès sécurisé à vos données</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-blue-200/30 hover:bg-white hover:border-blue-300 transition-all">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">€</span>
                            </div>
                            <span className="text-blue-800 font-medium">Situation comptable</span>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-blue-200/30 hover:bg-white hover:border-blue-300 transition-all">
                            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">📋</span>
                            </div>
                            <span className="text-blue-800 font-medium">Appels de provisions</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-xl border border-blue-200/30 hover:bg-white hover:border-blue-300 transition-all">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-bold">📊</span>
                            </div>
                            <span className="text-blue-800 font-medium">Relevé de dépenses</span>
                          </div>
                          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                            <p className="text-sm font-semibold">✓ Disponible 24h/24</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card plus petite - Informations immeuble */}
                <div className="col-span-12 lg:col-span-5 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 border border-cyan-200/50 h-full hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 group">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-cyan-800 mb-1">Immeuble</h3>
                        <p className="text-cyan-600 text-sm">Documents collectifs</p>
                      </div>
                      
                      <div className="space-y-3">
                        {['Convocations', 'Procès-verbaux AG', 'Comptes-rendus'].map((item, index) => (
                          <div key={item} className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-cyan-200/30 hover:bg-white transition-all">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            <span className="text-cyan-800 text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte full width - Conseil Syndical */}
                <div className="col-span-12 animate-slide-up" style={{animationDelay: '0.3s'}}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 border border-slate-700 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500">
                      {/* Circuit board pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-32 h-0.5 bg-cyan-400"></div>
                        <div className="absolute top-4 left-36 w-0.5 h-16 bg-cyan-400"></div>
                        <div className="absolute top-20 left-36 w-24 h-0.5 bg-cyan-400"></div>
                        <div className="absolute bottom-4 right-4 w-40 h-0.5 bg-blue-400"></div>
                        <div className="absolute bottom-4 right-44 w-0.5 h-20 bg-blue-400"></div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                            <h3 className="text-3xl font-bold text-white">Accès Conseil Syndical</h3>
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">PREMIUM</span>
                          </div>
                          <p className="text-slate-300 text-lg leading-relaxed">
                            Interface avancée avec accès aux <span className="text-cyan-400 font-semibold">factures</span>, 
                            <span className="text-blue-400 font-semibold"> contrats</span>, 
                            <span className="text-cyan-400 font-semibold"> interventions</span> et 
                            <span className="text-blue-400 font-semibold"> sinistres</span> en temps réel.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informations internet - Style Communication/News */}
        <section className="py-20 relative overflow-hidden">
          {/* Background artistique */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Formes géométriques */}
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-emerald-200 rounded-2xl rotate-12 animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 bg-emerald-100 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-20 w-16 h-64 bg-gradient-to-b from-emerald-200 to-transparent rounded-full rotate-45 opacity-30"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-2 bg-gradient-to-r from-emerald-300 to-transparent rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              {/* Header style magazine */}
              <div className="text-center mb-20">
                <div className="relative inline-block mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-white border-2 border-emerald-200 rounded-2xl px-8 py-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                      <span className="text-emerald-700 font-black text-sm uppercase tracking-widest">LIVE UPDATES</span>
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-6xl md:text-7xl font-black mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">Infos</span>
                  <br />
                  <span className="text-slate-800">Internet</span>
                </h2>
                <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-medium animate-slide-up" style={{animationDelay: '0.4s'}}>
                  Communication instantanée et transparente
                </p>
              </div>

              {/* Layout style journal/magazine */}
              <div className="space-y-8">
                
                {/* Section principale - style journal */}
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Article principal */}
                  <div className="col-span-12 lg:col-span-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <article className="bg-white rounded-2xl shadow-xl border-l-8 border-emerald-500 overflow-hidden hover:shadow-2xl hover:border-emerald-600 transition-all duration-500 group">
                      <div className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800">La Vie de ma Copropriété</h3>
                            <p className="text-emerald-600 font-semibold text-sm">NOTIFICATIONS EN TEMPS RÉEL</p>
                          </div>
                        </div>
                        
                        {/* Timeline style */}
                        <div className="space-y-4">
                          {[
                            { icon: '🔧', text: 'Ascenseur en panne', time: '2h', urgent: true },
                            { icon: '🚰', text: 'Intervention du plombier', time: '1j', urgent: false },
                            { icon: '🔐', text: 'Changement du code d\'entrée', time: '3j', urgent: false },
                            { icon: '📅', text: 'Rappel de la date d\'assemblée générale', time: '1sem', urgent: false }
                          ].map((item, index) => (
                            <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all hover:shadow-lg ${item.urgent ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                              <div className="text-2xl">{item.icon}</div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-800">{item.text}</p>
                                <p className={`text-xs ${item.urgent ? 'text-red-600' : 'text-emerald-600'}`}>Il y a {item.time}</p>
                              </div>
                              {item.urgent && (
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Sidebar */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    
                    {/* Compte-rendu - style card compacte */}
                    <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                      <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="font-bold text-lg">Compte-Rendu</h3>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">
                          Bilan complet joint à chaque convocation d'assemblée générale.
                        </p>
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Documentation</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats rapides */}
                    <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                        <h4 className="font-bold text-slate-800 mb-4 text-center">Cette semaine</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-emerald-600">8</div>
                            <div className="text-xs text-slate-500">Notifications</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-teal-600">3</div>
                            <div className="text-xs text-slate-500">Interventions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer section - style bannière */}
                <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-emerald-800 to-slate-800 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 rounded-2xl p-8 border border-emerald-700">
                      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Calculator className="w-10 h-10 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="text-3xl font-bold text-white mb-4">
                            Suivi Complet & Transparent
                          </h3>
                          <p className="text-emerald-100 text-lg leading-relaxed">
                            <span className="text-emerald-400 font-bold">État des comptes</span>, suivi des 
                            <span className="text-teal-400 font-bold"> travaux</span>, des 
                            <span className="text-emerald-400 font-bold"> sinistres</span> et des 
                            <span className="text-teal-400 font-bold"> procédures</span>. 
                            Toutes les informations de votre immeuble centralisées.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="glass-strong rounded-2xl p-12 max-w-4xl mx-auto hover-lift transition-all duration-300">
              <h2 className="text-3xl font-bold mb-4 animate-slide-up">
                Votre copropriété mérite une gestion d'<span className="gradient-text animate-pulse">excellence</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                Confiez-nous la gestion de votre immeuble et bénéficiez de notre expertise reconnue
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Button size="lg" asChild className="hover-glow group">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    01.42.25.78.24
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="group">
                  <Link to="/contact">
                    Demander un devis
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

export default GestionCopropriete;