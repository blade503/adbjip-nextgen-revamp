import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Calendar
} from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01.42.25.78.24",
      description: "Lun-Ven 9h-18h",
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
      value: "9h - 18h",
      description: "Lundi au Vendredi",
      color: "bg-primary"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-md border border-white/40 rounded-full px-6 py-3 mb-6">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Contactez-nous</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Parlons de votre <span className="gradient-text">projet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions 
            et vous accompagner dans vos projets immobiliers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Formulaire de contact</h3>
            
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
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Service souhaité
                </label>
                <select
                  id="service"
                  className="w-full px-4 py-3 rounded-lg glass border-primary/20 focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">Sélectionnez un service</option>
                  <option value="gestion-locative">Gestion Locative</option>
                  <option value="gestion-copropriete">Gestion de Copropriété</option>
                  <option value="achats-ventes">Achats & Ventes</option>
                  <option value="estimation">Estimation de Biens</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet ou votre demande..."
                  rows={6}
                  className="glass border-primary/20 focus:border-primary resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground hover-glow group"
              >
                <Send className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Envoyer le message
              </Button>
            </form>
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

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un rendez-vous ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nos experts sont disponibles pour vous recevoir dans nos bureaux
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="hover-glow group">
                <Calendar className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Prendre rendez-vous
              </Button>
              <Button size="lg" variant="outline" className="glass border-primary/30">
                <Phone className="mr-2 w-5 h-5" />
                01.42.25.78.24
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;