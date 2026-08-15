import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, Users, Award, Target, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  // Excellence, Proximité, Transparence, Efficacité : quatre mots que tous les
  // concurrents affichent aussi. Remplacés par ce qu'un visiteur peut vérifier
  // en nous appelant.
  const values = [
    {
      icon: Users,
      title: "Un interlocuteur unique",
      description: "Le même gestionnaire suit votre dossier du premier appel à la signature. Pas de standard, pas de dossier qui change de mains."
    },
    {
      icon: Award,
      title: "Une réponse sous 24 heures",
      description: "Ouvrées. C'est l'engagement que nous tenons sur les appels comme sur les courriels."
    },
    {
      icon: Building2,
      title: "Gérance et syndic réunis",
      description: "Nous gérons des immeubles et des appartements. Quand nous vendons un lot, nous connaissons déjà la copropriété."
    },
    {
      icon: Target,
      title: "Indépendante depuis 2011",
      description: "Ni franchise, ni réseau : une agence de quartier, au 27 rue de Lisbonne, dirigée par ceux qui la portent."
    }
  ];

  // Repères vérifiables uniquement. Les chiffres de portefeuille, de
  // satisfaction et d'effectif ont été retirés : ils étaient inventés et se
  // contredisaient d'une page à l'autre (25+ ans ici, 15+ ailleurs).
  const stats = [
    { number: "2011", label: "Année de création" },
    { number: "Paris 8ᵉ", label: "27, rue de Lisbonne" },
    { number: "2", label: "Métiers : gérance et syndic" },
    { number: "24h", label: "Temps de réponse" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary-ink">À propos de nous</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Notre <span className="gradient-text">expertise</span> à votre service
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Depuis 2011, nous accompagnons propriétaires et copropriétés dans la gestion
                et la valorisation de leur patrimoine immobilier parisien.
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
                  Deux sociétés, deux métiers, une seule adresse : J.I.P. pour la gestion
                  locative et le syndic, Jobard Immobilier Patrimoine pour la transaction et
                  l'estimation. Le même interlocuteur suit votre dossier du premier appel à la
                  signature.
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
                  <h3 className="mb-4 text-xl font-semibold text-primary-ink">Ce que nous faisons</h3>
                  <p className="text-muted-foreground">
                    Nous gérons des appartements pour leurs propriétaires et des immeubles pour
                    leurs copropriétaires : loyers, travaux, assemblées générales, comptes.
                  </p>
                </Card>
                <Card className="glass-strong p-6 border-0 shadow-card">
                  <h3 className="mb-4 text-xl font-semibold text-primary-ink">Ce que nous ne faisons pas</h3>
                  <p className="text-muted-foreground">
                    Nous ne gérons pas au-delà de ce que nous pouvons suivre. Le portefeuille reste
                    à la taille d'une agence où l'on connaît chaque immeuble.
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
              <h2 className="mb-4 text-4xl font-bold">
                Nos <span className="gradient-text">engagements</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Quatre choses que vous pouvez vérifier en nous appelant
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
                Ce qui est vérifiable au registre du commerce
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2 text-4xl font-bold text-primary-ink md:text-5xl">{stat.number}</div>
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