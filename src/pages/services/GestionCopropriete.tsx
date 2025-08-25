import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building2, CheckCircle, ArrowRight, Phone, Users, FileText, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <section className="pt-32 pb-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Gestion de Copropriété</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Gestion de <span className="gradient-text">Copropriété</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                La pérennité au service de votre immeuble avec une gestion professionnelle et transparente. 
                Nous garantissons la valorisation et la préservation de votre patrimoine collectif.
              </p>
              <Button size="lg" asChild className="hover-glow">
                <Link to="/contact">
                  Demander un audit gratuit
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
                  Une expertise <span className="gradient-text">reconnue</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Fort de notre expérience dans la gestion de copropriétés parisiennes, 
                  nous mettons notre savoir-faire au service de la valorisation de votre patrimoine. 
                  Transparence, rigueur et proximité sont nos maîtres-mots.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {expertise.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="glass-strong p-6 hover-lift border-0 shadow-card">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Conformité <span className="gradient-text">réglementaire</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Nous respectons scrupuleusement toutes les obligations légales
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Loi ALUR</h3>
                  <p className="text-sm text-muted-foreground">Respect total des dispositions légales</p>
                </Card>
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Garantie Financière</h3>
                  <p className="text-sm text-muted-foreground">Protection des fonds des copropriétaires</p>
                </Card>
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Certification</h3>
                  <p className="text-sm text-muted-foreground">Syndic professionnel certifié</p>
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
                Votre copropriété mérite une gestion d'excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Confiez-nous la gestion de votre immeuble et bénéficiez de notre expertise reconnue
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

export default GestionCopropriete;