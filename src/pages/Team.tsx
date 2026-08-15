import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Mail, Phone, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import florentImage from '@/assets/equipe-florent-jobard.webp';
import francisImage from '@/assets/equipe-francis-jobard.webp';

const Team = () => {
  // Uniquement les personnes réellement présentes dans l'agence — les deux
  // autres profils étaient inventés, avec des adresses e-mail qui n'existent
  // pas. À compléter par le client, pas par le code.
  const team = [
    {
      name: "Florent Jobard",
      photo: florentImage,
      role: "Directeur Général",
      location: "143, Rue Saint Denis - 75002 Paris",
      phone: "06.62.91.73.35",
      email: "j.immo.p@orange.fr",
      specialties: ["Gestion Locative", "Négociation", "Développement Commercial"],
      description: "Plus de 20 ans d'expérience dans l'immobilier parisien, expert en gestion locative et négociation."
    },
    {
      name: "Francis Jobard",
      photo: francisImage,
      role: "Directeur des Copropriétés",
      location: "27, Rue de Lisbonne - 75008 Paris",
      phone: "01.42.25.78.24",
      email: "copro@adbjip.fr",
      specialties: ["Gestion de Copropriété", "Conseil Juridique", "Assemblées Générales"],
      description: "Spécialiste reconnu en droit de la copropriété avec une expertise approfondie des réglementations."
    },
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
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Notre Équipe</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Rencontrez notre <span className="gradient-text">équipe</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Des professionnels passionnés et expérimentés, unis par la même volonté 
                d'excellence dans le service client et la gestion immobilière.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="glass-strong p-8 hover-lift border-0 shadow-card">
                  <div className="flex items-start space-x-6">
                    <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={member.photo}
                        alt={`${member.name}, ${member.role.toLowerCase()}`}
                        width={700}
                        height={875}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-semibold mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{member.email}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Spécialités :</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Notre <span className="gradient-text">culture d'entreprise</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Une équipe soudée par des valeurs communes et l'excellence du service
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-3">Esprit d'équipe</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaboration et entraide pour offrir le meilleur service à nos clients
                  </p>
                </Card>
                
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Adaptation constante aux évolutions du marché et des technologies
                  </p>
                </Card>
                
                <Card className="glass-strong p-6 text-center border-0 shadow-card">
                  <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3">Proximité</h3>
                  <p className="text-sm text-muted-foreground">
                    Relation privilégiée et personnalisée avec chacun de nos clients
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
                Une question ? Un projet ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Notre équipe est à votre disposition pour répondre à vos besoins
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="hover-glow">
                  <Link to="/contact">
                    <Phone className="mr-2 w-5 h-5" />
                    Nous contacter
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/services/gestion-locative">
                    Découvrir nos services
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

export default Team;