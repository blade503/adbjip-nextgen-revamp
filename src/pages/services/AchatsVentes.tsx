import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Handshake, CheckCircle, ArrowRight, Phone, Key, Search, Users, FileCheck, MessageSquare, Calculator, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import AchatVenteImage from '@/assets/VenteDeBiens.webp';

const AchatsVentes = () => {
  const servicesVente = [
    "Estimation gratuite et précise de votre bien",
    "Mise en valeur et home staging",
    "Diffusion multi-canaux des annonces",
    "Négociation optimisée du prix de vente",
    "Accompagnement juridique complet",
    "Suivi jusqu'à la signature chez le notaire",
    "Rédaction et suivi du compromis",
    "Discrétion sur les ventes sensibles"
  ];

  const servicesAchat = [
    "Recherche personnalisée selon vos critères",
    "Accès à un portefeuille exclusif",
    "Négociation du prix d'achat",
    "Vérification juridique approfondie",
    "Accompagnement financement",
    "Organisation des visites",
    "Conseil en investissement locatif",
    "Suivi post-acquisition"
  ];

  const processSteps = [
    {
      icon: Search,
      title: "Analyse",
      description: "Étude de vos besoins et définition de la stratégie optimale"
    },
    {
      icon: Users,
      title: "Recherche",
      description: "Prospection active et mise en relation avec les bons profils"
    },
    {
      icon: Handshake,
      title: "Négociation",
      description: "Négociation experte pour obtenir les meilleures conditions"
    },
    {
      icon: FileCheck,
      title: "Finalisation",
      description: "Accompagnement jusqu'à la signature définitive"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={AchatVenteImage}
              alt="Achats et ventes immobilières professionnelles"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-secondary/80 via-secondary/50 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6">
                <Handshake className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Achats/Ventes de Biens</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Achats & <span className="gradient-text-light">Ventes</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                N'oubliez pas votre syndic pour la vente de votre bien ! Accompagnement de A à Z 
                pour vos projets d'acquisition et de cession immobilière à Paris.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    Échanger sur votre projet
                    <ArrowRight className="ml-2 w-5 h-5" />
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

        {/* Services Split */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Vente */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    Vendre votre <span className="gradient-text">bien</span>
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Valorisez votre patrimoine grâce à notre expertise du marché parisien. 
                  Nous maximisons la valeur de votre bien et réduisons les délais de vente.
                </p>
                <div className="space-y-3">
                  {servicesVente.map((service, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-ink flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-8 bg-primary hover:bg-primary" asChild>
                  <Link to="/contact">
                    Vendre mon bien
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Achat */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">
                    Acheter un <span className="gradient-text">bien</span>
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-8">
                  Trouvez le bien idéal grâce à notre réseau exclusif et notre connaissance 
                  approfondie du marché immobilier parisien.
                </p>
                <div className="space-y-3">
                  {servicesAchat.map((service, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-8 bg-secondary hover:bg-secondary" asChild>
                  <Link to="/contact">
                    Trouver mon bien
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Notre <span className="gradient-text">méthode</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Un accompagnement personnalisé à chaque étape
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="glass-strong p-6 text-center hover-lift border-0 shadow-card">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Pourquoi nous <span className="gradient-text">choisir</span> ?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-strong p-8 text-center border-0 shadow-card">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">Syndic et vendeur</h3>
                <p className="text-muted-foreground">
                  Nous administrons des immeubles que nous vendons aussi : charges, travaux votés, procédures en cours, le dossier est connu avant l'acquéreur
                </p>
              </Card>
              <Card className="glass-strong p-8 text-center border-0 shadow-card">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Négociation Experte</h3>
                <p className="text-muted-foreground">
                  Optimisation des conditions d'achat et de vente grâce à notre expertise
                </p>
              </Card>
              <Card className="glass-strong p-8 text-center border-0 shadow-card">
                <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sécurité Juridique</h3>
                <p className="text-muted-foreground">
                  Vérifications approfondies et accompagnement juridique complet
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6 text-center">
            <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à acheter ou vendre ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Parlons de votre projet immobilier et définissons ensemble la meilleure stratégie
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
                    Prendre rendez-vous
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

export default AchatsVentes;