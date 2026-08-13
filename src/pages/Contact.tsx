import { Card } from '@/components/ui/card';
import { HORAIRES } from '@/config/legal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Calculator,
  User,
  Building,
  Calendar,
  ArrowRight,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FormulaireContact from '@/components/FormulaireContact';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01.42.25.78.24",
      description: HORAIRES.semaine,
      color: "bg-primary"
    },
    {
      icon: Mail,
      title: "Email",
      value: "j.immo.p@orange.fr",
      description: "Réponse sous 24h",
      color: "bg-primary"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "27, Rue de Lisbonne",
      description: "75008 Paris",
      color: "bg-primary"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: HORAIRES.detail,
      description: "Lundi au Vendredi",
      color: "bg-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-subtle relative overflow-hidden">
          {/* Floating Elements for Visual Appeal */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float hidden lg:block"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-primary-glow/20 rounded-full blur-2xl animate-float hidden lg:block" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/8 rounded-full blur-xl animate-float hidden lg:block" style={{animationDelay: '4s'}}></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6">
                <MessageSquare className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Contactez-nous</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Parlons de votre <span className="gradient-text">projet</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Notre équipe d'experts est à votre écoute pour vous accompagner dans tous vos projets immobiliers. 
                N'hésitez pas à nous contacter pour un conseil personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="hover-glow group" asChild>
                  <Link to="#contact-form">
                    <Heart className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Remplir le formulaire
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="glass border-primary/30" asChild>
                  <a href="tel:0142257824">
                    <Phone className="mr-2 w-5 h-5" />
                    01.42.25.78.24
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section id="contact-form" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Contact Form */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Formulaire de contact</h3>
                
                <FormulaireContact idPrefix="page" />
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
                
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card 
                      key={info.title}
                      className="glass p-6 hover-lift group border-0 shadow-card mb-4"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {info.title}
                          </h4>
                          <p className="text-lg font-medium mb-1">
                            {info.value}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Map - Full Width */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Notre localisation</h3>
                <p className="text-muted-foreground">Venez nous rendre visite dans notre agence parisienne</p>
              </div>
              <Card className="glass border-0 shadow-card overflow-hidden hover-lift transition-all duration-300">
                <div className="h-80 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.284893470584!2d2.3122!3d48.8794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fb631be73b5%3A0x8c7bdeb21bcd25b1!2s27%20Rue%20de%20Lisbonne%2C%2075008%20Paris%2C%20France!5e0!3m2!1sfr!2sfr!4v1640995200000!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  <div className="absolute top-4 right-4 glass rounded-lg p-3 backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-xs">27, Rue de Lisbonne</p>
                        <p className="text-xs text-muted-foreground">75008 Paris</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 glass rounded-lg p-3 backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-xs">Métro : Miromesnil</p>
                        <p className="text-xs text-muted-foreground">Ligne 9 - 2 min à pied</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default Contact;
